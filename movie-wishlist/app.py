import os
import requests
from dotenv import load_dotenv
from flask import Flask, jsonify, render_template, request

load_dotenv()                                # .env 파일을 읽어 환경변수로 등록
API_KEY = os.getenv("TMDB_API_KEY")          # 키는 코드에 직접 쓰지 않는다
app = Flask(__name__)


@app.route("/")
def index():
    return render_template("index.html")     # 화면(HTML)을 보여줌


@app.route("/api/search")
def search():
    q = request.args.get("q", "").strip()
    if not q:
        return jsonify([])
    res = requests.get(
        "https://api.themoviedb.org/3/search/movie",
        params={"api_key": API_KEY, "query": q, "language": "ko-KR"},
        timeout=10,
    )
    return jsonify(res.json().get("results", []))  # 브라우저엔 결과만 전달, 키는 숨김


if __name__ == "__main__":
    app.run(debug=True)
