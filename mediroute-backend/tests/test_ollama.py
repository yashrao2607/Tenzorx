import requests
import json

def test_analyze_symptom():
    url = "http://localhost:8000/api/analyze-symptom"
    payload = {
        "symptom_text": "I have severe abdominal pain and nausea"
    }
    
    print(f"Testing endpoint: {url}")
    print(f"Payload: {payload}")
    
    try:
        response = requests.post(url, json=payload)
        response.raise_for_status()
        
        data = response.json()
        print("\nResponse Received:")
        print(json.dumps(data, indent=2))
        
        required_fields = ["condition", "icd10_code", "recommended_procedure", "confidence_score"]
        for field in required_fields:
            if field in data:
                print(f"✅ Field '{field}' present")
            else:
                print(f"❌ Field '{field}' MISSING")
                
    except Exception as e:
        print(f"\n❌ Test Failed: {e}")
        print("Note: Ensure the FastAPI server is running and Ollama is accessible with llama3 pulled.")

if __name__ == "__main__":
    test_analyze_symptom()
