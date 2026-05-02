import json
import os
import random

# The storage directory is at the root of the project
STORAGE_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "storage")
HOSPITALS_FILE = "hospitals.json"

def seed():
    if not os.path.exists(STORAGE_DIR):
        os.makedirs(STORAGE_DIR)
        
    if not os.path.exists(HOSPITALS_FILE):
        print(f"Error: {HOSPITALS_FILE} not found")
        return
        
    with open(HOSPITALS_FILE, "r", encoding="utf-8") as f:
        hospitals = json.load(f)
        
    procedures = [
        {"name": "Kidney Stone Removal", "icd10": "N20.0", "base_cost": 85000},
        {"name": "Appendectomy", "icd10": "K35", "base_cost": 65000},
        {"name": "Angioplasty", "icd10": "I25.10", "base_cost": 250000},
        {"name": "Knee Replacement", "icd10": "M17.1", "base_cost": 350000},
        {"name": "Cataract Surgery", "icd10": "H25.0", "base_cost": 45000},
        {"name": "Hernia Repair", "icd10": "K40", "base_cost": 55000},
    ]
    
    expanded_data = []
    for h in hospitals:
        for p in procedures:
            # Add some randomness based on hospital tier
            tier_mult = h.get("base_modifier", 1.0)
            # Add some noise
            noise = random.uniform(0.9, 1.1)
            estimated_cost = int(p["base_cost"] * tier_mult * noise)
            
            expanded_data.append({
                "hospital_id": h["id"],
                "hospital_name": h["name"],
                "city": h["city"],
                "state": h.get("state", "India"),
                "lat": h["lat"],
                "lon": h["lon"],
                "tier": h["tier"],
                "reputation_score": h["reputation_score"],
                "procedure": p["name"],
                "icd10_code": p["icd10"],
                "estimated_total_cost": estimated_cost,
                "breakdown": {
                    "room_charges": int(estimated_cost * 0.2),
                    "doctor_fees": int(estimated_cost * 0.3),
                    "medicines": int(estimated_cost * 0.15),
                    "consumables": int(estimated_cost * 0.1),
                    "other": int(estimated_cost * 0.25)
                }
            })
            
    with open(os.path.join(STORAGE_DIR, "hospitals_data.json"), "w", encoding="utf-8") as f:
        json.dump(expanded_data, f, indent=4)
    print(f"Seeded {len(expanded_data)} records into storage/hospitals_data.json")

if __name__ == "__main__":
    seed()
