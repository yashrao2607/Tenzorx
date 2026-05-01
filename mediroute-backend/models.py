from sqlalchemy import Column, Integer, String, Float
from database import Base

class Hospital(Base):
    __tablename__ = "hospitals"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    city = Column(String, index=True)
    procedure = Column(String, index=True)
    cost = Column(Integer)
    quality_score = Column(Float)
