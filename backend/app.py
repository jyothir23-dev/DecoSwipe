from flask import Flask, jsonify, request
from flask_cors import CORS
from recommendation import get_style_preference

app = Flask(__name__)
CORS(app)


@app.route("/")
def home():
    return "DecoSwipe Python Backend is Working!"


@app.route("/recommendation", methods=["POST"])
def recommendation():

    data = request.get_json()

    liked_furniture = data.get("liked_furniture", [])

    preferred_style = get_style_preference(liked_furniture)

    return jsonify({
        "preferred_style": preferred_style
    })


if __name__ == "__main__":
    app.run(debug=True)