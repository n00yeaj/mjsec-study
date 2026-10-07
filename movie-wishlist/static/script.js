const IMG = "https://image.tmdb.org/t/p/w300";
const input = document.getElementById("query");
const resultsEl = document.getElementById("results");
const wishEl = document.getElementById("wishlist");

// 찜 목록은 브라우저 localStorage에 저장 (새로고침해도 유지)
let wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");

function card(movie, isWish) {
  const div = document.createElement("div");
  div.className = "card";
  const poster = movie.poster_path ? IMG + movie.poster_path : "";
  div.innerHTML = `<img src="${poster}" alt=""><p>${movie.title}</p>`;
  const btn = document.createElement("button");
  btn.textContent = isWish ? "찜 해제" : "찜하기";
  btn.className = isWish ? "remove" : "";
  btn.onclick = () => (isWish ? removeWish(movie.id) : addWish(movie));
  div.appendChild(btn);
  return div;
}

function renderWish() {
  wishEl.innerHTML = "";
  if (!wishlist.length) wishEl.innerHTML = '<p class="empty">아직 찜한 영화가 없어요.</p>';
  wishlist.forEach(m => wishEl.appendChild(card(m, true)));
}

function addWish(movie) {
  if (wishlist.some(m => m.id === movie.id)) return;
  wishlist.push({ id: movie.id, title: movie.title, poster_path: movie.poster_path });
  save();
}
function removeWish(id) { wishlist = wishlist.filter(m => m.id !== id); save(); }
function save() { localStorage.setItem("wishlist", JSON.stringify(wishlist)); renderWish(); }

let timer;
input.addEventListener("input", () => {
  clearTimeout(timer);                       // 타이핑 멈춘 뒤 0.4초 후 검색
  timer = setTimeout(async () => {
    const q = input.value.trim();
    resultsEl.innerHTML = "";
    if (!q) return;
    const res = await fetch("/api/search?q=" + encodeURIComponent(q));  // 우리 서버에 요청
    const movies = await res.json();
    if (!movies.length) resultsEl.innerHTML = '<p class="empty">검색 결과가 없어요.</p>';
    movies.forEach(m => resultsEl.appendChild(card(m, false)));
  }, 400);
});

renderWish();
