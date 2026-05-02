import json
import random

# Comprehensive Hospital Data for 20+ States/UTs in India
# Each entry will contribute to 20 hospitals per state
STATE_DATA = {
    "Maharashtra": {
        "cities": [
            {"name": "Mumbai", "coords": (19.0760, 72.8777)},
            {"name": "Pune", "coords": (18.5204, 73.8567)},
            {"name": "Nagpur", "coords": (21.1458, 79.0882)},
            {"name": "Nashik", "coords": (19.9975, 73.7898)}
        ],
        "names": ["Apollo", "Fortis", "Wockhardt", "Nanavati", "Lilavati", "Breach Candy", "Hinduja", "Kokilaben", "Ruby Hall", "Jehangir", "Sahyadri", "Deenanath Mangeshkar", "KIMS", "Alexis", "Orange City", "Seven Hills", "Global", "Hiranandani", "Jaslok", "S.L. Raheja"]
    },
    "Delhi": {
        "cities": [{"name": "New Delhi", "coords": (28.6139, 77.2090)}],
        "names": ["AIIMS", "Safdarjung", "Ram Manohar Lohia", "Sir Ganga Ram", "Indraprastha Apollo", "BLK-Max", "Fortis Escorts", "Max Saket", "Medanta", "Moolchand", "Holy Family", "St. Stephen's", "Action Cancer", "Batra", "Venkateshwar", "Primus", "Aakash", "Manipal", "Artemis", "Fortis Shalimar Bagh"]
    },
    "Karnataka": {
        "cities": [
            {"name": "Bangalore", "coords": (12.9716, 77.5946)},
            {"name": "Mysore", "coords": (12.2958, 76.6394)}
        ],
        "names": ["Manipal", "Aster CMI", "Fortis", "Apollo", "Sakra World", "Narayana Health", "St. John's", "Cloudnine", "Columbia Asia", "BGS Gleneagles", "MS Ramaiah", "Baptist", "Kempegowda", "Sagar", "Vikram", "Vydehi", "Sparsh", "People Tree", "Motherhood", "Rainbow Children's"]
    },
    "Tamil Nadu": {
        "cities": [
            {"name": "Chennai", "coords": (13.0827, 80.2707)},
            {"name": "Coimbatore", "coords": (11.0168, 76.9558)}
        ],
        "names": ["Apollo Greams Road", "MIOT International", "Fortis Malar", "Global Health City", "SIMS", "Kauvery", "SRMC", "Billroth", "Dr. Mehta's", "Vijaya", "Frontier Lifeline", "Chettinad", "KMCH", "PSG", "Ramakrishna", "G.K.N.M.", "Royal Care", "Kongunad", "GEM", "Lotus"]
    },
    "Telangana": {
        "cities": [{"name": "Hyderabad", "coords": (17.3850, 78.4867)}],
        "names": ["Apollo Jubilee Hills", "Yashoda", "KIMS Secunderabad", "CARE Banjara Hills", "Continental", "Star", "Sunshine", "AIG", "Medicover", "Virinchi", "Basavatarakam Indo-American", "NIMS", "Gandhi", "Osmania", "Rainbow", "L.V. Prasad", "Kamineni", "MaxCure", "Omega", "Gleneagles Global"]
    },
    "Gujarat": {
        "cities": [
            {"name": "Ahmedabad", "coords": (23.0225, 72.5714)},
            {"name": "Surat", "coords": (21.1702, 72.8311)}
        ],
        "names": ["Zydus", "Apollo", "CIMS", "Shalby", "Sterling", "Salu", "Narayan", "KD", "Ahmedabad Civil", "UN Mehta", "GCRI", "Kiran Super Speciality", "Sunshine Surat", "Apple", "Unity", "Bhartimaiya", "Wockhardt Surat", "Metas Adventist", "Venus", "Unique"]
    },
    "Uttar Pradesh": {
        "cities": [
            {"name": "Lucknow", "coords": (26.8467, 80.9462)},
            {"name": "Noida", "coords": (28.5355, 77.3910)}
        ],
        "names": ["Medanta Lucknow", "Apollomedics", "SGPGI", "KGMU", "Sahara", "Vivekananda", "Tender Palm", "Chandan", "Fortis Noida", "Max Noida", "Jaypee", "Kailash", "Metro", "Felix", "Yatharth", "Sharda", "Bakson", "Nayati", "Regency", "Ford"]
    },
    "West Bengal": {
        "cities": [{"name": "Kolkata", "coords": (22.5726, 88.3639)}],
        "names": ["Apollo Multispeciality", "AMRI Dhakuria", "Fortis Anandapur", "Ruby General", "Woodlands", "BM Birla", "CMRI", "Tata Medical Center", "Peerless", "Desun", "Medica Superspecialty", "RTIICS", "Belle Vue", "Bhagirathi Neotia", "IPGMER", "NRS Medical College", "RG Kar", "Calcutta Medical College", "Jagannath Gupta", "KPC"]
    },
    "Kerala": {
        "cities": [
            {"name": "Kochi", "coords": (9.9312, 76.2673)},
            {"name": "Thiruvananthapuram", "coords": (8.5241, 76.9366)}
        ],
        "names": ["Aster Medcity", "Amrita", "Rajagiri", "VPS Lakeshore", "Medical Trust", "Renai Medicity", "KIMS Kerala", "Sunrise", "Lisie", "Sree Chitra Tirunal", "Govt Medical College TVM", "RCC TVM", "Cosmopolitan", "Ananthapuri", "SUT", "PRS", "General Hospital Ernakulam", "Baby Memorial", "MIMS", "Malabar Institute"]
    },
    "Rajasthan": {
        "cities": [{"name": "Jaipur", "coords": (26.9124, 75.7873)}],
        "names": ["Fortis Jaipur", "SMS Hospital", "EHCC", "Narayana Jaipur", "Manipal Jaipur", "CK Birla", "Apex", "JNU", "SDMH", "Bhandari", "Monilek", "Imperial", "Rungta", "Soni", "Marudhar", "Tagore", "Shalby Jaipur", "RHL", "Metro MAS", "Bhagwan Mahaveer Cancer"]
    },
    "Madhya Pradesh": {
        "cities": [
            {"name": "Indore", "coords": (22.7196, 75.8577)},
            {"name": "Bhopal", "coords": (23.2599, 77.4126)}
        ],
        "names": ["Medanta Indore", "Choithram", "Bombay Hospital Indore", "CHL", "Greater Kailash", "Apollo Rajshree", "SAIMS", "MY Hospital", "AIIMS Bhopal", "Bansal", "Hamidia", "BMHRC", "People's", "Chirayu", "Jawaharlal Nehru", "Indus", "Nobel Bhopal", "Navodaya", "Galaxy", "Care Bhopal"]
    },
    "Haryana": {
        "cities": [{"name": "Gurgaon", "coords": (28.4595, 77.0266)}],
        "names": ["Medanta The Medicity", "Artemis", "Fortis Memorial", "Max Gurgaon", "CK Birla Gurgaon", "Paras", "Columbia Asia Gurgaon", "W Pratiksha", "Park", "Cloudnine Gurgaon", "Signature", "Aryan", "SGT", "Civil Hospital Gurgaon", "Sheetla", "Narayan Memorial", "Safe Hands", "Life Aid", "Mayom", "Sunrise Gurgaon"]
    },
    "Punjab": {
        "cities": [{"name": "Ludhiana", "coords": (30.9010, 75.8573)}, {"name": "Chandigarh", "coords": (30.7333, 76.7794)}],
        "names": ["Fortis Mohali", "Max Mohali", "IVY", "DMC Ludhiana", "CMC Ludhiana", "SPS", "Deep", "Global Ludhiana", "Aastha", "Life Line", "Satguru", "Grover", "PGI Chandigarh", "GMSH", "GMCH", "Indus Super", "Mukat", "Landmark", "Silver Oaks", "Eden"]
    },
    "Bihar": {
        "cities": [{"name": "Patna", "coords": (25.5941, 85.1376)}],
        "names": ["AIIMS Patna", "IGIMS", "PMCH", "Paras HMRI", "Ruban", "Ford Patna", "Maitri", "Kurji Holy Family", "Udayan", "Jagdish Memorial", "Heart Hospital", "Life Line Patna", "Satyamev", "Samay", "Palm View", "Nalanda Medical", "Ford Hospital", "Mediversal", "Big Apollo", "Asian City"]
    },
    "Andhra Pradesh": {
        "cities": [{"name": "Visakhapatnam", "coords": (17.6868, 83.2185)}],
        "names": ["Apollo Vizag", "Care Vizag", "Seven Hills Vizag", "Pinnacle", "OMNI", "My Cure", "KIMS Icon", "Queen's", "Star Vizag", "Indus Vizag", "GVP Hospital", "KGH", "Medicover Vizag", "Life Line Vizag", "Vijaya Medical", "Susruta", "MGM Vizag", "Coastal", "ABC Hospital", "Sunrise Vizag"]
    },
    "Odisha": {
        "cities": [{"name": "Bhubaneswar", "coords": (20.2961, 85.8245)}],
        "names": ["AIIMS Bhubaneswar", "SUM", "Kalinga", "AMRI Bhubaneswar", "Care Bhubaneswar", "Apollo Bhubaneswar", "Blue Wheel", "Utkal", "Sparsh Odisha", "Sunshine Odisha", "Kar Clinic", "Aditya Care", "Vivekananda Odisha", "Capital Hospital", "SCB Medical", "Ashwini", "Checkmate", "Nilakantha", "Pradyumna", "KIMS Odisha"]
    },
    "Assam": {
        "cities": [{"name": "Guwahati", "coords": (26.1445, 91.7362)}],
        "names": ["Guwahati Medical College", "Apollo Guwahati", "Narayana Guwahati", "Excelcare", "Health City", "GNRC", "Hayat", "Down Town", "Marwari", "Nemcare", "Arya", "Dispur Hospital", "Pratiksha Guwahati", "International Hospital", "Ayursundra", "Swagat", "Assam Medical", "Sanjivani", "MGM Guwahati", "Rahman"]
    },
    "Goa": {
        "cities": [{"name": "Panaji", "coords": (15.4909, 73.8278)}],
        "names": ["Manipal Goa", "Healthway", "Goa Medical College", "Victor", "Vision", "Galaxy Goa", "Classic Goa", "Salgaocar", "Asilo", "Hospicio", "Chodankar", "Vrundavan", "Vintage", "Campal", "GMC Bambolim", "Drishti", "Pai", "Divine", "SMRC", "TJS"]
    },
    "Chhattisgarh": {
        "cities": [{"name": "Raipur", "coords": (21.2514, 81.6296)}],
        "names": ["AIIMS Raipur", "Ramkrishna Care", "MMI Narayana", "VY Hospital", "NH MMI", "Shree Narayana", "Sanjeevani", "Heritage", "MGM Raipur", "Dau Kalyan Singh", "Mekahara", "Sector 9 Hospital", "Apollo Raipur", "Life Worth", "Balaji", "Jain Hospital", "Modern", "Horizon", "Pulse", "Escorts Raipur"]
    },
    "Jharkhand": {
        "cities": [{"name": "Ranchi", "coords": (23.3441, 85.3096)}],
        "names": ["RIMS Ranchi", "Abdur Razzaque Ansari", "Apollo Ranchi", "Orchid", "Santevita", "Medica Ranchi", "Hill View", "Samford", "Raj Hospital", "Ranchi Trust", "St. Barnabas", "MGM Jamshedpur", "Tata Main Hospital", "Kantatoli", "Pulse Ranchi", "Devkamal", "Anant", "Health Point", "Maa Kalawati", "Ranchi Medical"]
    }
}

