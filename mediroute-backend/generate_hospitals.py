import json
import random

# Real Hospital Data from Scraped Research
CITY_DATA = {
    "Nagpur": {
        "coords": (21.1458, 79.0882),
        "hospitals": [
            {"name": "Wockhardt Super Speciality Hospital", "tier": "Premium", "cap": 9.2},
            {"name": "KIMS-Kingsway Hospitals", "tier": "Premium", "cap": 9.5},
            {"name": "Alexis Multispeciality Hospital", "tier": "High", "cap": 8.8},
            {"name": "Orange City Hospital & Research Institute", "tier": "Mid", "cap": 8.0},
            {"name": "AIIMS Nagpur", "tier": "Mid", "cap": 9.0}, # Public but high capability
            {"name": "Care Hospital Nagpur", "tier": "High", "cap": 8.5},
            {"name": "Kingsway Hospital", "tier": "High", "cap": 8.7}
        ]
    },
    "Mumbai": {
        "coords": (19.0760, 72.8777),
        "hospitals": [
            {"name": "Kokilaben Dhirubhai Ambani Hospital", "tier": "Premium", "cap": 9.8},
            {"name": "P. D. Hinduja Hospital", "tier": "Premium", "cap": 9.6},
            {"name": "Fortis Hospital, Mulund", "tier": "High", "cap": 9.2},
            {"name": "Nanavati Max Super Speciality Hospital", "tier": "High", "cap": 9.0},
            {"name": "Sir HN Reliance Foundation Hospital", "tier": "Premium", "cap": 9.7},
            {"name": "Lilavati Hospital", "tier": "High", "cap": 9.1},
            {"name": "Breach Candy Hospital", "tier": "Premium", "cap": 9.4}
        ]
    },
    "Pune": {
        "coords": (18.5204, 73.8567),
        "hospitals": [
            {"name": "Ruby Hall Clinic", "tier": "Premium", "cap": 9.3},
            {"name": "Deenanath Mangeshkar Hospital", "tier": "High", "cap": 9.0},
            {"name": "Jehangir Hospital", "tier": "High", "cap": 8.8},
            {"name": "Aditya Birla Memorial Hospital", "tier": "Premium", "cap": 9.5},
            {"name": "Manipal Hospital Pune", "tier": "High", "cap": 8.7},
            {"name": "Noble Hospital", "tier": "Mid", "cap": 8.2},
            {"name": "Sahyadri Super Speciality Hospital", "tier": "High", "cap": 8.6}
        ]
    },
    "Delhi": {
        "coords": (28.6139, 77.2090),
        "hospitals": [
            {"name": "AIIMS Delhi", "tier": "Mid", "cap": 9.9},
            {"name": "Indraprastha Apollo Hospital", "tier": "Premium", "cap": 9.7},
            {"name": "Sir Ganga Ram Hospital", "tier": "High", "cap": 9.4},
            {"name": "BLK-Max Super Speciality Hospital", "tier": "High", "cap": 9.2},
            {"name": "Fortis Escorts Heart Institute", "tier": "Premium", "cap": 9.8},
            {"name": "Medanta The Medicity", "tier": "Premium", "cap": 9.9},
            {"name": "Max Super Speciality Hospital Saket", "tier": "High", "cap": 9.3}
        ]
    },
    "Bangalore": {
        "coords": (12.9716, 77.5946),
        "hospitals": [
            {"name": "Aster CMI Hospital", "tier": "Premium", "cap": 9.6},
            {"name": "Manipal Hospital Old Airport Road", "tier": "Premium", "cap": 9.7},
            {"name": "Fortis Hospital Bannerghatta Road", "tier": "High", "cap": 9.3},
            {"name": "Apollo Hospital Bannerghatta Road", "tier": "High", "cap": 9.2},
            {"name": "Sakra World Hospital", "tier": "High", "cap": 9.4},
            {"name": "Narayana Health City", "tier": "Mid", "cap": 9.5},
            {"name": "St. John's Medical College Hospital", "tier": "Mid", "cap": 8.5}
        ]
    }
}

hospitals = []
id_counter = 1

for city, data in CITY_DATA.items():
    base_lat, base_lon = data["coords"]
    for h in data["hospitals"]:
        # Add slight variation to coordinates
        lat = base_lat + random.uniform(-0.05, 0.05)
        lon = base_lon + random.uniform(-0.05, 0.05)
        
        tier = h["tier"]
        hospitals.append({
            "id": id_counter,
            "name": h["name"],
            "city": city,
            "lat": lat,
            "lon": lon,
            "tier": tier,
            "reputation_score": round(random.uniform(4.0, 5.0) if tier == "Premium" else random.uniform(3.5, 4.5), 1),
            "capability_score": h["cap"],
            "base_modifier": 1.25 if tier == "Premium" else 1.05 if tier == "High" else 0.85,
            
            # Blueprint Metrics
            "icu_occupancy": random.randint(40, 95),
            "er_wait_time": random.randint(10, 90),
            "ventilators_available": random.randint(2, 20),
            "blood_inventory": random.choice(["Stable", "Stable", "High", "Critical"]),
            "uav_dock_status": random.choice(["Available", "Active"]),
            "edge_node_utilization": round(random.uniform(40.0, 90.0), 1)
        })
        id_counter += 1

with open("hospitals.json", "w") as f:
    json.dump(hospitals, f, indent=4)

print(f"Generated {len(hospitals)} REAL hospitals for major Indian hubs.")
