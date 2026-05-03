import requests
import pytest

BASE_URL = "http://localhost:8011"

def test_health_check():
    response = requests.get(f"{BASE_URL}/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_fetch_abdm_records_success():
    # Test with a known mock ABHA ID
    payload = {"abha_id": "1234-5678-9012"}
    response = requests.post(f"{BASE_URL}/api/abdm/fetch-records", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["records"]["full_name"] == "Rahul Sharma"
    assert "Diabetes" in data["records"]["comorbidities"]

def test_fetch_abdm_records_not_found():
    # Test with an unknown ABHA ID
    payload = {"abha_id": "0000-0000-0000"}
    response = requests.post(f"{BASE_URL}/api/abdm/fetch-records", json=payload)
    assert response.status_code == 404

def test_register_user_with_abha():
    # Register a user with ABHA data
    payload = {
        "name": "Test User",
        "age": 30,
        "gender": "Male",
        "aadhaar": "123412341234", # Valid from README
        "pan": "ABCDE1234F",
        "occupation": "Salaried",
        "city": "Nagpur",
        "state": "Maharashtra",
        "phone": "9876543210",
        "abha_id": "1234-5678-9012",
        "health_records": {
            "comorbidities": ["Diabetes"]
        }
    }
    response = requests.post(f"{BASE_URL}/api/register-user", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "user_id" in data
    assert data["userData"]["abha_id"] == "1234-5678-9012"

if __name__ == "__main__":
    # To run this, make sure the backend is running on port 8011
    # Run with: pytest test_abdm.py
    pass
