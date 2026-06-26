"""
Extract the 2026 Bar Examination Syllabus from the official PDF
into a structured JSON file for use as the app's navigation tree.

Usage:
    python3 scripts/extract-syllabus.py

Output:
    apps/web/data/syllabus-2026.json

Hierarchy levels:
    Subject → Topic (Roman numeral) → Subtopic (Letter)

We intentionally stop at 2 levels deep (Roman + Letter) because:
- The numbered items (1., 2., 3.) under letters are too granular for navigation
- Questions will be classified at the Letter (subtopic) level
- Deeper items serve as reference but don't need their own pages
"""

import pdfplumber
import re
import json
import os

# ─── Configuration ───────────────────────────────────────────────────────────

PDF_PATH = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "2026-BAR-Bar-Bulletin-No.-1-October-16-2025.pdf",
)

OUTPUT_PATH = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "apps", "web", "data", "syllabus-2026.json",
)

# Subject definitions: (name, slug, weight, start_page, end_page)
# Pages are 1-indexed as they appear in the PDF
SUBJECT_RANGES = [
    ("Political and Public International Law", "political-law", "15%", 6, 14),
    ("Commercial and Taxation Laws", "commercial-law", "20%", 15, 24),
    ("Civil Law and Land Titles and Deeds", "civil-law", "20%", 25, 33),
    ("Labor and Social Legislation", "labor-law", "10%", 34, 41),
    ("Criminal Law", "criminal-law", "10%", 42, 46),
    (
        "Remedial Law, Legal and Judicial Ethics, with Practical Exercises",
        "remedial-law",
        "25%",
        47,
        62,
    ),
]

# ─── Expected top-level topic counts per subject ─────────────────────────────
# Manually verified against the PDF. Used to validate extraction accuracy.
EXPECTED_TOPIC_COUNTS = {
    "political-law": 14,     # I-XIV
    "commercial-law": 7,     # I-VI, VIII (VII missing in PDF, jumps to VIII for Taxation)
    "civil-law": 12,         # I-XII
    "labor-law": 8,          # I-VIII
    "criminal-law": 3,       # I-III
    "remedial-law": 10,      # I-X
}

# ─── Manually defined top-level topics per subject ───────────────────────────
# Because the PDF's formatting makes it impossible to 100% reliably distinguish
# top-level Roman headings from sub-level Roman items (i., ii., iii. etc.)
# via heuristics alone, we define the expected top-level topics explicitly.
# The script then uses these as anchors and collects letter-level subtopics
# between them.

