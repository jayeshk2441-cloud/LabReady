from flask import Flask, request, jsonify
from flask_cors import CORS
import subprocess
import tempfile
import os

app = Flask(__name__)
CORS(app)


@app.route("/run-code", methods=["POST"])
def run_code():
    data = request.get_json()

    code = data.get("code", "")

    if not code.strip():
        return jsonify({
            "success": False,
            "error": "Code is empty."
        })

    temp_file = None

    try:
        with tempfile.NamedTemporaryFile(
            mode="w",
            suffix=".py",
            delete=False,
            encoding="utf-8"
        ) as file:

            file.write(code)
            temp_file = file.name

        result = subprocess.run(
            ["python", temp_file],
            capture_output=True,
            text=True,
            timeout=5
        )

        return jsonify({
            "success": result.returncode == 0,
            "output": result.stdout,
            "error": result.stderr
        })

    except subprocess.TimeoutExpired:

        return jsonify({
            "success": False,
            "error": "Program took too long to run."
        })

    except Exception as error:

        return jsonify({
            "success": False,
            "error": str(error)
        })

    finally:

        if temp_file and os.path.exists(temp_file):
            os.remove(temp_file)


@app.route("/")
def home():
    return "LabReady backend is running!"


if __name__ == "__main__":
    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )