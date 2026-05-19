"""
Classify all bar exam questions in MongoDB against the 2026 Bar Syllabus.

This script does three things in one pass:
1. NORMALIZE — Clean messy subject names → 6 standard names, fix year=0
2. CLASSIFY — Use Groq AI to match each question to a syllabus subtopic
3. UPDATE — Write classification fields back to MongoDB

Usage:
    python3 scripts/classify-questions.py              # Full run
    python3 scripts/classify-questions.py --dry-run    # Preview without updating DB
    python3 scripts/classify-questions.py --test 5     # Classify only 5 questions first
    python3 scripts/classify-questions.py --normalize-only  # Only normalize, skip AI

Requires:
    pip3 install pymongo groq dnspython
    GROQ_API_KEY in environment or .env file
"""

import json
import certifi
import os
import re
import sys
import time
import argparse
from pymongo import MongoClient
from groq import Groq

# ─── Configuration ───────────────────────────────────────────────────────────

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)

SYLLABUS_PATH = os.path.join(PROJECT_ROOT, "apps", "web", "data", "syllabus-2026.json")

# Load from pls-file-extractor .env or set directly
MONGODB_URI = os.getenv("MONGODB_URI", "")
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")

DB_NAME = "PhBarExams"
COLLECTION_NAME = "questions"

# Groq model — fast and capable (use 8b to avoid tokens-per-minute limits)
GROQ_MODEL = "llama-3.1-8b-instant"

# Rate limiting: Groq free tier = 30 req/min, 30,000 TPM
RATE_LIMIT_DELAY = 5.0  # seconds between requests (safe for 30,000 TPM limit)

# ─── Subject Normalization Map ───────────────────────────────────────────────
# Maps every raw MongoDB `subject` value to the clean 2026 syllabus subject name + slug

SUBJECT_MAP = {
    # ── Political Law ──
    "2019 Political and International Law": ("Political and Public International Law", "political-law"),
    "2020-21 The Law Pertaining to the State and its Relationship with its Citizens (1)": ("Political and Public International Law", "political-law"),
    "2022 Political and International Law": ("Political and Public International Law", "political-law"),
    "1.-Political-and-Public-International-Law-2023-Bar-Exam-Suggested-Answers-v.2": ("Political and Public International Law", "political-law"),
    "Political Law - Suggested Answers to the 2024 Bar Examination": ("Political and Public International Law", "political-law"),
    "Suggested Answers 2025 Political and Public International Law Bar Exams": ("Political and Public International Law", "political-law"),

    # ── Commercial and Taxation Laws ──
    "2019 Mercantile Law": ("Commercial and Taxation Laws", "commercial-law"),
    "2019 Taxation Law": ("Commercial and Taxation Laws", "commercial-law"),
    "2022 Commercial Law": ("Commercial and Taxation Laws", "commercial-law"),
    "2. Commercial and Taxation Laws - 2023 Bar Exam Suggested Answers": ("Commercial and Taxation Laws", "commercial-law"),
    "Commercial Law and Taxation - Suggested Answers to the 2024 Bar Examination": ("Commercial and Taxation Laws", "commercial-law"),
    "2025 Bar Exams Commercial and Taxation Laws - Suggested Answers (Final)": ("Commercial and Taxation Laws", "commercial-law"),

    # ── Civil Law ──
    "2019 Civil Law": ("Civil Law and Land Titles and Deeds", "civil-law"),
    "2020-21 The Law Pertaining to Private, Personal, and Commercial Relations": ("Civil Law and Land Titles and Deeds", "civil-law"),
    "2022 Civil Law I": ("Civil Law and Land Titles and Deeds", "civil-law"),
    "2022 Civil Law II (with Practical Exercises)": ("Civil Law and Land Titles and Deeds", "civil-law"),
    "3. Civil Law - 2023 Bar Exam Suggested Answers": ("Civil Law and Land Titles and Deeds", "civil-law"),
    "Civil Law - Suggested Answers to the 2024 Bar Examination": ("Civil Law and Land Titles and Deeds", "civil-law"),
    "2025 Bar Exams Suggested Answers in Civil Law -UP Law Bar Review Institute": ("Civil Law and Land Titles and Deeds", "civil-law"),

    # ── Labor Law ──
    "2019 Labor Law": ("Labor and Social Legislation", "labor-law"),
    "2022 Labor Law and Social Legislation": ("Labor and Social Legislation", "labor-law"),
    "4. Labor Law - 2023 Bar Exam Suggested Answers": ("Labor and Social Legislation", "labor-law"),
    "Labor Law - Suggested Answers to the 2024 Bar Exams": ("Labor and Social Legislation", "labor-law"),
    "2025 Bar Exams Suggested Answers Labor Law (Final)": ("Labor and Social Legislation", "labor-law"),

    # ── Criminal Law ──
    "2019 Criminal Law": ("Criminal Law", "criminal-law"),
    "2020-21 Criminal Law": ("Criminal Law", "criminal-law"),
    "2022 Criminal Law": ("Criminal Law", "criminal-law"),
    "5. Criminal Law - 2023 Bar Exam Suggested Answers": ("Criminal Law", "criminal-law"),
    "Criminal Law - Suggested Answers to the 2024 Bar Examinations": ("Criminal Law", "criminal-law"),
    "2025 Bar Exams Suggested Answers in Criminal Law - UP Law Bar Review Institute": ("Criminal Law", "criminal-law"),

    # ── Remedial Law ──
    "2019 Remedial Law": ("Remedial Law, Legal and Judicial Ethics, with Practical Exercises", "remedial-law"),
    "2019 Legal and Judicial Ethics": ("Remedial Law, Legal and Judicial Ethics, with Practical Exercises", "remedial-law"),
    "2020-21 Procedure and Professional Ethics": ("Remedial Law, Legal and Judicial Ethics, with Practical Exercises", "remedial-law"),
    "2022 Remedial Law I": ("Remedial Law, Legal and Judicial Ethics, with Practical Exercises", "remedial-law"),
    "2022 Remedial Law II (with Basic Tax Remedies) and Legal Ethics": ("Remedial Law, Legal and Judicial Ethics, with Practical Exercises", "remedial-law"),
    "6. Remedial Law, Legal  Judicial Ethics w Practical Exercises - 2023 Bar Exam Suggested Answers": ("Remedial Law, Legal and Judicial Ethics, with Practical Exercises", "remedial-law"),
    "Remedial Law and Ethics - Suggested Answers to the 2024 Bar Examinations": ("Remedial Law, Legal and Judicial Ethics, with Practical Exercises", "remedial-law"),
    "2025 Bar Exams Suggested Answers in Remedial Law, Legal and Judicial Ethics with Practical Exercises - UP Law Bar Review Institute": ("Remedial Law, Legal and Judicial Ethics, with Practical Exercises", "remedial-law"),
}

