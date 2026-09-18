# 대학교 정보보안학과 정적 홈페이지

## 디렉터리 구조

```text
cyber-security-department/
├── index.html
├── department.html
├── professors.html
├── curriculum.html
├── research.html
├── campus-life.html
├── clubs.html
├── career.html
├── css/
│   ├── style.css
│   └── responsive.css
└── images/
    ├── hero-security.jpg
    ├── professors/
    ├── campus/
    ├── clubs/
    ├── research/
    └── icons/
```

## 실행 및 배포

별도 빌드가 필요하지 않습니다. `cyber-security-department` 폴더를 Apache의 `/var/www/html/` 또는 Nginx의 `/usr/share/nginx/html/` 아래에 복사한 뒤 `index.html`에 접속합니다. 모든 링크와 자산 경로는 상대경로입니다.

## 콘텐츠 교체 안내

- 교수진 페이지의 이름, 사진, 연구 분야, 담당 과목, 이메일은 실제 정보로 교체합니다.
- 주소, 전화번호, 이메일은 학교 공식 정보로 교체합니다.
- 대학생활 및 동아리의 시각적 자리표시자는 실제 활동 사진으로 교체합니다.
- HTML과 CSS만 사용하며 JavaScript 및 외부 프레임워크는 포함하지 않습니다.
