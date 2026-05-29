import os
import re
import sys
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

# Determine if we should actually write to the database
execute_mode = "--execute" in sys.argv

print("=== MULTI-PART PARSING BUG FIX MIGRATION ===")
if execute_mode:
    print("⚠️  EXECUTION MODE: Database changes WILL be applied. ⚠️\n")
else:
    print("🔍 DRY-RUN MODE: Scanning and simulating changes only. No database modifications.\n")

all_docs = list(collection.find({}))

real_bugs = []
for doc in all_docs:
    # Restrict to 2019 bugs
    if doc.get("year") != 2019:
        continue
        
    q_text = doc.get("question_text", "")
    answers = doc.get("suggested_answers", [])
    
    if not answers:
        continue
        
    first_ans = answers[0]
    matches = re.finditer(r'\n\s*\(([b-f])\)\s+', first_ans)
    
    found_labels = []
    for m in matches:
        label = m.group(1)
        full_label = f"({label})"
        if full_label not in q_text:
            found_labels.append(full_label)
            
    if found_labels:
        real_bugs.append(doc)

print(f"Found {len(real_bugs)} bugged 2019 documents in database.")

def clean_answer_prefix(text):
    # Remove leading SUGGESTED ANSWER or Alternative Answer headers
    text = re.sub(r'^(SUGGESTED ANSWER|SUGGESTED PRACTICE|SUGGESTED ANSWERS|ANSWER|ALTERNATIVE ANSWER|ALTERNATIVE ANSWERS)[:\s]*', '', text, flags=re.IGNORECASE)
    return text.strip()

successful_fixes = 0

for doc in real_bugs:
    doc_id = doc["_id"]
    unique_id = doc.get("unique_id")
    orig_q = doc.get("question_text", "")
    orig_ans = doc.get("suggested_answers", [])
    
    parsed_blocks = []
    sub_questions_by_label = {}
    
    for idx, ans in enumerate(orig_ans):
        matches = list(re.finditer(r'\n\s*\(([b-f])\)\s+', ans))
        if matches:
            last_idx = 0
            for i, m in enumerate(matches):
                start_idx = m.start()
                segment_ans = ans[last_idx:start_idx].strip()
                if segment_ans or last_idx == 0:
                    parsed_blocks.append({
                        "type": "answer",
                        "content": segment_ans
                    })
                
                next_start = matches[i+1].start() if i + 1 < len(matches) else len(ans)
                segment_sub_q = ans[start_idx:next_start].strip()
                
                label = m.group(1)
                sub_questions_by_label[label] = segment_sub_q
                parsed_blocks.append({
                    "type": "sub_question",
                    "label": label,
                    "content": segment_sub_q
                })
                last_idx = next_start
        else:
            parsed_blocks.append({
                "type": "answer",
                "content": ans.strip()
            })
            
    # Group components by part
    current_part = 'a'
    answers_by_part = {'a': []}
    
    for block in parsed_blocks:
        if block["type"] == "sub_question":
            current_part = block["label"]
            answers_by_part[current_part] = []
        elif block["type"] == "answer":
            cleaned = clean_answer_prefix(block["content"])
            if cleaned:
                answers_by_part[current_part].append(cleaned)
                
    # Build new suggested answers array chronologically
    new_suggested_answers = []
    active_parts = sorted(answers_by_part.keys())
    
    # 1. Add part 'a'
    a_answers = answers_by_part.get('a', [])
    for idx, ans in enumerate(a_answers):
        if idx == 0:
            new_suggested_answers.append("SUGGESTED ANSWER:\n\n" + ans)
        else:
            new_suggested_answers.append("Alternative Answer:\n\n" + ans)
            
    # 2. Add subsequent parts
    for p in active_parts:
        if p == 'a':
            continue
            
        # Add Connected Question first
        if p in sub_questions_by_label:
            new_suggested_answers.append("CONNECTED QUESTION:\n\n" + sub_questions_by_label[p])
            
        # Add answers to this sub-question
        p_answers = answers_by_part.get(p, [])
        for idx, ans in enumerate(p_answers):
            if idx == 0:
                new_suggested_answers.append("SUGGESTED ANSWER:\n\n" + ans)
            else:
                new_suggested_answers.append("Alternative Answer:\n\n" + ans)
                
    if execute_mode:
        # Perform DB update
        collection.update_one(
            {"_id": doc_id},
            {"$set": {"suggested_answers": new_suggested_answers}}
        )
        successful_fixes += 1
    else:
        # Just display the simulation comparison for the first few items
        if successful_fixes < 2:
            print(f"\n--- SIMULATION FOR: {unique_id} ---")
            print("Original Answers Array Length:", len(orig_ans))
            print("New Answers Array Length:", len(new_suggested_answers))
            for i, val in enumerate(new_suggested_answers):
                val_preview = val[:120].replace('\n', ' ')
                print(f"  Item {i}: {val_preview}...")
        successful_fixes += 1

print(f"\nMigration script completed successfully.")
if execute_mode:
    print(f"Fixed {successful_fixes} documents in MongoDB Atlas!")
else:
    print(f"Dry-run simulation completed. {successful_fixes} documents would be repaired.")

client.close()
