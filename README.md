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
React 전환 13단계: HOME·DISCOGRAPHY·CONTENTS·NOTICE·FANCLUB·GALLERY·HISTORY·LISTEN·ARCHIVE와 멤버 5명 상세 페이지, 앨범 상세 7개 및 ERA ARCHIVE, 공연·방송·수상 기록 8개, 팬클럽 상세 5개, BEHIND·TRAVEL·OBSERVATION 3개, VLOG·NIGHT ORIGINALS 2개, WITH LUNA·IF NIGHT 2개, PRESS·FIVE VOICES 2개, 이벤트 상세 3개, 해당 페이지의 메뉴·푸터는 React로 동작합니다.

이벤트 상세는 PHANTOM FANSIGN 2026.09.19·BIRTHDAY CAFÉ ARCHIVE·NIGHT 5TH ANNIVERSARY입니다. 기존 날짜·설명·링크·사진 93장과 각 확대창 디자인을 유지합니다. 사진 확대·이전/다음·키보드 이동·닫기·포커스 복원을 React로 제어하며 새 이벤트·기록·이미지를 추가하지 않습니다.

PRESS의 현재 기사·본문·현재 특집·기존 링크와 4개 기본 details 펼침을 그대로 보존합니다. FIVE VOICES는 인터뷰 전문과 이미지 6장·본문 링크·기본 dialog 디자인을 유지하며 사진 확대·닫기·키보드·포커스 복원을 제공합니다. PRESS는 ARCHIVE 메뉴, 인터뷰는 CONTENTS 메뉴에 표시하여 공식 NOTICE와 구분합니다. 기존 기사·인터뷰·이미지 파일에 새 설정을 추가하거나 내용을 수정하지 않습니다.

WITH LUNA의 멤버 5명·15장면과 IF NIGHT의 테마 11개·55장을 원본 JSON에서 가져옵니다. 멤버·테마 선택, 문구·사진·기존 주소, 사진 확대창 디자인, 닫기·키보드·포커스 복원과 꽃다발 상세 연결을 유지합니다. IF 콘셉트는 실제 활동 설정과 별개의 화보라는 안내를 보존합니다. 첫 선택의 본문과 선택 목록은 미리 렌더링됩니다.

VLOG 6편·55장면과 NIGHT ORIGINALS 5편·34장면은 음성 없는 사진 슬라이드로, 장면당 6초이며 자동재생하지 않습니다. 기존 에피소드·장면·캡션·추가 사진·팬 반응·꽃다발 사진·주소를 보존합니다. 재생·일시정지·탐색·다시 재생, 로딩 실패 재시도, 로딩 중 시간 정지와 비활성 탭 일시정지를 유지하며, ORIGINALS 사진 확대창과 키보드·포커스 복원도 제공합니다. 플레이어 본문과 목록은 빌드 시 미리 렌더링됩니다. ORIGINALS 데이터는 기존 night-collections-data.js의 JSON에서 빌드 시 가져오며 원본 이미지는 변환하지 않습니다.

BEHIND·TRAVEL·OBSERVATION의 문구·사진 80장·기존 주소를 보존하며 각 확대창 디자인, 이전·다음, 키보드 이동 및 닫기 후 포커스 복원을 유지합니다.

팬클럽 상세는 LUNA 4~6기와 2027·2028 시즌그리팅입니다. 구성 안내·사진 93장·기존 주소를 유지하며 시즌그리팅의 사진 36장 확대 동작과 기본 dialog 디자인을 보존합니다. LUNA 키트는 기존처럼 본문에서 사진을 확인합니다.

공연 기록은 CONCERT ARCHIVE·夢夜·超夜·FANMEETING·SPECIAL MC·2026 YEAR-END AWARDS·DAESANG MOMENTS·AWARDS입니다. 기존 기록과 사진 및 주소를 유지하고 사진 확대창의 각 디자인도 보존합니다. 팬미팅 확대창과 스페셜 MC·대상 기록의 기본 dialog를 React 상태로 제어합니다.

앨범은 AFTER HOURS·COMPLETE·INFINITY·SENSATIONAL·WINGS·PERSONA·NIGHTMARE입니다. 앨범 설명·트랙리스트·이미지·기존 주소를 유지하며 사진 확대, 이전·다음, 키보드 이동 및 닫기 후 포커스 복원을 제공합니다. DISCOGRAPHY 목록은 계속 텍스트 중심입니다.

ARCHIVE의 65개 기록, 검색·분류·정렬·더 보기·검색 조건 URL과 JavaScript 미사용 시 전체 링크를 유지합니다. 멤버 소개 내용과 이미지 및 기존 주소도 보존합니다.

기존 필터와 갤러리 확대, 연혁 및 링크를 유지합니다. LISTEN은 기존 13개 브라우저 기본 음원 플레이어와 NIGHTMARE의 음원 미제공 안내를 보존하며 자동재생은 하지 않습니다. 팬클럽 1~6기와 2027·2028 시즌그리팅의 기존 링크 및 미디어도 유지합니다. 빌드 시 본문을 미리 렌더링하며, 다른 5개 페이지는 기존 HTML 생성 방식을 유지합니다. React 스크립트는 내용 기반 파일명으로 이전 캐시와 구분됩니다. 전체 React SPA 전환은 아직 아닙니다.
