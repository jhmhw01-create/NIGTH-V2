# NIGHT V2

Repository: https://github.com/jhmhw01-create/NIGTH-V2

기존 NIGHT 원본과 최근 개편 내용을 합친 독립 실행용 소스입니다.
HOME 정리, 텍스트형 DISCOGRAPHY/CONTENTS, GALLERY 분류 및 2027·2028 시즌그리팅 연결을 포함합니다.
멤버 얼굴·헤어와 원본 이미지·음원 파일은 변경하지 않았습니다.

## 실행

Node.js 22 이상에서 프로젝트 폴더를 열고 실행합니다. React와 빌드 도구를 먼저 설치합니다.

```sh
npm ci
npm run build
npm test
npm run preview
```

브라우저에서 http://localhost:4173 을 엽니다. 종료는 Ctrl+C입니다.

## 폴더

- `src/pages`: 상세 페이지와 페이지 구성
- `src/data`: 앨범·공지·팬클럽·갤러리·CONTENTS 데이터
- `src/components`: 공통 화면 구성
- `public/assets`: 원본 이미지·음원 및 사이트 스크립트/스타일
- `dist`: 빌드 후 생성되는 실제 웹사이트
- `maintenance/original-media-manifest.json`: 원본 미디어 크기 및 SHA-256 검증 기록

## GitHub에 넣기

ZIP 자체를 올리는 것이 아니라 압축을 푼 프로젝트 내부의 파일과 폴더를 저장소에 넣습니다.
파일이 많으므로 GitHub Desktop 등 Git 클라이언트로 전체 폴더를 커밋하는 방식이 적합합니다.
이 작업본은 아직 GitHub에 업로드되거나 공개 배포되지 않았습니다.
`dist`는 Git 관리에서 제외되며, 배포할 때 빌드 결과를 사용해야 합니다.
GitHub Pages를 쓸 경우에는 빌드·배포 설정이 별도로 필요합니다.

기존 NIGHT 저장소에는 덮어쓰지 마세요. 대상 저장소 이름은 실제 주소대로 `NIGTH-V2`입니다.

## 검수 범위

52개 페이지 빌드와 데이터 테스트, 로컬 링크·미디어 파일 검증을 진행했습니다.
실제 브라우저 화면·음원 재생 검수는 별도로 필요합니다.
React 전환 4단계: HOME·DISCOGRAPHY·CONTENTS·NOTICE·FANCLUB·GALLERY·HISTORY·LISTEN과 해당 페이지의 메뉴·푸터는 React로 동작합니다. 기존 필터와 갤러리 확대, 연혁 및 링크를 유지합니다. LISTEN은 기존 13개 브라우저 기본 음원 플레이어와 NIGHTMARE의 음원 미제공 안내를 보존하며 자동재생은 하지 않습니다. 팬클럽 1~6기와 2027·2028 시즌그리팅의 기존 링크 및 미디어도 유지합니다. 빌드 시 본문을 미리 렌더링하며, 다른 44개 페이지는 기존 HTML 생성 방식을 유지합니다. 전체 React SPA 전환은 아직 아닙니다.
