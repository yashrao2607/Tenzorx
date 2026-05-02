"""
Seed script: Generates storage/hospitals_data.json
Maps every hospital from hospitals.json to multiple procedures with cost breakdowns.
"""
import json
import os
import random

STORAGE_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "storage")
HOSPITALS_JSON = os.path.join(os.path.dirname(__file__), "hospitals.json")

PROCEDURES = [
    {"name": "Lithotripsy",       "icd10": "N20.0",  "min": 40000,  "max": 150000},
    {"name": "Appendectomy",      "icd10": "K35",    "min": 50000,  "max": 150000},
    {"name": "Angioplasty",       "icd10": "I25.10", "min": 150000, "max": 350000},
    {"name": "Knee Replacement",  "icd10": "M17.1",  "min": 250000, "max": 500000},
    {"name": "Cataract Surgery",  "icd10": "H25.0",  "min": 25000,  "max": 80000},
    {"name": "Hernia Repair",     "icd10": "K40",    "min": 40000,  "max": 120000},
]

def generate_breakdown(total):
    surgery_pct = random.uniform(0.40, 0.50)
    room_pct = random.uniform(0.15, 0.20)
    meds_pct = random.uniform(0.10, 0.15)
    diag_pct = random.uniform(0.05, 0.10)
    consult_pct = random.uniform(0.03, 0.05)

    surgery = int(total * surgery_pct)
    room = int(total * room_pct)
    meds = int(total * meds_pct)
    diag = int(total * diag_pct)
    consult = int(total * consult_pct)
    misc = total - (surgery + room + meds + diag + consult)

    return {
        "consultation_fee": consult,
        "room_rent_per_day": int(room / 5),
        "surgery_fee": surgery,
        "medicines_injections": meds,
        "diagnostics": diag,
        "miscellaneous": misc,
    }

def seed():
    with open(HOSPITALS_JSON, "r", encoding="utf-8") as f:
        hospitals = json.load(f)

    records = []
    for h in hospitals:
        for proc in PROCEDURES:
            # Tier-based cost multiplier
            tier_mult = {"Premium": 1.20, "High": 1.05, "Mid": 0.85}.get(h.get("tier", "Mid"), 1.0)
            base = random.randint(proc["min"], proc["max"])
            cost = int(base * tier_mult)

            records.append({
                "hospital_id": h["id"],
                "hospital_name": h["name"],
                "city": h["city"],
                "lat": h["lat"],
                "lon": h["lon"],
                "tier": h.get("tier", "Mid"),
                "quality_score": h.get("capability_score", 8.0),
                "icd10_code": proc["icd10"],
                "procedure": proc["name"],
                "estimated_total_cost": cost,
                "cost_breakdown": generate_breakdown(cost),
            })

    os.makedirs(STORAGE_DIR, exist_ok=True)
    out_path = os.path.join(STORAGE_DIR, "hospitals_data.json")
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(records, f, indent=2, ensure_ascii=False)

    print(f"Seeded {len(records)} hospital-procedure records to {out_path}")

if __name__ == "__main__":
    seed()
