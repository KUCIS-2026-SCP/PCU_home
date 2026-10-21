# S.C.P 공식 홈페이지

HTML5 + CSS3 + Vanilla JavaScript로 만든 정적 웹사이트입니다. 빌드 과정 없이 바로 실행됩니다.

## 폴더 구조
```
index.html / about.html / research.html / projects.html / project-detail.html
achievements.html / activities.html / members.html / contact.html
css/style.css        공통 스타일 + 색상 변수(:root)
css/components.css   헤더, 카드, 버튼, 터미널 등
css/responsive.css   태블릿/모바일
js/config.js         링크(인스타·학과·GitHub·이메일·가입폼), 메인 통계
js/projects.js       프로젝트 데이터
js/achievements.js   실적 / 활동 / 구성원 데이터
js/navigation.js     공통 헤더·푸터 (메뉴 수정은 여기)
js/main.js           필터, 타임라인, 라이트박스, 터미널 등 기능
assets/images|icons|logos
```

## 수정 방법
- **링크**: `js/config.js`의 `links`에 URL 입력. 비워두면 "링크 준비 중"으로 표시됩니다.
- **통계**: `js/config.js`의 `stats` 값 입력 (null이면 "추후 등록").
- **프로젝트**: `js/projects.js` 배열에 주석의 예시 형식대로 객체 추가. 이미지는 `assets/images/projects/`에.
- **실적 / 활동 / 구성원**: `js/achievements.js`의 각 배열에 추가. `award`가 비어 있으면 '참가' 기록으로 표시.
- **색상**: `css/style.css` 맨 위 `:root` 변수 수정.
- **소개 문구**: 각 HTML 파일의 본문을 직접 수정.

## Ubuntu에서 실행
```bash
cd scp-website
python3 -m http.server 8000
# 브라우저에서 http://localhost:8000 접속
```
(Nginx/Apache 사용 시 폴더 전체를 웹 루트에 복사하면 됩니다.)

## GitHub Pages 배포
1. GitHub에 새 저장소 생성 후 이 폴더 내용을 push
2. 저장소 Settings → Pages → Branch: `main` / `(root)` 선택 후 Save
3. 잠시 후 `https://<계정>.github.io/<저장소>/` 에서 확인
