import os
import json
from rapidfuzz import fuzz

HOSPITALS_DATA = []
hospitals_file = os.path.join(os.path.dirname(os.path.dirname(__file__)), "hospitals.json")
if os.path.exists(hospitals_file):
    with open(hospitals_file, "r") as f:
        HOSPITALS_DATA = json.load(f)

COMORBIDITY_MULTIPLIERS = {
    "Diabetes": 1.15,
    "Hypertension": 1.10,
    "Cardiac Disease": 1.25,
    "Age > 60": 1.12
}

def calculate_costs(procedure_name: str, comorbidities: list, location: str):
    filtered_hospitals = [h for h in HOSPITALS_DATA if h.get("city", "").lower() == location.lower()]
    if not filtered_hospitals:
        filtered_hospitals = HOSPITALS_DATA[:10]
        
    comorbidity_multiplier = 1.0
    for cmb in comorbidities:
        if cmb in COMORBIDITY_MULTIPLIERS:
            # Multiplicative logic
            comorbidity_multiplier *= COMORBIDITY_MULTIPLIERS[cmb]

    estimates = []
    
    # Calculate scores with distance
    for h in filtered_hospitals:
        capability = h.get("ratings", {}).get("capability", 0.8)
        reputation = h.get("ratings", {}).get("reputation", 0.8)
        distance_score = h.get("location_score", 0.8) # From our generator
        
        # Affordability proxy (higher tier = less affordable)
        tier = h.get("tier", "Premium")
        affordability = 0.5 if tier == "Premium" else 0.7 if tier == "High" else 0.9
        
        score = (
            0.4 * capability +
            0.3 * reputation +
            0.2 * affordability +
            0.1 * distance_score
        )
        
        h["final_score"] = score

    # Sort and take top 3
    sorted_hospitals = sorted(filtered_hospitals, key=lambda h: h["final_score"], reverse=True)[:3]

    for h in sorted_hospitals:
        procedures = h.get("procedures", {})
        proc_data = None
        best_match_score = 0
        
        for p_name, p_val in procedures.items():
            match_score = fuzz.partial_ratio(p_name.lower(), procedure_name.lower())
            if match_score > best_match_score:
                best_match_score = match_score
                if match_score > 80:
                    proc_data = p_val
        
        if not proc_data:
            proc_data = {
                "base_cost": 150000,
                "room_cost_per_day": 5000,
                "avg_days": 4,
                "doctor_fee": 40000,
                "medications": 15000,
                "diagnostics": 7500
            }
            best_match_score = 60

        total_base = proc_data["base_cost"]
        
        # Breakdown logic (multiplicative applied)
        surgery = int(total_base * 0.40 * comorbidity_multiplier)
        surgeon = int(proc_data["doctor_fee"] * comorbidity_multiplier)
        room = int((proc_data["room_cost_per_day"] * proc_data["avg_days"]) * comorbidity_multiplier)
        meds = int(proc_data["medications"] * comorbidity_multiplier)
        diagnostics = int(proc_data["diagnostics"] * comorbidity_multiplier)
        
        total_cost = surgery + surgeon + room + meds + diagnostics
        
        # Calculate derived confidence
        hospital_data_quality = h.get("ratings", {}).get("capability", 0.8)
        confidence = min(1.0, 0.6 + (hospital_data_quality * 0.2) + ((best_match_score / 100.0) * 0.2))

        # Range instead of single number
        min_cost = int(total_cost * 0.9)
        max_cost = int(total_cost * 1.1)

        estimates.append({
            "hospital_name": h["name"],
            "quality_score": round(h["final_score"] * 10, 1),
            "price_tier": h.get("tier", "Premium"),
            "estimated_cost": total_cost, # For backwards compatibility
            "min_cost": min_cost,
            "max_cost": max_cost,
            "confidence_score": round(confidence, 2),
            "confidence_explanation": f"Costs may vary ±10% based on {h.get('tier')} tier variation and exact discharge times.",
            "why_this_hospital": f"High {h.get('tier')} capability combined with an optimal location score.",
            "breakdown": [
                {"category": "Surgery / OT", "amount": surgery},
                {"category": "Surgeon Fees", "amount": surgeon},
                {"category": "Room Rent", "amount": room},
                {"category": "Medicines", "amount": meds},
                {"category": "Diagnostics", "amount": diagnostics},
            ]
        })
    
    return estimates
