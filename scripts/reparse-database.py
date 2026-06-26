import os
import re
import json
from pymongo import MongoClient

# ─── Configuration ───────────────────────────────────────────────────────────

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)
SYLLABUS_PATH = os.path.join(PROJECT_ROOT, "apps", "web", "data", "syllabus-2026.json")
ENV_PATH = os.path.join(PROJECT_ROOT, "apps", "web", ".env.local")

# Load MONGODB_URI from .env.local
if not os.path.exists(ENV_PATH):
    print(f"Error: .env.local not found at {ENV_PATH}")
    exit(1)

with open(ENV_PATH, "r", encoding="utf-8") as f:
    env_content = f.read()

match = re.search(r'MONGODB_URI="([^"]+)"', env_content)
if not match:
    print("Error: Could not find MONGODB_URI in .env.local")
    exit(1)
uri = match.group(1)

# Connect to MongoDB
print("Connecting to MongoDB...")
client = MongoClient(uri)
db = client["PhBarExams"]
collection = db["questions"]

# ─── Load Syllabus and Define Mappings ───────────────────────────────────────

with open(SYLLABUS_PATH, "r", encoding="utf-8") as f:
    syllabus = json.load(f)

# Define target mappings from our verified research
POLITICAL_MAPPING = {
    1: "academic-freedom",
    2: "chambers-of-congress-composition-qualifications",
    3: "rules-of-succession",
    4: "judicial-review",
    5: "autonomous-regions-and-their-relation-to-the-national-government",
    6: "the-civil-service",
    7: "dual-citizenship-and-dual-allegiance",
    8: "arrests-searches-and-seizures",
    9: "privacy-of-communications-and-correspondence",
    10: "freedom-of-religion",
    11: "fundamental-powers-of-the-state",
    12: "custodial-investigation",
    13: "nationality-and-citizenship-requirement-provisions",
    14: "accountability-of-public-officers",
    15: "accountability-of-public-officers",
    16: "state-immunity",
    17: "suffrage",
    18: "candidacy",
    19: "requisites-for-creation-conversion-division-merger-or-dissolution",
    20: "subjects-of-international-law",
}

COMMERCIAL_MAPPING = {
    1: "corporations-ra-no-11232",
    2: "corporations-ra-no-11232",
    3: "corporations-ra-no-11232",
    4: "corporations-ra-no-11232",
    5: "corporations-ra-no-11232",
    6: "the-central-bank-ra-no-7653-as-amended-by-ra-no-11211",
    7: "secrecy-of-bank-deposits-ra-no-1405-and-ra-no-6426-as-amended",
    8: "anti-money-laundering-ra-no-9160-as-amended-by-ra-no-9194",
    9: "insurable-interest",
    10: "rescission-of-insurance-contracts",
    11: "common-carriers",
    12: "trademarks",
    13: "copyright",
    14: "copyright",
    15: "commonwealth-act-no-146-as-amended-by-ra-no-11659-public-service",
    16: "general-principles",
    17: "national-taxation-national-internal-revenue-code-of-1997-nirc-as",
    18: "national-taxation-national-internal-revenue-code-of-1997-nirc-as",
    19: "national-taxation-national-internal-revenue-code-of-1997-nirc-as",
    20: "local-taxation-ra-no-7160",
}

def get_syllabus_info(subject_slug, subtopic_slug):
    subject = next((s for s in syllabus["subjects"] if s["slug"] == subject_slug), None)
    if not subject:
        raise ValueError(f"Subject slug {subject_slug} not found in syllabus")
    
    for topic in subject["topics"]:
        for subtopic in topic["subtopics"]:
            if subtopic["slug"] == subtopic_slug:
                return {
                    "syllabus_topic": topic["title"],
                    "syllabus_topic_slug": topic["slug"],
                    "syllabus_subtopic": subtopic["title"],
                    "syllabus_subtopic_slug": subtopic["slug"],
                    "syllabus_path": [topic["title"], subtopic["title"]]
                }
    raise ValueError(f"Subtopic slug {subtopic_slug} not found under subject {subject_slug}")

# Dry-run validation of mappings against syllabus
print("Validating syllabus subtopic slugs...")
for q_num, slug in POLITICAL_MAPPING.items():
    get_syllabus_info("political-law", slug)
for q_num, slug in COMMERCIAL_MAPPING.items():
    get_syllabus_info("commercial-law", slug)
print("✅ All mappings are valid.")

# ─── Parsing Helper ──────────────────────────────────────────────────────────

