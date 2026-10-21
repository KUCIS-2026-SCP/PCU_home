/* =========================================================
   공통 헤더 / 푸터 생성
   - 모든 페이지에 같은 코드를 반복하지 않도록 JS로 삽입합니다.
   - 메뉴를 추가하려면 NAV_ITEMS 배열만 수정하세요.
   ========================================================= */
(function () {
  var NAV_ITEMS = [
    { label: "HOME", href: "index.html" },
    { label: "ABOUT", href: "about.html" },
    { label: "RESEARCH", href: "research.html" },
    { label: "PROJECTS", href: "projects.html" },
    { label: "ACHIEVEMENTS", href: "achievements.html" },
    { label: "ACTIVITIES", href: "activities.html" },
    { label: "MEMBERS", href: "members.html" },
    { label: "CONTACT", href: "contact.html" }
  ];

  // 현재 페이지 파일명 (project-detail은 PROJECTS로 표시)
  var page = location.pathname.split("/").pop() || "index.html";
  if (page === "project-detail.html") page = "projects.html";

  var links = (window.SCP_CONFIG && window.SCP_CONFIG.links) || {};

  /* 외부 링크 HTML 생성: URL이 없으면 '준비 중' 텍스트 */
  function ext(url, label) {
    if (!url) return '<span class="disabled">' + label + ' (링크 준비 중)</span>';
    return '<a href="' + url + '" target="_blank" rel="noopener noreferrer">' + label + "</a>";
  }

  // ----- 헤더 -----
  var header = document.getElementById("site-header");
  if (header) {
    var menu = NAV_ITEMS.map(function (n) {
      var cur = n.href === page ? ' aria-current="page"' : "";
      return '<li><a href="' + n.href + '"' + cur + ">" + n.label + "</a></li>";
    }).join("");
    header.className = "site-header";
    header.innerHTML =
      '<nav class="container nav" aria-label="주 메뉴">' +
      '<a href="index.html" class="logo" aria-label="S.C.P 홈"><img src="assets/logos/logo.png" alt="" class="logo-img">S<span>.</span>C<span>.</span>P</a>' +
      '<button class="nav-toggle" aria-expanded="false" aria-controls="nav-menu" aria-label="메뉴 열기"><span></span></button>' +
      '<ul class="nav-menu" id="nav-menu">' + menu + "</ul></nav>";

    // 햄버거 메뉴 동작
    var btn = header.querySelector(".nav-toggle");
    var list = header.querySelector(".nav-menu");
    btn.addEventListener("click", function () {
      var open = list.classList.toggle("open");
      btn.setAttribute("aria-expanded", open);
      btn.setAttribute("aria-label", open ? "메뉴 닫기" : "메뉴 열기");
    });
    // ESC 키로 메뉴 닫기
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && list.classList.contains("open")) {
        list.classList.remove("open");
        btn.setAttribute("aria-expanded", "false");
        btn.focus();
      }
    });
  }

  // ----- 푸터 -----
  var footer = document.getElementById("site-footer");
  if (footer) {
    footer.className = "site-footer";
    footer.innerHTML =
      '<div class="container"><div class="footer-grid">' +
      '<div><a href="index.html" class="logo"><img src="assets/logos/logo.png" alt="" class="logo-img">S<span>.</span>C<span>.</span>P</a>' +
      '<p class="muted" style="margin-top:10px">S.C.P — Security Contents Production</p></div>' +
      "<div><h4>SITE</h4><ul>" +
      '<li><a href="about.html">동아리 소개</a></li>' +
      '<li><a href="research.html">연구 분야</a></li>' +
      '<li><a href="projects.html">프로젝트</a></li>' +
      '<li><a href="achievements.html">활동 실적</a></li></ul></div>' +
      "<div><h4>CHANNELS</h4><ul>" +
      "<li>" + ext(links.instagram, "Instagram") + "</li>" +
      "<li>" + ext(links.department, "학과 홈페이지") + "</li>" +
      "<li>" + ext(links.github, "GitHub") + "</li>" +
      '<li><a href="contact.html">Contact</a></li></ul></div>' +
      "</div>" +
      '<p class="copyright">Copyright © 2026 S.C.P. All rights reserved.</p></div>';
  }
})();
