# TMDB API로 영화 검색 & 찜 목록 만들기 (Flask)

## 1. 파일들이 하는 역할
| 파일 | 역할 |
|---|---|
| `app.py` | 서버. 화면을 보여주고, TMDB에 검색 요청을 대신 보냄 |
| `templates/index.html` | 화면의 뼈대 (검색창, 결과 영역, 찜 목록 영역) |
| `static/style.css` | 화면 디자인 (색, 배치, 카드 모양) |
| `static/script.js` | 브라우저에서 동작하는 로직 (검색, 찜 추가/삭제) |
| `.env` | 실제 API 키 보관 (GitHub에 올리면 안 됨) |
| `.env.example` | 키 자리만 표시한 견본 (올려도 됨) |
| `.gitignore` | Git이 무시할 파일 목록 (`.env` 포함) |
| `requirements.txt` | 설치해야 할 파이썬 패키지 목록 |

## 2. 코드 분석
### HTML (`index.html`)
- `<input id="query">`: 영화 제목을 입력하는 검색창
- `<div id="results">`, `<div id="wishlist">`: JS가 영화 카드를 채워 넣을 빈 상자
- `<link>`로 CSS, `<script>`로 JS를 불러옴

### CSS (`style.css`)
- `:root` 변수로 색상을 한곳에서 관리
- `.grid`는 `repeat(auto-fill, minmax(150px, 1fr))`로 화면 폭에 맞춰 카드를 자동 배치
- `.card`는 포스터 + 제목 + 버튼을 세로로 쌓은 카드 모양

### JavaScript (`script.js`)
1. 검색창에 입력하면 0.4초 기다렸다가(`setTimeout`) `/api/search`로 요청
2. 받은 영화 목록을 카드로 만들어 화면에 표시
3. "찜하기"를 누르면 `wishlist` 배열에 추가하고 `localStorage`에 저장 → 새로고침해도 유지

### Python (`app.py`)
- `/` : HTML 페이지 반환
- `/api/search` : 브라우저가 보낸 검색어를 받아 TMDB에 요청하고 결과만 돌려줌

## 3. API란?
API(Application Programming Interface)는 **프로그램끼리 대화하는 창구**입니다.
식당에 비유하면, 손님(내 앱)이 주방(TMDB 데이터베이스)에 직접 들어가지 않고
웨이터(API)에게 "영화 검색해주세요"라고 주문하면 결과를 가져다줍니다.
이번 프로젝트에서는 `https://api.themoviedb.org/3/search/movie`에 검색어를 보내면
영화 목록이 JSON으로 돌아옵니다.

## 4. API 키는 어떻게 관리하나?
API 키는 내 계정의 **비밀번호 같은 것**이라, 코드에 직접 쓰고 GitHub에 올리면 누구나 가져다 쓸 수 있습니다.
1. 키를 `.env` 파일에 `TMDB_API_KEY=...` 형태로 저장
2. `python-dotenv`의 `load_dotenv()`로 읽어서 `os.getenv()`로 사용
3. `.gitignore`에 `.env`를 적어서 Git이 추적하지 않게 함
4. 대신 `.env.example`을 올려서 다른 사람이 어떤 설정이 필요한지 알 수 있게 함
5. 키 호출은 브라우저가 아니라 **서버(app.py)** 에서만 해서 개발자도구로 키가 노출되지 않게 함

## 5. 실행 방법
```bash
pip install -r requirements.txt
cp .env.example .env    # 열어서 본인 키 입력
python app.py           # http://127.0.0.1:5000
```
