import random
from sqlalchemy.orm import Session
from database import SessionLocal, engine, Base
from models import Hospital

# Create tables
Base.metadata.create_all(bind=engine)

CITIES = ["Delhi", "Mumbai", "Bangalore"]
PROCEDURES = ["Appendectomy", "Angioplasty", "Knee Replacement"]
HOSPITAL_PREFIXES = ["Apollo", "Fortis", "Max", "Manipal", "Narayana", "Cloudnine", "Aster", "Medanta", "Lilavati"]
HOSPITAL_SUFFIXES = ["Healthcare", "Hospital", "Medical Centre", "Speciality Clinic"]

def seed_data():
    db = SessionLocal()
    try:
        # Clear existing data
        db.query(Hospital).delete()
        
        hospitals = []
        for city in CITIES:
            for procedure in PROCEDURES:
                # 20-25 hospitals per city per procedure to reach ~200
                num_hospitals = random.randint(22, 25)
                for i in range(num_hospitals):
                    name = f"{random.choice(HOSPITAL_PREFIXES)} {random.choice(HOSPITAL_SUFFIXES)} {city} {i+1}"
                    
                    # Cost variation based on procedure
                    if procedure == "Appendectomy":
                        cost = random.randint(50000, 150000)
                    elif procedure == "Angioplasty":
                        cost = random.randint(150000, 350000)
                    else: # Knee Replacement
                        cost = random.randint(250000, 500000)
                    
                    quality_score = round(random.uniform(5.0, 9.8), 1)
                    
                    hospitals.append(Hospital(
                        name=name,
                        city=city,
                        procedure=procedure,
                        cost=cost,
                        quality_score=quality_score
                    ))
        
        db.add_all(hospitals)
        db.commit()
        print(f"Successfully seeded {len(hospitals)} hospitals.")
        
    except Exception as e:
        print(f"Error seeding data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_data()
