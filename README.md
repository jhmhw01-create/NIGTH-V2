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
이 저장소는 GitHub Pages에 자동 배포됩니다: https://jhmhw01-create.github.io/NIGTH-V2/
`dist`는 Git 관리에서 제외되며, 배포할 때 빌드 결과를 사용해야 합니다.
main에 반영하면 GitHub Actions가 테스트와 빌드를 실행하고 Pages를 업데이트합니다.

기존 NIGHT 저장소에는 덮어쓰지 마세요. 대상 저장소 이름은 실제 주소대로 `NIGTH-V2`입니다.

## 검수 범위

52개 페이지 빌드와 데이터 테스트, 로컬 링크·미디어 파일 검증을 진행했습니다.
실제 브라우저 화면·음원 재생 검수는 별도로 필요합니다.
React 전환 7단계: HOME·DISCOGRAPHY·CONTENTS·NOTICE·FANCLUB·GALLERY·HISTORY·LISTEN·ARCHIVE와 멤버 5명 상세 페이지, 앨범 상세 7개 및 ERA ARCHIVE, 공연·방송·수상 기록 8개, 해당 페이지의 메뉴·푸터는 React로 동작합니다. 공연 기록은 CONCERT ARCHIVE·夢夜·超夜·FANMEETING·SPECIAL MC·2026 YEAR-END AWARDS·DAESANG MOMENTS·AWARDS입니다. 기존 기록과 사진 및 주소를 유지하고 사진 확대창의 각 디자인도 보존합니다. 팬미팅 확대창과 스페셜 MC·대상 기록의 기본 dialog를 React 상태로 제어합니다.

앨범은 AFTER HOURS·COMPLETE·INFINITY·SENSATIONAL·WINGS·PERSONA·NIGHTMARE입니다. 앨범 설명·트랙리스트·이미지·기존 주소를 유지하며 사진 확대, 이전·다음, 키보드 이동 및 닫기 후 포커스 복원을 제공합니다. DISCOGRAPHY 목록은 계속 텍스트 중심입니다.

ARCHIVE의 65개 기록, 검색·분류·정렬·더 보기·검색 조건 URL과 JavaScript 미사용 시 전체 링크를 유지합니다. 멤버 소개 내용과 이미지 및 기존 주소도 보존합니다.

기존 필터와 갤러리 확대, 연혁 및 링크를 유지합니다. LISTEN은 기존 13개 브라우저 기본 음원 플레이어와 NIGHTMARE의 음원 미제공 안내를 보존하며 자동재생은 하지 않습니다. 팬클럽 1~6기와 2027·2028 시즌그리팅의 기존 링크 및 미디어도 유지합니다. 빌드 시 본문을 미리 렌더링하며, 다른 22개 페이지는 기존 HTML 생성 방식을 유지합니다. React 스크립트는 내용 기반 파일명으로 이전 캐시와 구분됩니다. 전체 React SPA 전환은 아직 아닙니다.
