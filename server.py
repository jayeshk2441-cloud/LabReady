from flask import Flask, request, jsonify
from flask_cors import CORS
import subprocess
import tempfile
import os
import sys

app = Flask(__name__)
CORS(app)


@app.route("/")
def home():
    return "LabReady backend is running!"


@app.route("/run-code", methods=["POST"])
def run_code():
    data = request.get_json(silent=True) or {}

    code = data.get("code", "")
    user_input = data.get("input", "")

    if not isinstance(code, str) or not code.strip():
        return jsonify({
            "success": False,
            "error": "No Python code was provided."
        }), 400

    temp_file = None

    try:
        # Create a temporary Python file
        with tempfile.NamedTemporaryFile(
            mode="w",
            suffix=".py",
            delete=False,
            encoding="utf-8"
        ) as file:
            file.write(code)
            temp_file = file.name

        # Run the submitted Python code
        result = subprocess.run(
            [sys.executable, temp_file],
            input=user_input,
            capture_output=True,
            text=True,
            timeout=5
        )

        # Program completed successfully
        if result.returncode == 0:
            return jsonify({
                "success": True,
                "output": result.stdout,
                "error": result.stderr
            })

        # Program returned a Python/runtime error
        return jsonify({
            "success": False,
            "output": result.stdout,
            "error": result.stderr
        })

    except subprocess.TimeoutExpired:
        return jsonify({
            "success": False,
            "error": (
                "Program took too long to execute. "
                "LabReady stopped it after 5 seconds."
            )
        })

    except Exception as error:
        return jsonify({
            "success": False,
            "error": str(error)
        })

    finally:
        if temp_file and os.path.exists(temp_file):
            try:
                os.remove(temp_file)
            except OSError:
                pass


if __name__ == "__main__":
    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )