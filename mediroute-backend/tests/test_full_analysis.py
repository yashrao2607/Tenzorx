import requests
import json

def test_full_analysis():
    url = "http://localhost:8000/api/full-analysis"
    payload = {
        "symptom_text": "I have sharp pain in my lower right abdomen and fever",
        "city": "Delhi",
        "comorbidities": ["diabetes"],
        "requested_loan_amount": 150000
    }
    
    print(f"🚀 Triggering Multi-Agent Pipeline: {url}")
    try:
        response = requests.post(url, json=payload)
        response.raise_for_status()
        
        data = response.json()
        print(f"\n📢 EXECUTIVE SUMMARY: {data['summary']}")
        print(f"🎖️ OVERALL CONFIDENCE: {data['overall_confidence']}")
        
        print("\n--- [1] Diagnosis Agent ---")
        print(f"Condition: {data['diagnosis']['condition']}")
        print(f"Procedure: {data['diagnosis']['recommended_procedure']}")
        
        print("\n--- [2] Cost Auditor Agent ---")
        print(f"Base Recommended Cost: ₹{data['cost_analysis']['base_recommended_cost']:,}")
        print(f"Adjusted Recommended Cost (incl. comorbidities): ₹{data['cost_analysis']['adjusted_recommended_cost']:,}")
        
        print("\n--- [2.1] Itemized Breakdown ---")
        for item, price in data['cost_analysis']['cost_breakdown'].items():
            print(f"  - {item.replace('_', ' ').title()}: ₹{price:,}")
        
        print("\n--- [3] Underwriter Agent ---")
        print(f"Recommendation: {data['underwriting']['loan_recommendation']}")
        print(f"Reason: {data['underwriting']['reason']}")
        
        print(f"\n⚡ Total Execution Time: {data['performance']['total_time']}")
        print("\n✅ Multi-Agent Orchestration Successful!")
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        print("Note: Ensure the FastAPI server is running with 'python main.py'")

if __name__ == "__main__":
    test_full_analysis()
