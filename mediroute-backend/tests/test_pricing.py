import requests
import json

def test_cost_analysis():
    url = "http://localhost:8000/api/cost-analysis"
    payload = {
        "procedure": "Knee Replacement",
        "city": "Bangalore",
        "comorbidities": ["diabetes", "hypertension"],
        "requested_loan_amount": 500000
    }
    
    print(f"Testing Pricing Engine: {url}")
    try:
        response = requests.post(url, json=payload)
        response.raise_for_status()
        
        data = response.json()
        print("\n--- Cost Benchmarks ---")
        print(f"Min Cost: ₹{data['min_cost']:,}")
        print(f"Max Cost: ₹{data['max_cost']:,}")
        print(f"Base Recommended Cost: ₹{data['base_recommended_cost']:,}")
        print(f"Adjusted Recommended Cost: ₹{data['adjusted_recommended_cost']:,}")
        
        print("\n--- Itemized Bill (Estimated) ---")
        for item, price in data['cost_breakdown'].items():
            print(f"- {item.replace('_', ' ').title()}: ₹{price:,}")
        
        if data['applied_factors']:
            print("Applied Factors:")
            for factor in data['applied_factors']:
                print(f"  - {factor['condition']}: {factor['impact']}")
        print(f"Potential Savings Opportunity: ₹{data['savings_opportunity']:,}")
        print(f"Market Insight: {data['insight']}")
        print(f"Financial Risk Flag: {data['risk_flag'].upper()}")
        
        print("\n--- Underwriting Intelligence ---")
        print(f"Loan Recommendation: {data['loan_recommendation']}")
        print(f"Decision Confidence: {data['decision_confidence']}")
        print(f"Overpricing Index: {data['overpricing_percent']}%")
        print(f"Fraud Flag: {data['fraud_flag']}")
        print(f"Decision Reason: {data['reason']}")
        
        print("\n--- Top 3 Best Value Hospitals ---")
        for h in data['hospital_options'][:3]:
            print(f"- {h['name']}: ₹{h['cost']:,} (Quality: {h['quality_score']})")
            
        print("\n✅ Pricing Engine is fully operational!")
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        print("Note: Ensure the FastAPI server is running with 'python main.py'")

if __name__ == "__main__":
    test_cost_analysis()
