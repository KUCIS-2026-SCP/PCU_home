/* =========================================================
   프로젝트 데이터
   - 새 프로젝트는 아래 배열에 객체를 하나 추가하면 됩니다.
   - category 값: "web" | "network" | "malware" | "forensics" | "other"
   - status 값 예: "진행 중" | "완료"
   - 실제 진행한 프로젝트만 등록해주세요.

   [등록 예시 — 주석을 풀고 내용을 바꿔 사용]
   {
     id: "phishing-detector",            // 주소에 쓰이는 고유 ID (영문/숫자/-)
     title: "피싱 URL 탐지 도구",
     category: "web",
     period: "2026.03 ~ 2026.06",
     members: 4,
     summary: "카드에 보이는 한두 줄 소개",
     tech: ["Python", "Flask"],
     status: "완료",
     image: "assets/images/projects/phishing.jpg",
     github: "https://github.com/...",
     detail: {
       overview: "프로젝트 개요",
       purpose: "개발 목적",
       architecture: "시스템 아키텍처 설명",
       process: "개발 과정",
       features: ["주요 기능 1", "주요 기능 2"],
       results: "결과 및 성과",
       images: ["assets/images/projects/phishing-1.jpg"]
     }
   }
   ========================================================= */
window.SCP_PROJECTS = [
  // 여기에 프로젝트를 추가하세요.
];

/* 카테고리 표시 이름 */
window.SCP_PROJECT_CATEGORIES = {
  all: "ALL",
  web: "WEB SECURITY",
  network: "NETWORK",
  malware: "MALWARE",
  forensics: "FORENSICS",
  other: "OTHER"
};
