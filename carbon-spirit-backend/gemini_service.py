"""
gemini_service.py — Google Gemini AI Integration

Sends user lifestyle answers to Gemini and receives a structured
Carbon Spirit JSON response. All content is dynamically generated.
"""

import os
import json
import re
import time
import google.generativeai as genai
from google.api_core.exceptions import ResourceExhausted, ServiceUnavailable
from dotenv import load_dotenv

load_dotenv()

# Models to try in order
MODELS_TO_TRY = [
    "models/gemini-2.5-flash",
    "models/gemini-2.0-flash",
    "models/gemini-2.0-flash-lite",
]

# Label maps for readable prompt generation
CATEGORY_LABELS = {
    "transport": "Primary transportation method",
    "food": "Dietary habits",
    "electricity": "Home electricity usage",
    "shopping": "Consumer shopping behavior",
    "recycling": "Recycling and waste habits",
    "water": "Water conservation practices",
    "travel": "Long-distance travel frequency",
    "digital": "Digital screen time and streaming",
    "home": "Home energy efficiency",
}

ANSWER_LABELS = {
    # Transport
    "car_solo": "Drives personal car alone",
    "car_shared": "Carpools or uses shared rides",
    "public": "Uses public transit (bus/metro/train)",
    "ev": "Drives an electric vehicle",
    "bike_walk": "Cycles or walks everywhere",
    # Food
    "heavy_meat": "Heavy meat eater (daily red meat)",
    "meat_regular": "Regular omnivore (meat most days)",
    "flexitarian": "Flexitarian (meat a few times/week)",
    "vegetarian": "Vegetarian",
    "vegan": "Vegan / fully plant-based",
    # Electricity
    "very_high": "Very high consumption",
    "high": "High consumption",
    "moderate": "Moderate, careful usage",
    "low": "Low, energy-efficient",
    "renewable": "Runs on solar/100% renewable energy",
    # Shopping
    "weekly": "Shops for new items weekly",
    "monthly": "Shops frequently (several times/month)",
    "occasionally": "Shops occasionally (once/month)",
    "rarely": "Buys only what's needed",
    "secondhand": "Mostly buys secondhand / zero new",
    # Recycling
    "never": "Rarely or never recycles",
    "sometimes": "Recycles sometimes when convenient",
    "most": "Recycles most materials consistently",
    "always": "Always recycles and composts",
    "zero_waste": "Practices zero-waste lifestyle",
    # Water
    "wasteful": "Wasteful — long showers, full baths",
    "average": "Average usage, no special habits",
    "some_effort": "Makes some effort — shorter showers",
    "careful": "Careful — low-flow fixtures, fixed leaks",
    "very_careful": "Very mindful — rainwater harvesting",
    # Travel
    "monthly": "Flies monthly or more",
    "quarterly": "Flies 4–6 times per year",
    "twice": "Flies 2–3 times per year",
    "once": "Flies once a year or less",
    "never": "Rarely flies — prefers trains/local travel",
    # Digital
    "very_high": "8+ hours of streaming/gaming daily",
    "high": "5–8 hours of screen time daily",
    "moderate": "3–5 hours daily",
    "low": "1–3 hours, device-conscious",
    "minimal": "Minimal screen time, often offline",
    # Home
    "poor": "Poorly insulated, outdated appliances",
    "average": "Average — no specific upgrades",
    "some": "Some LED lights and efficient appliances",
    "good": "Well insulated, smart thermostat",
    "excellent": "Highly efficient / solar panels installed",
}


def _build_prompt(answers: dict, score: int) -> str:
    """Construct the Gemini prompt from answers and score."""

    habits_list = []
    for category_id, answer_value in answers.items():
        category_label = CATEGORY_LABELS.get(category_id, category_id.capitalize())
        answer_label = ANSWER_LABELS.get(answer_value, answer_value.replace("_", " ").capitalize())
        habits_list.append(f"- {category_label}: {answer_label}")

    habits_text = "\n".join(habits_list)

    prompt = f"""You are a creative AI environmental analyst and storyteller.

A user has completed a sustainability lifestyle assessment. Here are their habits:

{habits_text}

Their calculated sustainability score is: {score}/100
(0 = very high carbon impact, 100 = highly sustainable lifestyle)

Based on these specific habits and score, create a deeply personalized "Carbon Spirit" for this user.
The spirit is a symbolic creature or entity that embodies their environmental impact and potential.

IMPORTANT: Make the content rich, specific, poetic, and directly tied to the user's actual habits above.
Do NOT use generic responses. Reference their specific choices in the story, impact, and recommendations.

Generate a JSON object with EXACTLY these fields:

{{
  "spiritName": "A creative, symbolic 2-4 word name for their spirit (e.g., 'The Ashen Wanderer', 'Verdant Tide Keeper', 'The Smoldering Phoenix')",
  "title": "A poetic subtitle/title for this spirit (e.g., 'Guardian of the Dimming Canopy')",
  "story": "A 3-4 sentence atmospheric backstory for this spirit. Make it poetic and reference their specific lifestyle choices (transport, diet, energy use, etc.). Should feel like a fantasy character description.",
  "impact": "2-3 sentences analyzing the carbon impact of their SPECIFIC habits. Be concrete — mention their transport choice, diet, and other notable habits. Include approximate impact context.",
  "strengths": ["3-4 specific strengths based on their best habits — be specific, not generic"],
  "weaknesses": ["3-4 specific areas where their habits cause carbon impact — reference their actual answers"],
  "recommendations": [
    "Specific, actionable recommendation 1 directly tied to their worst habit",
    "Specific, actionable recommendation 2 for another improvement area",
    "Specific, actionable recommendation 3 with a concrete first step",
    "Specific, actionable recommendation 4 for a long-term lifestyle change"
  ],
  "vision2050": "2-3 sentences describing what the world could look like in 2050 if this specific user adopts the recommended changes. Make it hopeful but grounded in their actual habits.",
  "motivation": "1-2 sentences of personalized encouragement that references their spirit name and their strongest green habit. Make it feel genuine and uplifting."
}}

Return ONLY the raw JSON object. No markdown, no code fences, no extra text."""

    return prompt


