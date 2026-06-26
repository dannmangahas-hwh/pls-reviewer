import os
import re
import json
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

print("--- SCANNING FOR ACTUAL MULTI-PART PARSING BUGS ---")
all_docs = list(collection.find({}))

real_bugs = []

for doc in all_docs:
    q_text = doc.get("question_text", "")
    answers = doc.get("suggested_answers", [])
    
    if not answers:
        continue
        
    first_ans = answers[0]
    
    # Search for labels like (b), (c), (d) etc. at the start of lines in first_ans
    matches = re.finditer(r'\n\s*\(([b-f])\)\s+', first_ans)
    
    found_labels = []
    for m in matches:
        label = m.group(1) # 'b', 'c', etc.
        full_label = f"({label})"
        # Check if this label is already in the question text.
        # To avoid false negatives, we check if the question text contains (b) or (c)
        if full_label not in q_text:
            found_labels.append(full_label)
            
    if found_labels:
        real_bugs.append({
            "doc": doc,
            "buggy_labels": found_labels
        })

print(f"Total questions scanned: {len(all_docs)}")
print(f"Actual bugged documents found: {len(real_bugs)}")

# Print details of the real bugs
for idx, bug in enumerate(real_bugs):
    doc = bug["doc"]
    print(f"\n[{idx+1}] ID: {doc.get('unique_id')} ({doc.get('year')} {doc.get('subject_slug')})")
    print(f"  Buggy labels: {bug['buggy_labels']}")
    print(f"  Question ends with: {repr(doc.get('question_text')[-150:])}")
    print(f"  First answer ends with: {repr(doc.get('suggested_answers')[0][-200:])}")
    print(f"  Num answers: {len(doc.get('suggested_answers'))}")

client.close()