EXPECTED_TOPICS = {
    "political-law": [
        ("I", "BASIC CONCEPTS"),
        ("II", "NATIONAL TERRITORY"),
        ("III", "CITIZENSHIP"),
        ("IV", "LEGISLATIVE DEPARTMENT"),
        ("V", "EXECUTIVE DEPARTMENT"),
        ("VI", "JUDICIAL DEPARTMENT"),
        ("VII", "CONSTITUTIONAL COMMISSIONS"),
        ("VIII", "CONSTITUTIONAL RIGHTS"),  # Note: PDF says "BILL OF RIGHTS" on some versions
        ("IX", "NATIONAL ECONOMY AND PATRIMONY"),
        ("X", "ADMINISTRATIVE LAW"),
        ("XI", "LAW ON PUBLIC OFFICERS"),
        ("XII", "ELECTION LAW"),
        ("XIII", "LOCAL GOVERNMENTS"),
        ("XIV", "PUBLIC INTERNATIONAL LAW"),
    ],
    "commercial-law": [
        ("I", "BUSINESS ORGANIZATIONS"),
        ("II", "INSURANCE"),
        ("III", "TRANSPORTATION"),
        ("IV", "BANKING"),
        ("V", "INTELLECTUAL PROPERTY"),
        ("VI", "SPECIAL COMMERCIAL LAWS"),
        # Note: VII is missing in the PDF — it jumps from VI to VIII
        ("VIII", "TAXATION LAW"),
        # VII. NEGOTIABLE INSTRUMENTS is embedded under Business Organizations in this syllabus
    ],
    "civil-law": [
        ("I", "EFFECT AND APPLICATION OF LAWS"),
        ("II", "PERSONS"),
        ("III", "FAMILY RELATIONS"),
        ("IV", "CIVIL REGISTER"),
        ("V", "PROPERTY, OWNERSHIP, AND ITS MODIFICATIONS"),
        ("VI", "LAND TITLES AND DEEDS"),
        ("VII", "SUCCESSION"),
        ("VIII", "OBLIGATIONS AND CONTRACTS"),
        ("IX", "SPECIAL CONTRACTS"),
        ("X", "QUASI-CONTRACTS"),
        ("XI", "TORTS AND QUASI-DELICTS"),
        ("XII", "DAMAGES"),
    ],
    "labor-law": [
        ("I", "BASIC PRINCIPLES AND CONCEPTS"),
        ("II", "RECRUITMENT AND PLACEMENT"),
        ("III", "EMPLOYMENT RELATIONSHIP"),
        ("IV", "LABOR STANDARDS"),
        ("V", "LABOR RELATIONS"),
        ("VI", "SUSPENSION AND TERMINATION OF EMPLOYMENT"),
        ("VII", "SOCIAL LEGISLATION"),
        ("VIII", "LABOR ADJUDICATION: JURISDICTION & REMEDIES"),
    ],
    "criminal-law": [
        ("I", "FUNDAMENTAL PRINCIPLES"),
        ("II", "FELONIES AND CRIMINAL LIABILITY"),
        ("III", "CRIMES AND THEIR PENALTIES"),
    ],
    "remedial-law": [
        ("I", "GENERAL PRINCIPLES"),
        ("II", "JURISDICTION"),
        ("III", "CIVIL PROCEDURE"),
        ("IV", "PROVISIONAL REMEDIES"),
        ("V", "SPECIAL CIVIL ACTIONS"),
        ("VI", "SPECIAL PROCEEDINGS AND WRITS"),
        ("VII", "CRIMINAL PROCEDURE"),
        ("VIII", "EVIDENCE"),
        ("IX", "LEGAL AND JUDICIAL ETHICS"),
        ("X", "PRACTICAL EXERCISES"),
    ],
}

# ─── Patterns ────────────────────────────────────────────────────────────────

# Match letter-level subtopics: "A. Regalian Doctrine", "B. Public Trust Doctrine"
LETTER_PATTERN = re.compile(r"^([A-Z])\.\s+(.+)$")

# Lines to skip (page footers, headers, notes)
SKIP_PATTERNS = [
    re.compile(r"^Page \d+ of \d+$"),
    re.compile(r"^SYLLABUS FOR THE 2026 BAR EXAMINATIONS$"),
    re.compile(r"^NOTE:"),
    re.compile(r"^as of June 30, 2025"),
]


# ─── Helpers ─────────────────────────────────────────────────────────────────


def slugify(text: str) -> str:
    """Convert a title to a URL-friendly slug."""
    # Remove content in parentheses for cleaner slugs
    text = re.sub(r"\s*\(.*?\)\s*", " ", text)
    # Remove special characters but keep ampersands as 'and'
    text = text.replace("&", "and")
    text = re.sub(r"[^\w\s-]", "", text)
    # Replace whitespace with hyphens
    text = re.sub(r"[\s_]+", "-", text.strip())
    return text.lower().strip("-")


def should_skip_line(line: str) -> bool:
    """Check if a line is a footer, header, or note that should be skipped."""
    for pattern in SKIP_PATTERNS:
        if pattern.match(line):
            return True
    return False


def extract_subject_text(pdf, start_page: int, end_page: int) -> str:
    """Extract all text from a subject's page range."""
    text = ""
    for i in range(start_page - 1, min(end_page, len(pdf.pages))):
        page = pdf.pages[i]
        t = page.extract_text()
        if t:
            text += t + "\n"
    return text


