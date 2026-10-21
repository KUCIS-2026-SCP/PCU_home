/* =========================================================
   공통 기능 + 페이지별 렌더링
   - 각 페이지의 <body data-page="..."> 값에 따라 필요한 기능만 실행합니다.
   ========================================================= */
(function () {
  var cfg = window.SCP_CONFIG || { links: {}, stats: {} };
  var PENDING = "추후 등록";

  /* HTML 특수문자 이스케이프 (데이터 안전하게 출력) */
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* 기본 프로필 이미지 (SVG 데이터) */
  var DEFAULT_AVATAR = "data:image/svg+xml," + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><rect width="96" height="96" fill="#101827"/><circle cx="48" cy="38" r="16" fill="#334155"/><rect x="20" y="62" width="56" height="26" rx="13" fill="#334155"/></svg>');
  var DEFAULT_IMG = "data:image/svg+xml," + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 100"><rect width="160" height="100" fill="#101827"/><text x="80" y="55" fill="#334155" font-family="monospace" font-size="10" text-anchor="middle">NO IMAGE</text></svg>');

  /* ---------- 스크롤 등장 효과 ---------- */
  function initReveal() {
    var els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("visible"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("visible"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---------- 외부 링크 버튼 설정 ----------
     <a data-link="instagram"> 처럼 쓰면 config.js의 URL로 연결,
     URL이 없으면 '링크 준비 중'으로 비활성화 */
  function initLinks() {
    document.querySelectorAll("[data-link]").forEach(function (a) {
      var key = a.getAttribute("data-link");
      var url = cfg.links[key];
      if (key === "email" && url) url = "mailto:" + url;
      if (url) {
        a.href = url;
        if (key !== "email") { a.target = "_blank"; a.rel = "noopener noreferrer"; }
      } else {
        a.removeAttribute("href");
        a.setAttribute("aria-disabled", "true");
        a.textContent = "링크 준비 중";
      }
    });
    document.querySelectorAll("[data-text]").forEach(function (el) {
      var v = cfg.links[el.getAttribute("data-text")];
      el.textContent = v || PENDING;
    });
  }

  /* ---------- 메인: 통계 ---------- */
  function renderStats() {
    document.querySelectorAll("[data-stat]").forEach(function (el) {
      var v = cfg.stats[el.getAttribute("data-stat")];
      if (v == null) { el.textContent = PENDING; el.classList.add("pending"); }
      else el.textContent = v;
    });
  }

  /* ---------- 메인: 터미널 타이핑 (연출용 가상 메시지) ---------- */
  function initTerminal() {
    var box = document.getElementById("terminal-output");
    if (!box) return;
    var lines = [
      ['<span class="p">scp@lab:~$</span> ', "whoami"],
      ["", "S.C.P — Security Contents Production"],
      ['<span class="p">scp@lab:~$</span> ', "ls ./research"],
      ["", "pentest/  forensics/  malware/  network/  web/  detection/"],
      ['<span class="p">scp@lab:~$</span> ', "cat mission.txt"],
      ["", "Learn. Research. Share. Grow together."],
      ['<span class="p">scp@lab:~$</span> ', "./join --community"],
      ['<span class="ok">[OK]</span> ', "새로운 연구원을 기다리고 있습니다."]
    ];
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      box.innerHTML = lines.map(function (l) { return l[0] + esc(l[1]); }).join("\n") + '\n<span class="cursor"></span>';
      return;
    }
    var html = "", i = 0, j = 0;
    function step() {
      if (i >= lines.length) { box.innerHTML = html + '<span class="cursor"></span>'; return; }
      var l = lines[i];
      var isCmd = l[0].indexOf("scp@lab") > -1;
      if (!isCmd) { html += l[0] + esc(l[1]) + "\n"; i++; box.innerHTML = html; setTimeout(step, 350); return; }
      j++;
      box.innerHTML = html + l[0] + esc(l[1].slice(0, j)) + '<span class="cursor"></span>';
      if (j >= l[1].length) { html += l[0] + esc(l[1]) + "\n"; i++; j = 0; setTimeout(step, 400); }
      else setTimeout(step, 55);
    }
    step();
  }

  /* ---------- 프로젝트 목록 + 필터 ---------- */
  function renderProjects() {
    var wrap = document.getElementById("project-list");
    if (!wrap) return;
    var data = window.SCP_PROJECTS || [];
    var cats = window.SCP_PROJECT_CATEGORIES;
    var filterBox = document.getElementById("project-filters");

    // URL ?category=web 으로 들어오면 해당 필터 선택
    var params = new URLSearchParams(location.search);
    var current = params.get("category") || "all";

    filterBox.innerHTML = Object.keys(cats).map(function (k) {
      return '<button class="filter-btn" data-cat="' + k + '" aria-pressed="' + (k === current) + '">' + cats[k] + "</button>";
    }).join("");

    function draw() {
      var list = data.filter(function (p) { return current === "all" || p.category === current; });
      if (!list.length) {
        wrap.innerHTML = '<div class="empty">// 등록된 프로젝트가 없습니다. (추후 등록)<br>js/projects.js 파일에 프로젝트를 추가하세요.</div>';
        return;
      }
      wrap.innerHTML = list.map(function (p) {
        var gh = p.github ? '<a class="card-link" href="' + esc(p.github) + '" target="_blank" rel="noopener noreferrer">GitHub ↗</a>' : "";
        return '<article class="card media-card">' +
          '<img src="' + esc(p.image || DEFAULT_IMG) + '" alt="' + esc(p.title) + ' 대표 이미지" loading="lazy">' +
          '<div class="body"><span class="badge">' + esc(p.status || "") + "</span>" +
          "<h3>" + esc(p.title) + "</h3>" +
          '<p class="meta">' + esc(p.period) + " · " + esc(p.members) + "명 · " + esc(cats[p.category] || "") + "</p>" +
          "<p>" + esc(p.summary) + "</p>" +
          '<div class="tags">' + (p.tech || []).map(function (t) { return '<span class="tag">' + esc(t) + "</span>"; }).join("") + "</div>" +
          '<div class="btn-group" style="margin-top:14px"><a class="btn" href="project-detail.html?id=' + encodeURIComponent(p.id) + '">상세 보기</a>' + gh + "</div>" +
          "</div></article>";
      }).join("");
    }

    filterBox.addEventListener("click", function (e) {
      var b = e.target.closest(".filter-btn");
      if (!b) return;
      current = b.getAttribute("data-cat");
      filterBox.querySelectorAll(".filter-btn").forEach(function (x) { x.setAttribute("aria-pressed", x === b); });
      draw();
    });
    draw();
  }

  /* ---------- 프로젝트 상세 ---------- */
  function renderProjectDetail() {
    var box = document.getElementById("project-detail");
    if (!box) return;
    var id = new URLSearchParams(location.search).get("id");
    var p = (window.SCP_PROJECTS || []).filter(function (x) { return x.id === id; })[0];
    if (!p) {
      box.innerHTML = '<div class="empty">// 프로젝트를 찾을 수 없습니다.<br><a class="card-link" href="projects.html">← 프로젝트 목록으로</a></div>';
      return;
    }
    var d = p.detail || {};
    document.title = p.title + " | S.C.P";
    document.getElementById("detail-title").textContent = p.title;
    document.getElementById("detail-meta").textContent = p.period + " · " + p.members + "명 · " + (p.status || "");
    function sec(t, v) { return v ? '<section class="card" style="margin-bottom:16px"><h3>' + t + "</h3><p>" + esc(v) + "</p></section>" : ""; }
    box.innerHTML =
      sec("프로젝트 개요", d.overview) + sec("개발 목적", d.purpose) +
      '<section class="card" style="margin-bottom:16px"><h3>사용 기술</h3><div class="tags">' + (p.tech || []).map(function (t) { return '<span class="tag">' + esc(t) + "</span>"; }).join("") + "</div></section>" +
      sec("시스템 아키텍처", d.architecture) + sec("개발 과정", d.process) +
      (d.features && d.features.length ? '<section class="card" style="margin-bottom:16px"><h3>주요 기능</h3><ul class="muted">' + d.features.map(function (f) { return "<li>— " + esc(f) + "</li>"; }).join("") + "</ul></section>" : "") +
      sec("결과 및 성과", d.results) +
      (d.images && d.images.length ? '<div class="grid grid-2" style="margin-bottom:16px">' + d.images.map(function (src) { return '<img src="' + esc(src) + '" alt="' + esc(p.title) + ' 관련 이미지" loading="lazy" style="border-radius:10px">'; }).join("") + "</div>" : "") +
      '<div class="btn-group">' + (p.github ? '<a class="btn btn-primary" href="' + esc(p.github) + '" target="_blank" rel="noopener noreferrer">GitHub 저장소 ↗</a>' : "") +
      '<a class="btn" href="projects.html">← 목록으로</a></div>';
  }

  /* ---------- 실적 타임라인 ---------- */
  function renderAchievements() {
    var box = document.getElementById("achievement-list");
    if (!box) return;
    var data = (window.SCP_ACHIEVEMENTS || []).slice().sort(function (a, b) { return b.year - a.year; });
    if (!data.length) {
      box.innerHTML = '<div class="empty">// 등록된 실적이 없습니다. (추후 등록)<br>확인된 실적은 js/achievements.js 에 아래 형식으로 추가하세요.' +
        '<pre class="code">{\n  year: 2026,\n  type: "CTF",\n  name: "대회명",\n  host: "주최 기관",\n  team: "참가 팀",\n  award: "수상 내역 (참가만 했다면 빈 값)",\n  image: "assets/images/awards/파일명.jpg",\n  link: "공식 결과 URL"\n}</pre></div>';
      return;
    }
    var years = {};
    data.forEach(function (a) { (years[a.year] = years[a.year] || []).push(a); });
    box.innerHTML = '<div class="timeline">' + Object.keys(years).sort(function (a, b) { return b - a; }).map(function (y) {
      return '<h2 class="tl-year">' + y + '</h2><div class="tl-items">' + years[y].map(function (a) {
        var won = !!a.award;
        return '<article class="card"><span class="badge' + (won ? " award" : "") + '">' + (won ? "🏆 " + esc(a.award) : "참가") + "</span>" +
          '<h3 style="margin-top:10px">' + esc(a.name) + "</h3>" +
          '<p class="meta">' + esc(a.type) + " · " + esc(a.host) + " · 팀 " + esc(a.team) + "</p>" +
          (a.image ? '<img src="' + esc(a.image) + '" alt="' + esc(a.name) + '" loading="lazy" style="margin-top:12px;border-radius:8px">' : "") +
          (a.link ? '<a class="card-link" href="' + esc(a.link) + '" target="_blank" rel="noopener noreferrer">공식 링크 ↗</a>' : "") +
          "</article>";
      }).join("") + "</div>";
    }).join("") + "</div>";
  }

  /* ---------- 활동 + 라이트박스 ---------- */
  function renderActivities() {
    var box = document.getElementById("activity-list");
    if (!box) return;
    var data = (window.SCP_ACTIVITIES || []).slice().sort(function (a, b) { return a.date < b.date ? 1 : -1; });
    if (!data.length) {
      box.innerHTML = '<div class="empty">// 등록된 활동 기록이 없습니다. (추후 등록)<br>js/achievements.js 의 SCP_ACTIVITIES 배열에 추가하세요.</div>';
      return;
    }
    box.innerHTML = data.map(function (a, i) {
      return '<article class="card media-card">' +
        '<button class="lb-trigger" data-i="' + i + '" style="all:unset;cursor:zoom-in;display:block" aria-label="' + esc(a.title) + ' 이미지 확대">' +
        '<img src="' + esc(a.image || DEFAULT_IMG) + '" alt="' + esc(a.title) + '" loading="lazy"></button>' +
        '<div class="body"><p class="meta">' + esc(a.date) + " · " + esc(a.type) + "</p><h3>" + esc(a.title) + "</h3><p>" + esc(a.desc) + "</p>" +
        '<button class="card-link lb-trigger" data-i="' + i + '" style="background:none;border:0;text-align:left">상세 보기 →</button></div></article>';
    }).join("");

    var lb = document.getElementById("lightbox");
    var img = lb.querySelector("img"), cap = lb.querySelector("figcaption"), close = lb.querySelector(".lightbox-close");
    var last = null;
    function open(i) {
      var a = data[i]; last = document.activeElement;
      img.src = a.image || DEFAULT_IMG; img.alt = a.title;
      cap.textContent = a.title + " — " + (a.desc || "");
      lb.classList.add("open"); close.focus();
    }
    function shut() { lb.classList.remove("open"); if (last) last.focus(); }
    box.addEventListener("click", function (e) { var t = e.target.closest(".lb-trigger"); if (t) open(+t.dataset.i); });
    close.addEventListener("click", shut);
    lb.addEventListener("click", function (e) { if (e.target === lb) shut(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && lb.classList.contains("open")) shut(); });
  }

  /* ---------- 구성원 ---------- */
  function renderMembers() {
    var box = document.getElementById("member-list");
    if (!box) return;
    var groups = ["지도교수", "동아리 대표", "운영진", "일반 회원", "졸업 회원"];
    var data = window.SCP_MEMBERS || [];
    box.innerHTML = groups.map(function (g) {
      var list = data.filter(function (m) { return m.group === g; });
      var body = list.length ? list.map(function (m) {
        return '<article class="card member"><img class="avatar" src="' + esc(m.image || DEFAULT_AVATAR) + '" alt="' + esc(m.name) + ' 프로필" loading="lazy">' +
          "<h3>" + esc(m.name) + '</h3><p class="ko">' + esc(m.role) + "</p><p>" + esc(m.interest) + "</p>" +
          '<div class="btn-group" style="justify-content:center;margin-top:10px">' +
          (m.github ? '<a class="card-link" href="' + esc(m.github) + '" target="_blank" rel="noopener noreferrer">GitHub ↗</a>' : "") +
          (m.homepage ? '<a class="card-link" href="' + esc(m.homepage) + '" target="_blank" rel="noopener noreferrer">Homepage ↗</a>' : "") +
          "</div></article>";
      }).join("") : '<div class="empty">// 추후 등록</div>';
      return '<h2 class="group-title">## ' + g + '</h2><div class="grid grid-4">' + body + "</div>";
    }).join("");
  }

  document.addEventListener("DOMContentLoaded", function () {
    initLinks(); renderStats(); initTerminal();
    renderProjects(); renderProjectDetail(); renderAchievements(); renderActivities(); renderMembers();
    initReveal();
  });
})();
