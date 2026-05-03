import sys
import os

# Add the project root to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

def calculate_fairness(requested, fair_market):
    if requested <= fair_market:
        return 100
    else:
        deviation = (requested - fair_market) / fair_market
        return max(0, int(100 - (deviation * 200)))

def test_fairness_logic():
    # Test cases
    cases = [
        {"req": 100000, "fair": 100000, "expected": 100},
        {"req": 90000, "fair": 100000, "expected": 100},
        {"req": 110000, "fair": 100000, "expected": 80}, # 10% over -> 100 - (0.1 * 200) = 80
        {"req": 125000, "fair": 100000, "expected": 50}, # 25% over -> 100 - (0.25 * 200) = 50
        {"req": 150000, "fair": 100000, "expected": 0},  # 50% over -> 100 - (0.5 * 200) = 0
        {"req": 200000, "fair": 100000, "expected": 0},  # 100% over -> 0
    ]
    
    for c in cases:
        score = calculate_fairness(c["req"], c["fair"])
        print(f"Requested: {c['req']}, Fair: {c['fair']} -> Score: {score}")
        assert score == c["expected"]
    
    print("\nFairness Logic Verification Successful!")

if __name__ == "__main__":
    test_fairness_logic()
