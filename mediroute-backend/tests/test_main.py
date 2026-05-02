from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_analyze_intent_fallback():
    # Test with empty input to trigger error or just check structure
    response = client.post("/api/analyze-intent", json={
        "symptoms": "chest pain",
        "age": 55,
        "location": "Nagpur"
    })
    assert response.status_code == 200
    data = response.json()
    assert "icd10_code" in data
    assert "procedure_name" in data

def test_estimate_cost():
    response = client.post("/api/estimate-cost", json={
        "procedure_name": "Angioplasty",
        "comorbidities": ["Diabetes"],
        "location": "Nagpur"
    })
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
    assert "hospital_name" in data[0]
