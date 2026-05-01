import json
import random

CITIES = ["Nagpur", "Mumbai", "Pune", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Ahmedabad", "Jaipur"]
PROCEDURES = ["Total Knee Replacement", "Angioplasty", "Cataract Surgery", "Appendectomy", "Gallbladder Removal"]

hospitals = []

for i in range(1, 201):
    city = random.choice(CITIES)
    
    # Base quality stats
    capability = round(random.uniform(0.6, 1.0), 2)
    reputation = round(random.uniform(0.5, 1.0), 2)
    
    # Distance score (mocked as user is usually in city center)
    distance_score = round(random.uniform(0.4, 1.0), 2)
    
    tier = "Premium" if capability > 0.85 else "High" if capability > 0.7 else "Medium"
    base_mult = 1.3 if tier == "Premium" else 1.1 if tier == "High" else 0.9

    hospital_procedures = {}
    for proc in PROCEDURES:
        if proc == "Total Knee Replacement":
            base = 150000 * base_mult
            room_rate = 5000 * base_mult
            days = random.randint(4, 7)
            doc_fee = 40000 * base_mult
        elif proc == "Angioplasty":
            base = 120000 * base_mult
            room_rate = 8000 * base_mult
            days = random.randint(2, 4)
            doc_fee = 50000 * base_mult
        elif proc == "Cataract Surgery":
            base = 25000 * base_mult
            room_rate = 3000 * base_mult
            days = 1
            doc_fee = 10000 * base_mult
        else:
            base = 40000 * base_mult
            room_rate = 4000 * base_mult
            days = random.randint(2, 5)
            doc_fee = 15000 * base_mult

        hospital_procedures[proc] = {
            "base_cost": int(base),
            "room_cost_per_day": int(room_rate),
            "avg_days": days,
            "doctor_fee": int(doc_fee),
            "medications": int(base * 0.1),
            "diagnostics": int(base * 0.05)
        }

    hospitals.append({
        "hospital_id": i,
        "name": f"{random.choice(['Apollo', 'Care', 'Wockhardt', 'Fortis', 'Max', 'Manipal', 'Medanta', 'Global', 'City', 'Lifeline'])} Hospital {city} {i}",
        "city": city,
        "tier": tier,
        "ratings": {
            "capability": capability,
            "reputation": reputation
        },
        "location_score": distance_score,
        "procedures": hospital_procedures
    })

with open("hospitals.json", "w") as f:
    json.dump(hospitals, f, indent=2)

print(f"Generated {len(hospitals)} hospitals.")
