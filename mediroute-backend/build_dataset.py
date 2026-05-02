import json
import os
import random

# Storage directory
STORAGE_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "storage")

def generate():
    if not os.path.exists(STORAGE_DIR):
        os.makedirs(STORAGE_DIR)

    # 1. Comprehensive list of procedures and base costs
    procedures = [
        {"name": "Appendectomy", "icd10": "K35", "base_cost": 65000},
        {"name": "Angioplasty", "icd10": "I25.10", "base_cost": 250000},
        {"name": "Knee Replacement", "icd10": "M17.1", "base_cost": 350000},
        {"name": "Cataract Surgery", "icd10": "H25.0", "base_cost": 45000},
        {"name": "Kidney Stone Removal", "icd10": "N20.0", "base_cost": 85000},
        {"name": "Hernia Repair", "icd10": "K40", "base_cost": 55000},
        {"name": "Gallbladder Removal", "icd10": "K80.2", "base_cost": 75000},
        {"name": "Coronary Artery Bypass", "icd10": "I20.0", "base_cost": 450000},
        {"name": "Hip Replacement", "icd10": "M16.1", "base_cost": 380000},
        {"name": "Dialysis Session", "icd10": "N18.5", "base_cost": 4500},
        {"name": "Chemotherapy Cycle", "icd10": "C50.9", "base_cost": 35000},
        {"name": "Lasik Surgery", "icd10": "H52.1", "base_cost": 60000},
        {"name": "Thyroidectomy", "icd10": "E04.1", "base_cost": 95000},
        {"name": "Tonsillectomy", "icd10": "J35.0", "base_cost": 30000},
        {"name": "Spinal Fusion", "icd10": "M43.1", "base_cost": 300000},
        {"name": "Hysterectomy", "icd10": "N80.0", "base_cost": 120000},
        {"name": "Pacemaker Implantation", "icd10": "I44.2", "base_cost": 180000},
        {"name": "Liver Transplant", "icd10": "K74.6", "base_cost": 2500000},
        {"name": "Brain Tumor Surgery", "icd10": "C71.9", "base_cost": 500000},
        {"name": "Normal Delivery", "icd10": "O80", "base_cost": 45000},
        {"name": "C-Section Delivery", "icd10": "O82", "base_cost": 85000},
        {"name": "Mastectomy", "icd10": "C50.0", "base_cost": 150000},
        {"name": "Kidney Transplant", "icd10": "N18.0", "base_cost": 800000},
        {"name": "ACL Reconstruction", "icd10": "S83.5", "base_cost": 130000},
        {"name": "Bariatric Surgery", "icd10": "E66.0", "base_cost": 280000},
        {"name": "Sinus Surgery", "icd10": "J32.0", "base_cost": 70000},
        {"name": "Piles Surgery", "icd10": "K64.9", "base_cost": 40000},
        {"name": "IVF Treatment", "icd10": "N97.9", "base_cost": 150000},
        {"name": "Rhinoplasty", "icd10": "M95.0", "base_cost": 90000},
        {"name": "Septoplasty", "icd10": "J34.2", "base_cost": 50000},
        {"name": "Prostatectomy", "icd10": "C61", "base_cost": 180000},
        {"name": "Myomectomy", "icd10": "D25.9", "base_cost": 110000},
        {"name": "Fistula Surgery", "icd10": "K60.3", "base_cost": 45000},
        {"name": "Glaucoma Surgery", "icd10": "H40.1", "base_cost": 55000},
        {"name": "Endoscopy", "icd10": "K21.0", "base_cost": 8000},
        {"name": "Colonoscopy", "icd10": "K63.5", "base_cost": 12000},
        {"name": "Herniated Disc Surgery", "icd10": "M51.2", "base_cost": 160000},
        {"name": "Gastric Sleeve", "icd10": "E66", "base_cost": 320000},
        {"name": "Varicose Veins Laser", "icd10": "I83.9", "base_cost": 75000},
        {"name": "Pancreatic Surgery", "icd10": "K86.1", "base_cost": 400000},
        {"name": "Pediatric Heart Surgery", "icd10": "Q21.0", "base_cost": 350000},
        {"name": "Bone Marrow Transplant", "icd10": "C92.0", "base_cost": 1500000},
        {"name": "Bladder Stone Removal", "icd10": "N21.0", "base_cost": 60000},
        {"name": "Dental Implant", "icd10": "K08.1", "base_cost": 35000},
        {"name": "Lung Biopsy", "icd10": "D38.1", "base_cost": 25000},
        {"name": "Liver Biopsy", "icd10": "K76.9", "base_cost": 20000},
        {"name": "Burn Reconstruction", "icd10": "T31", "base_cost": 200000},
        {"name": "Liposuction", "icd10": "E65", "base_cost": 120000},
        {"name": "Heart Valve Replacement", "icd10": "I35.0", "base_cost": 550000},
    ]

    # 2. Comprehensive list of hospitals
    hospitals = [
        # Nagpur
        {"id": 1, "name": "Alexis Multispeciality Hospital", "city": "Nagpur", "lat": 21.1767, "lon": 79.1024, "tier": "High", "reputation_score": 4.5, "base_modifier": 1.1},
        {"id": 2, "name": "Wockhardt Hospital", "city": "Nagpur", "lat": 21.1356, "lon": 79.0689, "tier": "High", "reputation_score": 4.3, "base_modifier": 1.15},
        {"id": 3, "name": "Kingsway Hospitals", "city": "Nagpur", "lat": 21.1524, "lon": 79.0882, "tier": "Premium", "reputation_score": 4.7, "base_modifier": 1.25},
        {"id": 4, "name": "CARE Hospitals", "city": "Nagpur", "lat": 21.1321, "lon": 79.0765, "tier": "High", "reputation_score": 4.4, "base_modifier": 1.05},
        {"id": 5, "name": "Orange City Hospital", "city": "Nagpur", "lat": 21.1254, "lon": 79.0743, "tier": "Mid", "reputation_score": 3.6, "base_modifier": 0.85},
        {"id": 6, "name": "Seven Star Hospital", "city": "Nagpur", "lat": 21.1443, "lon": 79.1121, "tier": "Mid", "reputation_score": 3.8, "base_modifier": 0.9},
        {"id": 7, "name": "Viveka Hospital", "city": "Nagpur", "lat": 21.1212, "lon": 79.0543, "tier": "Mid", "reputation_score": 3.7, "base_modifier": 0.88},
        {"id": 8, "name": "New Era Hospital", "city": "Nagpur", "lat": 21.1387, "lon": 79.0812, "tier": "High", "reputation_score": 4.1, "base_modifier": 1.0},
        # Mumbai
        {"id": 10, "name": "Kokilaben Dhirubhai Ambani Hospital", "city": "Mumbai", "lat": 19.1312, "lon": 72.8243, "tier": "Premium", "reputation_score": 4.8, "base_modifier": 1.5},
        {"id": 11, "name": "Lilavati Hospital", "city": "Mumbai", "lat": 19.0512, "lon": 72.8211, "tier": "Premium", "reputation_score": 4.6, "base_modifier": 1.45},
        {"id": 12, "name": "P.D. Hinduja Hospital", "city": "Mumbai", "lat": 19.0343, "lon": 72.8421, "tier": "High", "reputation_score": 4.7, "base_modifier": 1.35},
        {"id": 13, "name": "Nanavati Max Hospital", "city": "Mumbai", "lat": 19.0978, "lon": 72.8979, "tier": "High", "reputation_score": 4.4, "base_modifier": 1.3},
        {"id": 14, "name": "Jaslok Hospital", "city": "Mumbai", "lat": 18.9712, "lon": 72.8098, "tier": "High", "reputation_score": 4.5, "base_modifier": 1.3},
        {"id": 15, "name": "Sir H.N. Reliance Foundation", "city": "Mumbai", "lat": 18.9567, "lon": 72.8212, "tier": "Premium", "reputation_score": 4.9, "base_modifier": 1.6},
        {"id": 16, "name": "Bombay Hospital", "city": "Mumbai", "lat": 18.9432, "lon": 72.8287, "tier": "High", "reputation_score": 4.2, "base_modifier": 1.25},
        {"id": 17, "name": "Fortis Hospital Mulund", "city": "Mumbai", "lat": 19.1678, "lon": 72.9345, "tier": "High", "reputation_score": 4.3, "base_modifier": 1.2},
        # Pune
        {"id": 20, "name": "Ruby Hall Clinic", "city": "Pune", "lat": 18.5256, "lon": 73.8765, "tier": "Premium", "reputation_score": 4.6, "base_modifier": 1.2},
        {"id": 21, "name": "Jehangir Hospital", "city": "Pune", "lat": 18.5312, "lon": 73.8789, "tier": "High", "reputation_score": 4.4, "base_modifier": 1.15},
        {"id": 22, "name": "Sahyadri Hospital", "city": "Pune", "lat": 18.5123, "lon": 73.8345, "tier": "High", "reputation_score": 4.5, "base_modifier": 1.1},
        {"id": 23, "name": "Deenanath Mangeshkar Hospital", "city": "Pune", "lat": 18.4987, "lon": 73.8312, "tier": "High", "reputation_score": 4.7, "base_modifier": 1.1},
        {"id": 24, "name": "Aditya Birla Memorial", "city": "Pune", "lat": 18.6212, "lon": 73.7843, "tier": "Premium", "reputation_score": 4.8, "base_modifier": 1.3},
        {"id": 25, "name": "Jupiter Hospital", "city": "Pune", "lat": 18.5678, "lon": 73.7712, "tier": "Premium", "reputation_score": 4.6, "base_modifier": 1.25},
        # Delhi
        {"id": 30, "name": "AIIMS New Delhi", "city": "Delhi", "lat": 28.5672, "lon": 77.2100, "tier": "Mid", "reputation_score": 4.9, "base_modifier": 0.8},
        {"id": 31, "name": "Indraprastha Apollo", "city": "Delhi", "lat": 28.5345, "lon": 77.2812, "tier": "Premium", "reputation_score": 4.7, "base_modifier": 1.4},
        {"id": 32, "name": "Sir Ganga Ram Hospital", "city": "Delhi", "lat": 28.6321, "lon": 77.1890, "tier": "High", "reputation_score": 4.5, "base_modifier": 1.2},
        {"id": 33, "name": "Max Super Speciality Saket", "city": "Delhi", "lat": 28.5289, "lon": 77.2143, "tier": "Premium", "reputation_score": 4.6, "base_modifier": 1.35},
        {"id": 34, "name": "Fortis Escorts Heart", "city": "Delhi", "lat": 28.5567, "lon": 77.2712, "tier": "Premium", "reputation_score": 4.8, "base_modifier": 1.45},
        {"id": 35, "name": "BLK-Max Hospital", "city": "Delhi", "lat": 28.6432, "lon": 77.1789, "tier": "High", "reputation_score": 4.4, "base_modifier": 1.25},
        {"id": 36, "name": "Medanta The Medicity", "city": "Delhi", "lat": 28.4590, "lon": 77.0312, "tier": "Premium", "reputation_score": 4.8, "base_modifier": 1.5},
        # Bangalore
        {"id": 40, "name": "Manipal Hospital Old Airport Rd", "city": "Bangalore", "lat": 12.9592, "lon": 77.6445, "tier": "Premium", "reputation_score": 4.7, "base_modifier": 1.3},
        {"id": 41, "name": "Fortis Hospital Bannerghatta", "city": "Bangalore", "lat": 12.8943, "lon": 77.5987, "tier": "Premium", "reputation_score": 4.6, "base_modifier": 1.25},
        {"id": 42, "name": "Aster CMI Hospital", "city": "Bangalore", "lat": 13.0567, "lon": 77.5912, "tier": "Premium", "reputation_score": 4.5, "base_modifier": 1.2},
        {"id": 43, "name": "Apollo Hospital Bannerghatta", "city": "Bangalore", "lat": 12.8912, "lon": 77.6012, "tier": "Premium", "reputation_score": 4.6, "base_modifier": 1.3},
        {"id": 44, "name": "Sakra World Hospital", "city": "Bangalore", "lat": 12.9367, "lon": 77.6912, "tier": "High", "reputation_score": 4.4, "base_modifier": 1.15},
        {"id": 45, "name": "St. Johns Medical College", "city": "Bangalore", "lat": 12.9343, "lon": 77.6121, "tier": "Mid", "reputation_score": 4.3, "base_modifier": 0.9},
        {"id": 46, "name": "Narayana Health City", "city": "Bangalore", "lat": 12.8123, "lon": 77.6912, "tier": "High", "reputation_score": 4.5, "base_modifier": 1.05},
    ]

    expanded_data = []
    for h in hospitals:
        for p in procedures:
            # City multiplier (Mumbai and Delhi are more expensive)
            city_mult = 1.0
            if h["city"] in ["Mumbai", "Delhi"]:
                city_mult = 1.3
            elif h["city"] == "Bangalore":
                city_mult = 1.15
            
            # Hospital tier multiplier
            tier_mult = h["base_modifier"]
            
            # Random noise (±10%)
            noise = random.uniform(0.9, 1.1)
            
            estimated_cost = int(p["base_cost"] * city_mult * tier_mult * noise)
            
            expanded_data.append({
                "hospital_id": h["id"],
                "hospital_name": h["name"],
                "city": h["city"],
                "lat": h["lat"],
                "lon": h["lon"],
                "tier": h["tier"],
                "reputation_score": h["reputation_score"],
                "procedure": p["name"],
                "icd10_code": p["icd10"],
                "estimated_total_cost": estimated_cost,
                "breakdown": {
                    "room_charges": int(estimated_cost * 0.25),
                    "doctor_fees": int(estimated_cost * 0.35),
                    "medicines": int(estimated_cost * 0.15),
                    "consumables": int(estimated_cost * 0.1),
                    "other": int(estimated_cost * 0.15)
                }
            })
            
    with open(os.path.join(STORAGE_DIR, "hospitals_data.json"), "w", encoding="utf-8") as f:
        json.dump(expanded_data, f, indent=4)
    
    print(f"Generated comprehensive dataset with {len(expanded_data)} medical records.")
    print(f"Dataset includes {len(hospitals)} hospitals across 5 cities and {len(procedures)} medical procedures.")

if __name__ == "__main__":
    generate()
