import requests
import json

def test_cost_analysis():
    url = "http://localhost:8000/api/cost-analysis"
    payload = {
        "procedure": "Knee Replacement",
        "city": "Bangalore"
    }
    
    print(f"Testing Pricing Engine: {url}")
    try:
        response = requests.post(url, json=payload)
        response.raise_for_status()
        
        data = response.json()
        print("\n--- Cost Benchmarks ---")
        print(f"Min Cost: ₹{data['min_cost']:,}")
        print(f"Max Cost: ₹{data['max_cost']:,}")
        print(f"Avg Cost: ₹{data['avg_cost']:,}")
        print(f"Recommended (Quality Weighted): ₹{data['recommended_cost']:,}")
        
        print("\n--- Top 3 Best Value Hospitals ---")
        for h in data['hospital_options'][:3]:
            print(f"- {h['name']}: ₹{h['cost']:,} (Quality: {h['quality_score']})")
            
        print("\n✅ Pricing Engine is fully operational!")
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        print("Note: Ensure the FastAPI server is running with 'python main.py'")

if __name__ == "__main__":
    test_cost_analysis()
