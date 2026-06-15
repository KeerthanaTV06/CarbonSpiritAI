from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
import traceback

from gemini_service import generate_spirit
from calculator import calculate_score

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})


@app.route("/api/health", methods=["GET"])
def health():
    """Health check endpoint."""
    return jsonify({"status": "ok", "message": "Carbon Spirit API is running"}), 200


@app.route("/api/analyze", methods=["POST"])
def analyze():
    """
    Receive user answers, compute score, call Gemini, return full spirit data.

    Request body:
        { "answers": { "transport": "bike_walk", "food": "vegan", ... } }

    Response:
        {
            "score": 82,
            "spiritName": "...",
            "title": "...",
            "story": "...",
            "impact": "...",
            "strengths": [...],
            "weaknesses": [...],
            "recommendations": [...],
            "vision2050": "...",
            "motivation": "..."
        }
    """
    data = request.get_json(force=True)

    if not data or "answers" not in data:
        return jsonify({"error": "Missing 'answers' in request body"}), 400

    answers = data["answers"]

    if not isinstance(answers, dict) or len(answers) == 0:
        return jsonify({"error": "Answers must be a non-empty object"}), 400

    try:
        # Step 1: Calculate sustainability score
        score = calculate_score(answers)

        # Step 2: Generate spirit via Gemini AI
        spirit_data = generate_spirit(answers, score)

        # Step 3: Merge and return
        response = {
            "score": score,
            **spirit_data
        }
        return jsonify(response), 200

    except ValueError as ve:
        return jsonify({"error": str(ve)}), 422
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": "Internal server error. Check your GEMINI_API_KEY and backend logs."}), 500


if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    debug = os.getenv("FLASK_DEBUG", "true").lower() == "true"
    print(f"\n[Carbon Spirit] API running on http://localhost:{port}")
    print(f"   Debug mode: {debug}")
    print(f"   Gemini Key: {'[OK] Set' if os.getenv('GEMINI_API_KEY') else '[MISSING] Add GEMINI_API_KEY to .env'}\n")
    app.run(host="0.0.0.0", port=port, debug=debug)
