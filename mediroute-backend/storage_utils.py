import json
import os
from datetime import datetime

STORAGE_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "storage")

def _ensure_dir():
    os.makedirs(STORAGE_DIR, exist_ok=True)

def read_json(filename):
    _ensure_dir()
    filepath = os.path.join(STORAGE_DIR, filename)
    if not os.path.exists(filepath):
        return []
    with open(filepath, "r", encoding="utf-8") as f:
        return json.load(f)

def write_json(filename, data):
    _ensure_dir()
    filepath = os.path.join(STORAGE_DIR, filename)
    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

def append_json(filename, record):
    data = read_json(filename)
    data.append(record)
    write_json(filename, data)

def now_iso():
    return datetime.now().isoformat()