hospitals = []
id_counter = 1

for state, state_info in STATE_DATA.items():
    cities = state_info["cities"]
    hospital_names = state_info["names"]
    
    # Ensure we get exactly 20 for the state
    for i in range(20):
        city = random.choice(cities)
        base_lat, base_lon = city["coords"]
        name_base = hospital_names[i]
        
        lat = base_lat + random.uniform(-0.1, 0.1)
        lon = base_lon + random.uniform(-0.1, 0.1)
        
        tier = "Premium" if any(x in name_base for x in ["Apollo", "Fortis", "Medanta", "Max", "Manipal", "Aster", "Wockhardt", "Yashoda", "Aster"]) else random.choice(["High", "Mid"])
        
        hospitals.append({
            "id": id_counter,
            "name": f"{name_base} {city['name']}" if len(cities) > 1 else name_base,
            "city": city["name"],
            "state": state,
            "lat": lat,
            "lon": lon,
            "tier": tier,
            "reputation_score": round(random.uniform(4.3, 5.0) if tier == "Premium" else random.uniform(3.6, 4.6), 1),
            "capability_score": round(random.uniform(9.0, 10.0) if tier == "Premium" else random.uniform(7.8, 9.4), 1),
            "base_modifier": 1.35 if tier == "Premium" else 1.10 if tier == "High" else 0.85,
            
            "icu_occupancy": random.randint(30, 98),
            "er_wait_time": random.randint(5, 120),
            "ventilators_available": random.randint(0, 50),
            "blood_inventory": random.choice(["Stable", "Stable", "High", "Critical", "Low"]),
            "uav_dock_status": random.choice(["Available", "Active", "Maintenance"]),
            "edge_node_utilization": round(random.uniform(30.0, 95.0), 1),
            "specialties": random.sample(["Cardiology", "Neurology", "Oncology", "Orthopedics", "Pediatrics", "Gastroenterology", "Gynecology", "Ophthalmology", "Urology"], random.randint(4, 7))
        })
        id_counter += 1

with open("hospitals.json", "w") as f:
    json.dump(hospitals, f, indent=4)

print(f"Generated {len(hospitals)} Institutional Hospitals across {len(STATE_DATA)} States.")