def _call_gemini(model_name: str, prompt: str, retries: int = 3) -> str:
    """Call a Gemini model with retry on rate limit / service errors."""
    model = genai.GenerativeModel(
        model_name=model_name,
        generation_config={
            "temperature": 0.85,
            "top_p": 0.95,
            "top_k": 40,
            "max_output_tokens": 2500,
        }
    )
    for attempt in range(retries):
        try:
            response = model.generate_content(prompt)
            return response.text.strip()
        except ResourceExhausted:
            wait = (attempt + 1) * 15
            print(f"[Rate limit] {model_name} attempt {attempt+1}/{retries} — waiting {wait}s...")
            if attempt < retries - 1:
                time.sleep(wait)
            else:
                raise
        except ServiceUnavailable:
            wait = (attempt + 1) * 5
            print(f"[Unavailable] {model_name} attempt {attempt+1}/{retries} — waiting {wait}s...")
            if attempt < retries - 1:
                time.sleep(wait)
            else:
                raise


def generate_spirit(answers: dict, score: int) -> dict:
    """
    Call Gemini API and return parsed spirit data dict.
    Tries multiple models with retry/backoff on rate limits.

    Args:
        answers: User's lifestyle answers
        score: Calculated sustainability score

    Returns:
        dict with spiritName, title, story, impact, strengths,
             weaknesses, recommendations, vision2050, motivation

    Raises:
        ValueError: If Gemini returns invalid JSON or API key missing
        Exception: If all models and retries are exhausted
    """
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError(
            "GEMINI_API_KEY is not set. "
            "Please add it to your .env file: GEMINI_API_KEY=your_key_here"
        )

    genai.configure(api_key=api_key)
    prompt = _build_prompt(answers, score)

    last_error = None
    raw_text = None
    for model_name in MODELS_TO_TRY:
        try:
            print(f"[Gemini] Trying model: {model_name}")
            raw_text = _call_gemini(model_name, prompt)
            print(f"[Gemini] Success with model: {model_name}")
            break
        except ResourceExhausted as e:
            print(f"[Gemini] {model_name} quota exhausted, trying next model...")
            last_error = e
        except Exception as e:
            print(f"[Gemini] {model_name} error: {e}")
            last_error = e

    if raw_text is None:
        raise Exception(
            f"All Gemini models hit quota limits. "
            f"Please wait 1 minute and try again. Last error: {last_error}"
        )

    # Parse JSON response
    try:
        spirit_data = json.loads(raw_text)
    except json.JSONDecodeError:
        json_match = re.search(r'\{.*\}', raw_text, re.DOTALL)
        if json_match:
            try:
                spirit_data = json.loads(json_match.group())
            except json.JSONDecodeError:
                raise ValueError(f"Gemini returned invalid JSON. Raw: {raw_text[:500]}")
        else:
            raise ValueError(f"Could not find JSON in Gemini response: {raw_text[:500]}")

    # Validate required fields
    required_fields = ["spiritName", "title", "story", "impact", "strengths",
                       "weaknesses", "recommendations", "vision2050", "motivation"]
    missing = [f for f in required_fields if f not in spirit_data]
    if missing:
        raise ValueError(f"Gemini response missing fields: {missing}")

    # Ensure list fields are actually lists
    for field in ["strengths", "weaknesses", "recommendations"]:
        if not isinstance(spirit_data[field], list):
            spirit_data[field] = [str(spirit_data[field])]

    # Ensure exactly 4 recommendations
    recs = spirit_data["recommendations"]
    if len(recs) < 4:
        recs.extend(["Consider reducing your overall consumption footprint."] * (4 - len(recs)))
    spirit_data["recommendations"] = recs[:4]

    return spirit_data

