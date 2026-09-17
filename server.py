from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
from dotenv import load_dotenv

import subprocess
import tempfile
import os
import sys
import json


# =========================================================
# LOAD ENVIRONMENT VARIABLES
# =========================================================

load_dotenv()


# =========================================================
# FLASK APP
# =========================================================

app = Flask(__name__)
CORS(app)


# =========================================================
# OPENAI CLIENT
# =========================================================

api_key = os.getenv("OPENAI_API_KEY")

if api_key:
    client = OpenAI(api_key=api_key)
else:
    client = None


# =========================================================
# HOME
# =========================================================

@app.route("/")
def home():
    return "LabReady backend is running!"


# =========================================================
# AI QUIZ GENERATOR
# =========================================================

@app.route("/generate-quiz", methods=["POST"])
def generate_quiz():

    # Check API key
    if client is None:
        return jsonify({
            "success": False,
            "error": "OpenAI API key was not found. Check your .env file."
        }), 500

    # Read request data
    data = request.get_json(silent=True) or {}

    experiment = data.get("experiment", "")
    topic = data.get("topic", "")

    # Validate experiment
    if not isinstance(experiment, str) or not experiment.strip():
        return jsonify({
            "success": False,
            "error": "Experiment is required."
        }), 400

    # Validate topic
    if not isinstance(topic, str) or not topic.strip():
        return jsonify({
            "success": False,
            "error": "Topic is required."
        }), 400

    # -----------------------------------------------------
    # AI PROMPT
    # -----------------------------------------------------

    prompt = f"""
You are the quiz generator for LabReady, an educational
pre-lab readiness platform.

Experiment:
{experiment}

Topic:
{topic}

Generate exactly 3 different multiple-choice questions
for this topic.

Requirements:

1. Questions must be directly related to the selected topic.
2. Questions must be suitable for beginner college students.
3. Each question must have exactly 4 options.
4. Only one option must be correct.
5. Questions must be different from each other.
6. Avoid trick questions.
7. Include a short explanation for every answer.
8. The answer field must be a zero-based index:
   0 = first option
   1 = second option
   2 = third option
   3 = fourth option.
9. Return ONLY valid JSON.
10. Do not use markdown.

Return exactly this structure:

{{
    "questions": [
        {{
            "question": "Question text",
            "options": [
                "Option A",
                "Option B",
                "Option C",
                "Option D"
            ],
            "answer": 0,
            "explanation": "Short explanation"
        }}
    ]
}}
"""

    try:

        # -------------------------------------------------
        # CALL OPENAI
        # -------------------------------------------------

        response = client.responses.create(
            model="gpt-5.6-luna",
            input=prompt
        )

        # Get AI text
        raw_text = response.output_text.strip()

        # -------------------------------------------------
        # REMOVE POSSIBLE MARKDOWN CODE BLOCKS
        # -------------------------------------------------

        if raw_text.startswith("```json"):
            raw_text = raw_text[7:]

        elif raw_text.startswith("```"):
            raw_text = raw_text[3:]

        if raw_text.endswith("```"):
            raw_text = raw_text[:-3]

        raw_text = raw_text.strip()

        # -------------------------------------------------
        # CONVERT AI RESPONSE TO JSON
        # -------------------------------------------------

        quiz_data = json.loads(raw_text)

        questions = quiz_data.get("questions")

        # -------------------------------------------------
        # VALIDATE QUESTIONS
        # -------------------------------------------------

        if not isinstance(questions, list):
            raise ValueError(
                "AI did not return a valid question list."
            )

        if len(questions) != 3:
            raise ValueError(
                "AI did not return exactly 3 questions."
            )

        for question in questions:

            if not isinstance(question, dict):
                raise ValueError(
                    "Invalid question format."
                )

            question_text = question.get("question")
            options = question.get("options")
            answer = question.get("answer")
            explanation = question.get("explanation")

            if not isinstance(question_text, str):
                raise ValueError(
                    "Question text is invalid."
                )

            if not isinstance(options, list):
                raise ValueError(
                    "Options must be a list."
                )

            if len(options) != 4:
                raise ValueError(
                    "Each question must have exactly 4 options."
                )

            if answer not in [0, 1, 2, 3]:
                raise ValueError(
                    "Answer index is invalid."
                )

            if not isinstance(explanation, str):
                raise ValueError(
                    "Explanation is invalid."
                )

    # -----------------------------------------------------
    # JSON ERROR
    # -----------------------------------------------------

    except json.JSONDecodeError:

        return jsonify({
            "success": False,
            "error": "The AI returned an invalid quiz format."
        }), 500

    # -----------------------------------------------------
    # OTHER ERRORS
    # -----------------------------------------------------

    except Exception as error:

        print("Quiz generation error:", error)

        return jsonify({
            "success": False,
            "error": str(error)
        }), 500

    # -----------------------------------------------------
    # SUCCESS
    # -----------------------------------------------------

    return jsonify({
        "success": True,
        "experiment": experiment,
        "topic": topic,
        "questions": questions
    })


# =========================================================
# PYTHON CODE EXECUTION
# =========================================================

@app.route("/run-code", methods=["POST"])
def run_code():

    data = request.get_json(silent=True) or {}

    code = data.get("code", "")
    user_input = data.get("input", "")

    # -----------------------------------------------------
    # VALIDATE CODE
    # -----------------------------------------------------

    if not isinstance(code, str) or not code.strip():

        return jsonify({
            "success": False,
            "error": "No Python code was provided."
        }), 400

    temp_file = None

    try:

        # -------------------------------------------------
        # CREATE TEMPORARY PYTHON FILE
        # -------------------------------------------------

        with tempfile.NamedTemporaryFile(
            mode="w",
            suffix=".py",
            delete=False,
            encoding="utf-8"
        ) as file:

            file.write(code)
            temp_file = file.name

        # -------------------------------------------------
        # RUN PYTHON CODE
        # -------------------------------------------------

        result = subprocess.run(
            [sys.executable, temp_file],
            input=user_input,
            capture_output=True,
            text=True,
            timeout=5
        )

        # -------------------------------------------------
        # SUCCESS
        # -------------------------------------------------

        if result.returncode == 0:

            return jsonify({
                "success": True,
                "output": result.stdout,
                "error": result.stderr
            })

        # -------------------------------------------------
        # PYTHON ERROR
        # -------------------------------------------------

        return jsonify({
            "success": False,
            "output": result.stdout,
            "error": result.stderr
        })

    # -----------------------------------------------------
    # TIMEOUT
    # -----------------------------------------------------

    except subprocess.TimeoutExpired:

        return jsonify({
            "success": False,
            "error": (
                "Program took too long to execute. "
                "LabReady stopped it after 5 seconds."
            )
        })

    # -----------------------------------------------------
    # OTHER ERROR
    # -----------------------------------------------------

    except Exception as error:

        return jsonify({
            "success": False,
            "error": str(error)
        })

    # -----------------------------------------------------
    # CLEANUP
    # -----------------------------------------------------

    finally:

        if temp_file and os.path.exists(temp_file):

            try:
                os.remove(temp_file)

            except OSError:
                pass


# =========================================================
# START SERVER
# =========================================================

if __name__ == "__main__":

    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )