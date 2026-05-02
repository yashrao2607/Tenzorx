import json
import os
from datetime import datetime

# The storage directory is located within the backend folder
STORAGE_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "storage")

def _ensure_dir():
    if not os.path.exists(STORAGE_DIR):
        os.makedirs(STORAGE_DIR)

def read_json(filename):
    _ensure_dir()
    path = os.path.join(STORAGE_DIR, filename)
    if not os.path.exists(path):
        return []
    with open(path, "r", encoding="utf-8") as f:
        try:
            return json.load(f)
        except:
            return []

def append_json(filename, data):
    _ensure_dir()
    path = os.path.join(STORAGE_DIR, filename)
    existing = read_json(filename)
    if isinstance(existing, list):
        existing.append(data)
    else:
        existing = [data]
    with open(path, "w", encoding="utf-8") as f:
        json.dump(existing, f, indent=4)

def now_iso():
    return datetime.utcnow().isoformat()