def split_questions(full_text):
    lines = full_text.splitlines()
    question_indices = []
    
    current_search = 1
    for idx, line in enumerate(lines):
        trimmed = line.strip()
        # Find exactly the question number on its own line
        if trimmed == str(current_search):
            question_indices.append((current_search, idx))
            current_search += 1
            if current_search > 20:
                break
                
    blocks = []
    for i in range(len(question_indices)):
        num, line_idx = question_indices[i]
        start_idx = line_idx + 1
        end_idx = question_indices[i+1][1] if i + 1 < len(question_indices) else len(lines)
        
        block_text = "\n".join(lines[start_idx:end_idx]).strip()
        blocks.append((num, block_text))
    return blocks

def parse_block(block_text):
    # Regex to split on suggested/alternative answers headers
    # Capturing the delimiter in parentheses keeps it in the split output list
    parts = re.split(r'(?i)(SUGGESTED ANSWER[S]?|ALTERNATIVE ANSWER[S]?|ALTERNATIVE SUGGESTED ANSWER[S]?):', block_text)
    
    question_text = parts[0].strip()
    suggested_answers = []
    
    # re.split list structure: [q_text, delim1, ans1, delim2, ans2, ...]
    for idx in range(1, len(parts), 2):
        if idx + 1 < len(parts):
            delim = parts[idx].strip()
            ans_text = parts[idx+1].strip()
            # Standardize delimiter format: "SUGGESTED ANSWER:\n..."
            full_ans = f"{delim.upper()}:\n{ans_text}"
            suggested_answers.append(full_ans)
            
    return question_text, suggested_answers

# ─── Run Seeding ─────────────────────────────────────────────────────────────

target_docs = [
    {
        "junk_id": "2023_1._POLITICAL_AND_PUBLIC_INTERNATIONAL_LAW_BAR_EXAM_SUGGESTED_ANSWERS_V.2_1",
        "subject_slug": "political-law",
        "subject_normalized": "Political and Public International Law",
        "subject_raw": "1.-Political-and-Public-International-Law-2023-Bar-Exam-Suggested-Answers-v.2",
        "mapping": POLITICAL_MAPPING,
        "unique_id_prefix": "2023_POLITICAL_LAW"
    },
    {
        "junk_id": "2023_2._COMMERCIAL_AND_TAXATION_LAWS_1",
        "subject_slug": "commercial-law",
        "subject_normalized": "Commercial and Taxation Laws",
        "subject_raw": "2. Commercial and Taxation Laws - 2023 Bar Exam Suggested Answers",
        "mapping": COMMERCIAL_MAPPING,
        "unique_id_prefix": "2023_COMMERCIAL_LAW"
    }
]

for item in target_docs:
    print(f"\nProcessing {item['subject_normalized']}...")
    doc = collection.find_one({"unique_id": item["junk_id"]})
    if not doc:
        print(f"⚠️ Warning: Could not find document {item['junk_id']}. Skipping.")
        continue
        
    pages = doc.get("suggested_answers", [])
    full_text = "\n".join(pages)
    
    blocks = split_questions(full_text)
    if len(blocks) != 20:
        print(f"❌ Error: Expected 20 questions, but parsed {len(blocks)}! Cannot proceed safely.")
        exit(1)
        
    new_questions = []
    for num, block in blocks:
        q_text, suggested_answers = parse_block(block)
        subtopic_slug = item["mapping"][num]
        syllabus_info = get_syllabus_info(item["subject_slug"], subtopic_slug)
        
        section_id = f"{num:02d}"
        unique_id = f"{item['unique_id_prefix']}_{section_id}"
        
        new_q = {
            "unique_id": unique_id,
            "section_id": section_id,
            "question_text": q_text,
            "suggested_answers": suggested_answers,
            "type": "ESSAY",
            "year": 2023,
            "subject": item["subject_raw"],
            "subject_normalized": item["subject_normalized"],
            "subject_slug": item["subject_slug"],
            "classification_confidence": 1.0,
            **syllabus_info
        }
        new_questions.append(new_q)
        print(f"  Parsed Q{num:02d} -> Subtopic: {subtopic_slug} (Answers count: {len(suggested_answers)})")
        
    # Write to database: Delete junk first, then insert new ones
    print(f"Deleting bogus document: {item['junk_id']}...")
    delete_res = collection.delete_one({"unique_id": item["junk_id"]})
    print(f"  Deleted: {delete_res.deleted_count}")
    
    print(f"Inserting {len(new_questions)} clean questions...")
    # Delete any existing records with the new IDs to prevent duplicates on rerun
    for nq in new_questions:
        collection.delete_one({"unique_id": nq["unique_id"]})
    
    insert_res = collection.insert_many(new_questions)
    print(f"  Inserted: {len(insert_res.inserted_ids)}")

client.close()
print("\n🎉 Database re-seeding completed successfully!")