# Year normalization: fix year=0 for 2020-21 batch
YEAR_FIXES = {
    "2020-21 Criminal Law": 2020,
    "2020-21 Procedure and Professional Ethics": 2020,
    "2020-21 The Law Pertaining to Private, Personal, and Commercial Relations": 2020,
    "2020-21 The Law Pertaining to the State and its Relationship with its Citizens (1)": 2020,
}


# ─── Helpers ─────────────────────────────────────────────────────────────────


def slugify(text: str) -> str:
    """Convert a title to a URL-friendly slug."""
    text = re.sub(r"\s*\(.*?\)\s*", " ", text)
    text = text.replace("&", "and")
    text = re.sub(r"[^\w\s-]", "", text)
    text = re.sub(r"[\s_]+", "-", text.strip())
    return text.lower().strip("-")


def load_syllabus() -> dict:
    """Load the syllabus JSON."""
    with open(SYLLABUS_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


def build_subject_syllabus_text(syllabus: dict, subject_slug: str) -> str:
    """
    Build a formatted text representation of all topics and subtopics
    for a given subject, to include in the AI prompt.
    """
    for subj in syllabus["subjects"]:
        if subj["slug"] == subject_slug:
            lines = []
            for topic in subj["topics"]:
                lines.append(f"{topic['roman']}. {topic['title']} (slug: {topic['slug']})")
                for sub in topic["subtopics"]:
                    lines.append(f"  {sub['letter']}. {sub['title']} (slug: {sub['slug']})")
            return "\n".join(lines)
    return ""


def classify_question(client: Groq, question_text: str, syllabus_text: str, model: str = GROQ_MODEL) -> dict:
    """
    Use Groq AI to classify a bar exam question into a syllabus topic + subtopic.
    Returns: { topic_slug, topic_title, subtopic_slug, subtopic_title, confidence }
    """
    prompt = f"""You are a Philippine Bar Examination classifier. Given a bar exam question and a syllabus outline, determine which specific SUBTOPIC (letter level: A, B, C, etc.) the question belongs to.

SYLLABUS OUTLINE:
{syllabus_text}

QUESTION:
{question_text}

INSTRUCTIONS:
1. Identify the SINGLE most relevant subtopic (letter level) that this question tests.
2. Return ONLY a JSON object with these exact fields — no other text:
{{
  "topic_slug": "<slug of the Roman numeral topic>",
  "topic_title": "<full title of the Roman numeral topic>",
  "subtopic_slug": "<slug of the letter-level subtopic>",
  "subtopic_title": "<full title of the letter-level subtopic>",
  "confidence": <number between 0.0 and 1.0>
}}

If the question doesn't clearly match any subtopic, pick the closest one and set confidence below 0.5.
Return ONLY the JSON object, no markdown formatting, no explanation."""

    response = client.chat.completions.create(
        model=model,
        messages=[{"role": "user", "content": prompt}],
        temperature=0.1,  # Low temperature for consistent classification
        max_tokens=300,
    )

    content = response.choices[0].message.content.strip()

    # Strip markdown code fences if present
    if content.startswith("```"):
        content = re.sub(r"^```\w*\n?", "", content)
        content = re.sub(r"\n?```$", "", content)
        content = content.strip()

    try:
        result = json.loads(content)
        return result
    except json.JSONDecodeError:
        print(f"    ⚠ Failed to parse AI response: {content[:100]}")
        return None


# ─── Main ────────────────────────────────────────────────────────────────────


def main():
    parser = argparse.ArgumentParser(description="Classify bar exam questions by syllabus topic")
    parser.add_argument("--dry-run", action="store_true", help="Preview without updating DB")
    parser.add_argument("--test", type=int, default=0, help="Classify only N questions for testing")
    parser.add_argument("--normalize-only", action="store_true", help="Only normalize subjects/years, skip AI classification")
    parser.add_argument("--subject", type=str, default=None, help="Only process a specific subject slug (e.g. labor-law)")
    args = parser.parse_args()

    # Load syllabus
    print("Loading syllabus...")
    syllabus = load_syllabus()
    print(f"  {len(syllabus['subjects'])} subjects loaded")

    # Connect to MongoDB
    print("Connecting to MongoDB...")
    client_mongo = MongoClient(MONGODB_URI, tlsCAFile=certifi.where())
    db = client_mongo[DB_NAME]
    collection = db[COLLECTION_NAME]
    total = collection.count_documents({})
    print(f"  {total} questions in database")

    # Initialize Groq client
    groq_client = None
    if not args.normalize_only:
        groq_client = Groq(api_key=GROQ_API_KEY)
        print(f"  Groq model: {GROQ_MODEL}")

    # ── Step 1: Normalize subjects and years ──
    print("\n" + "=" * 60)
    print("STEP 1: Normalizing subjects and years")
    print("=" * 60)

    normalize_count = 0
    unmapped_subjects = set()

    for doc in collection.find({}, {"_id": 1, "subject": 1, "year": 1}):
        raw_subject = doc["subject"]
        updates = {}

        # Normalize subject
        if raw_subject in SUBJECT_MAP:
            clean_name, clean_slug = SUBJECT_MAP[raw_subject]
            updates["subject_normalized"] = clean_name
            updates["subject_slug"] = clean_slug
        else:
            unmapped_subjects.add(raw_subject)
            continue

        # Fix year
        if doc.get("year") == 0 and raw_subject in YEAR_FIXES:
            updates["year"] = YEAR_FIXES[raw_subject]

        if updates and not args.dry_run:
            collection.update_one({"_id": doc["_id"]}, {"$set": updates})
            normalize_count += 1
        elif updates:
            normalize_count += 1

    print(f"  ✅ Normalized {normalize_count} documents")
    if unmapped_subjects:
        print(f"  ⚠ Unmapped subjects ({len(unmapped_subjects)}):")
        for s in sorted(unmapped_subjects):
            print(f"      - {s}")

    if args.normalize_only:
        print("\n✅ Normalization complete. Skipping AI classification (--normalize-only)")
        return

    # ── Step 2: AI Classification ──
    print("\n" + "=" * 60)
    print("STEP 2: AI Classification (Groq)")
    print("=" * 60)

    # Build query — find documents that have been normalized
    query = {}
    if args.subject:
        query["subject_slug"] = args.subject
        print(f"  Filtering to subject: {args.subject}")

    all_docs = list(collection.find(query))
    
    # Filter in Python to avoid Atlas server-side $exists queries which are buggy/unindexed
    questions = []
    for doc in all_docs:
        if "subject_slug" in doc and "syllabus_topic_slug" not in doc:
            questions.append(doc)
            
    total_to_classify = len(questions)

    if args.test > 0:
        questions = questions[:args.test]
        print(f"  TEST MODE: classifying {len(questions)} of {total_to_classify} questions")
    else:
        print(f"  Classifying {total_to_classify} questions...")

    # Cache syllabus text per subject to avoid rebuilding
    syllabus_cache = {}

    classified = 0
    failed = 0

    for i, doc in enumerate(questions):
        subject_slug = doc["subject_slug"]
        question_text = doc.get("question_text", "")

        if not question_text.strip():
            print(f"  [{i+1}/{len(questions)}] SKIP — empty question text (id: {doc['unique_id']})")
            continue

        # Get/build syllabus text for this subject
        if subject_slug not in syllabus_cache:
            syllabus_cache[subject_slug] = build_subject_syllabus_text(syllabus, subject_slug)

        syllabus_text = syllabus_cache[subject_slug]

        # Truncate very long questions to avoid token limits
        q_text = question_text[:2000] if len(question_text) > 2000 else question_text

        print(f"  [{i+1}/{len(questions)}] Classifying: {doc['unique_id'][:50]}...", end=" ", flush=True)

        try:
            # Fallback rotation logic: Try 8B first, if rate limited rotate to 70B immediately
            try:
                result = classify_question(groq_client, q_text, syllabus_text, "llama-3.1-8b-instant")
            except Exception as e:
                if "rate_limit" in str(e).lower() or "429" in str(e):
                    print("🔄 (TPM limit — rotating to 70B)...", end=" ", flush=True)
                    result = classify_question(groq_client, q_text, syllabus_text, "llama-3.3-70b-versatile")
                else:
                    raise e

            if result and "topic_slug" in result and "subtopic_slug" in result:
                updates = {
                    "syllabus_topic": result.get("topic_title", ""),
                    "syllabus_topic_slug": result["topic_slug"],
                    "syllabus_subtopic": result.get("subtopic_title", ""),
                    "syllabus_subtopic_slug": result["subtopic_slug"],
                    "syllabus_path": [result.get("topic_title", ""), result.get("subtopic_title", "")],
                    "classification_confidence": result.get("confidence", 0.0),
                }

                if not args.dry_run:
                    collection.update_one({"_id": doc["_id"]}, {"$set": updates})

                conf = result.get("confidence", 0)
                conf_icon = "✅" if conf >= 0.7 else "⚠️" if conf >= 0.4 else "❌"
                print(f"{conf_icon} → {result['topic_slug']}/{result['subtopic_slug']} ({conf:.0%})")
                classified += 1
            else:
                print("❌ — invalid response")
                failed += 1

        except Exception as e:
            print(f"❌ — error: {str(e)[:80]}")
            failed += 1

            # If both models are rate limited, wait longer
            if "rate_limit" in str(e).lower() or "429" in str(e):
                print("    ⏳ Both models rate limited — waiting 60 seconds...")
                time.sleep(60)

        # Rate limiting
        time.sleep(RATE_LIMIT_DELAY)

    # ── Summary ──
    print("\n" + "=" * 60)
    print("SUMMARY")
    print("=" * 60)
    print(f"  Classified: {classified}")
    print(f"  Failed:     {failed}")
    print(f"  Total:      {len(questions)}")
    if args.dry_run:
        print("  (DRY RUN — no changes written to DB)")

    # ── Coverage Report ──
    if classified > 0 and not args.dry_run:
        print("\n" + "=" * 60)
        print("COVERAGE REPORT")
        print("=" * 60)

        for subj in syllabus["subjects"]:
            slug = subj["slug"]
            total_q = collection.count_documents({"subject_slug": slug})
            classified_q = collection.count_documents({
                "subject_slug": slug,
                "syllabus_topic_slug": {"$exists": True}
            })
            print(f"\n  {subj['name']}:")
            print(f"    {classified_q}/{total_q} classified")

            for topic in subj["topics"]:
                count = collection.count_documents({
                    "subject_slug": slug,
                    "syllabus_topic_slug": topic["slug"]
                })
                if count > 0:
                    print(f"      {topic['roman']:>5}. {topic['title'][:45]:<45} [{count} questions]")


if __name__ == "__main__":
    main()
