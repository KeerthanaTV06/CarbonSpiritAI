"""
calculator.py — Sustainability Score Engine

Calculates a 0–100 score from user answers.
Each category has a weight and a set of answer scores.
"""

# Answer scores per category (defined to mirror frontend options)
ANSWER_SCORES = {
    "transport": {
        "car_solo": 0,
        "car_shared": 30,
        "public": 60,
        "ev": 75,
        "bike_walk": 100,
    },
    "food": {
        "heavy_meat": 0,
        "meat_regular": 25,
        "flexitarian": 55,
        "vegetarian": 80,
        "vegan": 100,
    },
    "electricity": {
        "very_high": 0,
        "high": 25,
        "moderate": 55,
        "low": 80,
        "renewable": 100,
    },
    "shopping": {
        "weekly": 0,
        "monthly": 25,
        "occasionally": 60,
        "rarely": 80,
        "secondhand": 100,
    },
    "recycling": {
        "never": 0,
        "sometimes": 30,
        "most": 65,
        "always": 85,
        "zero_waste": 100,
    },
    "water": {
        "wasteful": 0,
        "average": 35,
        "some_effort": 60,
        "careful": 80,
        "very_careful": 100,
    },
    "travel": {
        "monthly": 0,
        "quarterly": 20,
        "twice": 45,
        "once": 70,
        "never": 100,
    },
    "digital": {
        "very_high": 0,
        "high": 25,
        "moderate": 55,
        "low": 80,
        "minimal": 100,
    },
    "home": {
        "poor": 0,
        "average": 30,
        "some": 60,
        "good": 80,
        "excellent": 100,
    },
}

# Category weights (must sum to 1.0)
WEIGHTS = {
    "transport": 0.18,   # Highest impact
    "food": 0.18,        # Highest impact
    "electricity": 0.14,
    "travel": 0.12,
    "shopping": 0.10,
    "home": 0.10,
    "recycling": 0.08,
    "water": 0.06,
    "digital": 0.04,
}


def calculate_score(answers: dict) -> int:
    """
    Calculate a weighted sustainability score from 0–100.

    Args:
        answers: dict of {category_id: answer_value}

    Returns:
        Integer score 0–100
    """
    total_weight = 0.0
    weighted_sum = 0.0

    for category, answer_value in answers.items():
        category_scores = ANSWER_SCORES.get(category)
        if category_scores is None:
            continue  # Unknown category — skip

        raw_score = category_scores.get(answer_value)
        if raw_score is None:
            raw_score = 50  # Neutral default for unknown answer

        weight = WEIGHTS.get(category, 0.05)
        weighted_sum += raw_score * weight
        total_weight += weight

    if total_weight == 0:
        return 50  # Default neutral score

    # Normalize to 0–100
    score = (weighted_sum / total_weight)
    return max(0, min(100, round(score)))
