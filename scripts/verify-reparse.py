import os
import re
from pymongo import MongoClient

# Read .env.local manually
script_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.dirname(script_dir)
env_path = os.path.join(project_root, "apps", "web", ".env.local")

with open(env_path, "r", encoding="utf-8") as f:
    env_content = f.read()

match = re.search(r'MONGODB_URI="([^"]+)"', env_content)
if not match:
    print("Could not find MONGODB_URI in .env.local")
    exit(1)
uri = match.group(1)

client = MongoClient(uri)
db = client["PhBarExams"]
collection = db["questions"]

print("--- VERIFYING JUNK DELETION ---")
target_ids = [
    "2023_1._POLITICAL_AND_PUBLIC_INTERNATIONAL_LAW_BAR_EXAM_SUGGESTED_ANSWERS_V.2_1",
    "2023_2._COMMERCIAL_AND_TAXATION_LAWS_1"
]

for tid in target_ids:
    doc = collection.find_one({"unique_id": tid})
    if doc:
        print(f"❌ FAIL: Junk document {tid} still exists!")
    else:
        print(f"✅ SUCCESS: Junk document {tid} has been deleted.")

print("\n--- VERIFYING NEW INDIVIDUAL QUESTIONS ---")
subjects = ["political-law", "commercial-law"]
for subject in subjects:
    docs = list(collection.find({"year": 2023, "subject_slug": subject}))
    print(f"Subject '{subject}': Found {len(docs)} questions for year 2023.")
    if len(docs) == 20:
        print(f"✅ SUCCESS: Exactly 20 questions exist for {subject}.")
    else:
        print(f"❌ FAIL: Expected 20 questions for {subject}, found {len(docs)}.")
        
    # Check sample document
    if docs:
        sample = docs[0]
        print(f"  Sample ID: {sample.get('unique_id')}")
        print(f"  Sample Section ID: {sample.get('section_id')}")
        print(f"  Sample Topic Slug: {sample.get('syllabus_topic_slug')}")
        print(f"  Sample Subtopic Slug: {sample.get('syllabus_subtopic_slug')}")
        print(f"  Sample Question Text: {repr(sample.get('question_text')[:100])}...")
        print(f"  Sample Suggested Answers: {len(sample.get('suggested_answers', []))} answer(s)")
        print("-" * 50)

client.close()
print("\nVerification process completed!")
