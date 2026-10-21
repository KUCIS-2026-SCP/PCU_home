/* =========================================================
   사이트 설정 파일
   - 링크, 통계 수치 등을 여기서만 수정하면 전체 사이트에 반영됩니다.
   - URL이 빈 문자열("")이면 해당 버튼은 '링크 준비 중'으로 자동 비활성화됩니다.
   ========================================================= */
window.SCP_CONFIG = {
  clubName: "S.C.P",
  fullName: "Security Contents Production",

  links: {
    instagram: "https://www.instagram.com/pcu_s.c.p/",// 예: "https://www.instagram.com/계정명"
    instagramHandle: "@pcu_s.c.p", // 예: "@scp_security"
    department: "https://cyber.pcu.ac.kr/index.html", // 학과 공식 홈페이지 URL
    departmentName: "배재대학교 정보보안학과",  // 예: "OO대학교 정보보안학과"
    github: "https://github.com/KUCIS-2026-SCP",// 예: "https://github.com/조직명"
    email: "",           // 예: "scp@university.ac.kr"
    joinForm: ""         // 가입 신청 폼 URL (구글 폼 등)
  },

  // 메인 페이지 통계 — 값이 null이면 '추후 등록'으로 표시됩니다.
  stats: {
    founded: null,       // 예: 2019
    projects: null,      // 예: 12
    awards: null,        // 예: 8
    activities: null     // 예: 40
  }
};
