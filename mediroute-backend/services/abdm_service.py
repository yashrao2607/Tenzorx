import logging
from typing import Dict, Any, Optional

logger = logging.getLogger(__name__)

# Mock Registry of ABHA IDs and their clinical profiles
# In a real scenario, this would call the ABDM Gateway / Health Repository
MOCK_ABDM_REGISTRY = {
    "1234-5678-9012": {
        "full_name": "Rahul Sharma",
        "abha_id": "1234-5678-9012",
        "gender": "M",
        "dob": "1992-05-15",
        "blood_group": "O+",
        "comorbidities": ["Diabetes", "Hypertension"],
        "past_surgeries": ["Appendectomy (2018)"],
        "verified": True
    },
    "4321-8765-2109": {
        "full_name": "Priya Verma",
        "abha_id": "4321-8765-2109",
        "gender": "F",
        "dob": "1985-11-20",
        "blood_group": "B+",
        "comorbidities": ["Heart Disease"],
        "past_surgeries": ["None"],
        "verified": True
    },
    "1111-2222-3333": {
        "full_name": "Amit Patel",
        "abha_id": "1111-2222-3333",
        "gender": "M",
        "dob": "1970-01-01",
        "blood_group": "A+",
        "comorbidities": ["Diabetes", "Obesity", "Hypertension"],
        "past_surgeries": ["Gallbladder Removal (2021)"],
        "verified": True
    }
}

class AbdmService:
    @staticmethod
    def fetch_health_records(abha_id: str) -> Optional[Dict[str, Any]]:
        """
        Simulates fetching health records from the ABDM Digital Health Locker.
        """
        # Normalize the ID (remove hyphens and spaces)
        normalized_id = abha_id.replace("-", "").replace(" ", "")
        
        # Format it back to standard for lookup
        if len(normalized_id) == 14:
            formatted_id = f"{normalized_id[:4]}-{normalized_id[4:8]}-{normalized_id[8:]}"
        else:
            formatted_id = abha_id

        logger.info(f"[ABDM] Fetching records for ABHA ID: {formatted_id}")
        
        # Simulate network latency
        import time
        # time.sleep(0.5) 
        
        return MOCK_ABDM_REGISTRY.get(formatted_id)

abdm_service = AbdmService()
