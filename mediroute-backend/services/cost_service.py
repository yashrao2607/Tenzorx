import json
import math
import random
import uuid
from rapidfuzz import fuzz

# Scraped Research Data (2024-2025 Indian Private Sector)
# Range: 1.5L - 6L (TKR), 1L - 5L (Angioplasty), 0.3L - 2.5L (Hernia)
BASE_COSTS = {
    "Total Knee Replacement": 350000, # Mid-point of private range
    "Angioplasty": 250000,
    "Hernia Surgery": 120000,
    "Diabetes Management": 15000,
    "Cataract Surgery": 45000,
    "Maternity Delivery": 85000
}

# Clinical Comorbidity Multipliers (Simulated based on 'unbundling' research)
COMORBIDITY_MULTIPLIERS = {
    "Diabetes": 1.15,
    "Hypertension": 1.10,
    "Cardiac Disease": 1.25,
    "Age > 60": 1.12
}

WEIGHTS = {
    "capability": 0.40,
    "reputation": 0.25,
    "distance": 0.20,
    "affordability": 0.15
}

CITY_COORDS = {
    "Nagpur": (21.1458, 79.0882),
    "Mumbai": (19.0760, 72.8777),
    "Pune": (18.5204, 73.8567),
    "Delhi": (28.6139, 77.2090),
    "Bangalore": (12.9716, 77.5946)
}

def haversine(lat1, lon1, lat2, lon2):
    R = 6371
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2) ** 2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2) ** 2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

def calculate_costs(procedure_name, comorbidities, city):
    try:
        with open("hospitals.json", "r") as f:
            hospitals_db = json.load(f)
    except:
        return []

    city_hospitals = [h for h in hospitals_db if h["city"] == city]
    if not city_hospitals: city_hospitals = hospitals_db[:20]

    # Fuzzy match base cost
    base_cost = 100000
    for p, cost in BASE_COSTS.items():
        if fuzz.partial_ratio(p.lower(), procedure_name.lower()) > 80:
            base_cost = cost
            break

    # Apply Multiplicative Comorbidity Risk
    c_multiplier = 1.0
    for c in comorbidities:
        c_multiplier *= COMORBIDITY_MULTIPLIERS.get(c, 1.0)

    user_lat, user_lon = CITY_COORDS.get(city, (21.14, 79.08))

    scored_hospitals = []
    for h in city_hospitals:
        dist = haversine(user_lat, user_lon, h["lat"], h["lon"])
        dist_score = max(0, 1 - (dist / 40))
        
        final_score = (
            WEIGHTS["capability"] * (h["capability_score"] / 10) +
            WEIGHTS["reputation"] * (h["reputation_score"] / 5) +
            WEIGHTS["distance"] * dist_score +
            WEIGHTS["affordability"] * (1 / h["base_modifier"])
        )
        
        h["final_score"] = round(final_score, 2)
        h["distance_km"] = round(dist, 1)
        scored_hospitals.append(h)

    top_3 = sorted(scored_hospitals, key=lambda x: x["final_score"], reverse=True)[:3]

    results = []
    for h in top_3:
        transaction_id = f"TX-{uuid.uuid4().hex[:12].upper()}"
        
        # Calculate Hospital-Adjusted Cost
        h_cost = base_cost * h["base_modifier"] * c_multiplier
        
        # Blueprint: 10-18% Complication Contingency
        contingency_rate = random.uniform(0.10, 0.18)
        contingency_amount = h_cost * contingency_rate
        
        # Breakdown into 5 specific lines
        results.append({
            "hospital_id": h["id"],
            "hospital_name": h["name"],
            "quality_score": round(h["final_score"] * 10, 1),
            "distance_km": h["distance_km"],
            "price_tier": h["tier"],
            "estimated_cost": int(h_cost + contingency_amount),
            "min_cost": int(h_cost * 0.95),
            "max_cost": int((h_cost + contingency_amount) * 1.05),
            "breakdown": [
                {"category": "Surgery/OT Fee", "amount": int(h_cost * 0.40)},
                {"category": "Surgeon/Consultation", "amount": int(h_cost * 0.25)},
                {"category": "Room, Board & Nursing", "amount": int(h_cost * 0.15)},
                {"category": "Diagnostics & Imaging", "amount": int(h_cost * 0.10)},
                {"category": "Post-Op Meds/Consumables", "amount": int(h_cost * 0.10)}
            ],
            "icu_status": f"{h['icu_occupancy']}%",
            "er_wait": f"{h['er_wait_time']}m",
            "blood_status": h["blood_inventory"],
            "edge_status": "LOCAL_EDGE_EXECUTION" if h["edge_node_utilization"] < 80 else "OFFLOADED_HUB",
            "blockchain_id": transaction_id,
            "uav_dock": h["uav_dock_status"],
            "why_this_hospital": f"Weighted Score {round(h['final_score']*10,1)}: {h['tier']} tier provider with optimal {h['distance_km']}km clinical routing."
        })
        
    return results