def find_topic_positions(lines: list, expected_topics: list) -> list:
    """
    Find the line indices where each expected topic heading appears.
    Returns a list of (line_index, roman, title) tuples.
    """
    positions = []

    for roman, title in expected_topics:
        # Build a pattern to find this topic in the text
        # The title may be slightly different in the PDF (case, spacing)
        # so we do a flexible match
        title_words = title.split()
        found = False

        for i, line in enumerate(lines):
            stripped = line.strip()
            if should_skip_line(stripped):
                continue

            # Check if line starts with the Roman numeral
            pattern = rf"^{re.escape(roman)}\.\s+"
            if re.match(pattern, stripped):
                # Check if the remaining text matches the expected title
                remaining = re.sub(pattern, "", stripped).strip()

                # Flexible match: check if the first 2-3 significant words match
                remaining_upper = remaining.upper()
                title_upper = title.upper()

                # Direct match or starts-with match
                if remaining_upper.startswith(title_upper[:20]):
                    positions.append((i, roman, remaining))
                    found = True
                    break

        if not found:
            print(f"    ⚠ Could not find topic: {roman}. {title}")

    return positions


def collect_subtopics_between(lines: list, start_idx: int, end_idx: int) -> list:
    """
    Collect all letter-level subtopics (A., B., C., ...) between two line indices.
    """
    subtopics = []

    for i in range(start_idx + 1, end_idx):
        line = lines[i].strip()
        if not line or should_skip_line(line):
            continue

        match = LETTER_PATTERN.match(line)
        if match:
            letter = match.group(1)
            title = match.group(2).strip()
            subtopics.append({
                "letter": letter,
                "title": title,
                "slug": slugify(title),
            })

    return subtopics


def parse_subject(text: str, slug: str) -> list:
    """
    Parse the raw text of a subject into a list of topics with subtopics,
    using the expected topic list as anchors.
    """
    expected = EXPECTED_TOPICS.get(slug, [])
    if not expected:
        print(f"  ⚠ No expected topics defined for {slug}")
        return []

    lines = text.split("\n")

    # Find where each topic heading appears
    positions = find_topic_positions(lines, expected)

    if not positions:
        print(f"  ⚠ No topic positions found for {slug}")
        return []

    topics = []

    for idx, (line_idx, roman, title) in enumerate(positions):
        # Determine the end boundary: next topic's line or end of text
        if idx + 1 < len(positions):
            end_idx = positions[idx + 1][0]
        else:
            end_idx = len(lines)

        # Collect letter-level subtopics in this range
        subtopics = collect_subtopics_between(lines, line_idx, end_idx)

        topics.append({
            "roman": roman,
            "title": title,
            "slug": slugify(title),
            "subtopics": subtopics,
        })

    return topics


# ─── Main ────────────────────────────────────────────────────────────────────


def main():
    print(f"Reading PDF: {PDF_PATH}")
    pdf = pdfplumber.open(PDF_PATH)
    print(f"Total pages: {len(pdf.pages)}")
    print()

    syllabus = {"subjects": []}

    for name, slug, weight, start, end in SUBJECT_RANGES:
        print(f"Extracting: {name} (pages {start}-{end})...")

        text = extract_subject_text(pdf, start, end)
        topics = parse_subject(text, slug)

        subject = {
            "name": name,
            "slug": slug,
            "weight": weight,
            "topics": topics,
        }
        syllabus["subjects"].append(subject)

        # Stats
        subtopic_count = sum(len(t["subtopics"]) for t in topics)
        expected = EXPECTED_TOPIC_COUNTS.get(slug, "?")
        status = "✅" if len(topics) == expected else "⚠"
        print(f"  {status} {len(topics)} topics (expected {expected}), {subtopic_count} subtopics")

    # Write output
    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(syllabus, f, indent=2, ensure_ascii=False)

    print(f"\n✅ Written to: {OUTPUT_PATH}")

    # Summary
    total_topics = sum(len(s["topics"]) for s in syllabus["subjects"])
    total_subtopics = sum(
        len(t["subtopics"])
        for s in syllabus["subjects"]
        for t in s["topics"]
    )
    print(f"\nSummary: {len(syllabus['subjects'])} subjects, {total_topics} topics, {total_subtopics} subtopics")


if __name__ == "__main__":
    main()
