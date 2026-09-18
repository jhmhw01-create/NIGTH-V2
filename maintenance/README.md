# NIGHT 미디어 원본 관리

사이트에서 사용하는 미디어는 **보관용 원본**과 **배포용 파일**을 분리해 관리합니다. `public/assets/images`와 `public/assets/audio`는 빌드·배포에 포함되는 웹 전달용 영역이며, 원본 보관소가 아닙니다.

## 저장 위치와 역할

- 보관용 원본: 로컬 원본 아카이브 또는 별도 클라우드 등 저장소 외부에 보관합니다. GitHub Pages와 `public`에는 넣지 않습니다.
- `public/assets/images`: 페이지가 실제로 불러오는 최적화 이미지입니다.
- `public/assets/audio`: 페이지가 실제로 불러오는 배포용 음원입니다.
- `original-media-manifest.json`: WebP로 교체한 PNG 원본의 경로·용량·SHA-256 기록입니다. 원본 파일 자체를 포함하지 않습니다.
- `media-conversions.json`: PNG 원본과 WebP 배포본의 대응 경로, 양쪽 해시·용량·픽셀 크기, 신규 변환/기존 파일 재사용 여부를 기록하는 **변환 이력**입니다. 과거에 배포되었다가 은퇴한 변환도 이력 보존을 위해 삭제하지 않습니다.
- `retired-media.json`: 더 이상 페이지에서 사용하지 않아 `public`에서 제거한 웹 배포본 경로를 기록합니다. 이 파일에 있는 경로는 `media-conversions.json`의 과거 변환 이력은 유지하지만 현재 배포 파일로 간주하지 않습니다.
- `unused-media-candidates.json`: 현재 소스와 인식 가능한 동적 경로에서 사용 근거를 찾지 못해 사람이 재검토한 미사용 후보를 기능별로 기록합니다. 이 목록 자체는 자동 삭제 허가가 아닙니다.
- `web-media-manifest.json`: 현재 `public/assets`에 배포되는 전체 미디어의 개수·용량·집계 SHA-256 지문입니다.
- `image-audit.json`: 현재 배포 이미지의 크기·참조 상태·중복 여부를 기록합니다.
- `legacy-asset-audit.json`: `public/assets/css`와 `public/assets/js`의 실제 생성 HTML 런타임 참조, 빌드 입력 참조, 미해결 후보를 기록합니다.
- `unused-legacy-assets.json`: 생성 HTML에도 없고 `src`/`scripts`의 빌드 입력 근거도 없는 레거시 CSS/JS 후보를 기록합니다. 이 목록 역시 자동 삭제 허가가 아닙니다.

## 이미지 교체 절차

1. 전달받은 원본은 파일명과 버전을 확정한 뒤 저장소 외부의 원본 보관소에 먼저 보존합니다.
2. 원본의 SHA-256과 바이트 크기를 원본 기록에 추가합니다.
3. 원본을 복제해 웹용 파일을 만듭니다. 이미지의 얼굴·헤어·인물 특징·구도·픽셀 크기는 변경하지 않으며, AI 재생성·리터치·크롭 없이 인코딩 형식과 용량만 최적화합니다.
4. 웹용 파일만 `public/assets/images`에 넣고 페이지 참조를 배포 경로로 연결합니다.
5. 변환한 파일은 `media-conversions.json`에 원본과 배포본을 한 쌍으로 기록합니다.
6. 아래 명령으로 현재 배포 매니페스트를 갱신하고 전체 검사를 실행합니다.

```sh
npm run audit:media:update
npm run audit:media
npm test
npm run build
```

## 웹 배포본 은퇴 절차

1. 코드·생성 결과·동적 경로 규칙을 확인해 실제 미사용임을 검증합니다.
2. 해당 웹 경로를 `retired-media.json`에 추가합니다.
3. `public/assets/images`의 웹 배포본만 삭제합니다.
4. `original-media-manifest.json`과 `media-conversions.json`의 원본/변환 이력은 보존합니다.
5. `npm run audit:media:update`, `npm run audit:media`, `npm test`, `npm run build`를 모두 통과시킵니다.

변환 이력이 없는 일반 웹 자산은 `unused-media-candidates.json`에서 먼저 검토 근거를 남긴 뒤 별도 삭제 변경으로 처리합니다. 미사용 후보와 실제 은퇴/삭제는 같은 단계로 간주하지 않습니다.

## 이미지 참조 상태

`image-audit.json`은 배포 이미지를 세 상태로 구분합니다.

- `referenced`: 소스에서 전체 배포 경로가 문자 그대로 확인된 이미지입니다. HTML 안에서 `&amp;` 등으로 이스케이프된 파일명도 실제 URL 문자로 정규화해 판정합니다.
- `known-dynamic`: 전체 경로가 문자 그대로는 없지만, 코드에 명시된 경로 생성식이 있거나 literal로 참조되는 `full`/`thumbs` 대응 자산을 통해 사용 근거를 확인할 수 있는 이미지입니다.
- `unresolved`: 위 두 근거를 찾지 못한 이미지입니다. 이 목록만 수동 참조 검토 대상이며, **미사용 또는 삭제 허가를 뜻하지 않습니다.**

`summary.dynamicReviewRequired`는 `unresolved` 개수만 의미합니다. 동적 사용 근거가 확인된 이미지는 `summary.knownDynamic`에 별도로 집계되며 `dynamicReferences.known`에 근거 유형과 함께 기록합니다. `dynamicReferences.unresolvedGroups`는 남은 검토 대상을 기능/폴더 단위로 묶어 후속 검토 범위를 작게 유지합니다.

MD Store는 `public/assets/js/md-store.js`의 `mdPath('...')`가 `assets/images/md/full/...` 경로를 만들고, React Store의 `thumbPath()`가 `/full/`을 `/thumbs/`로 바꿔 목록·장바구니 썸네일을 생성합니다. 따라서 두 생성식에서 근거가 확인된 MD 이미지는 `md-store-generator` 또는 `md-store-thumbnail-generator`로 `known-dynamic` 처리합니다.

## 레거시 CSS/JS 참조 상태

`legacy-asset-audit.json`은 `public/assets/css`와 `public/assets/js`의 전달 자산을 세 상태로 구분합니다.

- `runtime`: React 프리렌더가 끝난 **실제 생성 HTML**에서 해당 CSS/JS 경로가 로드되는 경우입니다. 복사되어 남아 있는 다른 레거시 파일의 문자열은 사용 근거로 세지 않습니다.
- `build-input`: 생성 HTML에서는 로드하지 않지만 `src` 또는 `scripts`가 현재 빌드 데이터/입력으로 직접 사용하는 자산입니다. 테스트 코드의 문자열 언급만으로는 사용 근거로 인정하지 않습니다.
- `unresolved`: 생성 HTML 런타임 참조도 없고 현재 빌드 입력 근거도 없는 자산입니다. 삭제 허가가 아니라 별도 검토 후보입니다.

현재 React 구조에서 `md-store.js`, `night-collections-data.js`는 브라우저 런타임 스크립트가 아니라 빌드 입력으로 유지됩니다. 반대로 `unused-legacy-assets.json`에는 런타임·빌드 입력 근거가 모두 없는 레거시 JS만 기록합니다.

`npm run build`는 사이트 링크 감사 뒤 `legacy-asset-audit.json`을 현재 생성 결과와 대조합니다. 분류가 달라지면 빌드가 실패하므로, React 전환이나 상세 페이지 정리로 CSS/JS 사용 상태가 변할 때 매니페스트 검토 없이 조용히 상태가 바뀌지 않습니다.

## 검증 원칙

- `npm run audit:media`는 현재 배포 파일의 바이트 수와 SHA-256이 매니페스트와 같은지 확인합니다.
- 배포 미디어 중 0바이트 파일이 하나라도 있으면 매니페스트 갱신 여부와 관계없이 즉시 실패합니다.
- 활성 변환 기록의 원본 경로가 `public`에 다시 들어오지 않았는지, 코드가 삭제된 PNG를 참조하지 않는지 확인합니다.
- `retired-media.json`의 경로는 `public`에 존재하거나 소스에서 다시 참조되면 실패합니다.
- 신규 변환본은 원본과 WebP의 픽셀 크기가 같은지 확인해 의도하지 않은 리사이즈를 막습니다. 이전부터 있던 WebP를 재사용한 경우에는 원본·배포본 크기를 각각 기록합니다.
- `image-audit.json`의 `unresolved`는 삭제 허가가 아닙니다. JavaScript 경로 조합과 `full`/`thumbs` 규칙을 확인한 뒤 상태를 판단합니다.
- `unused-media-candidates.json`은 현재 `unresolved`와 일치하도록 테스트합니다. 새 unresolved가 생기면 목록 검토 없이 조용히 섞이지 않도록 합니다.
- `unused-legacy-assets.json`은 `legacy-asset-audit.json`의 `unresolved`와 정확히 일치하도록 테스트합니다. CSS가 unresolved가 되거나 public JS가 다시 런타임에서 로드되면 테스트가 실패합니다.
- 원본 파일을 교체하거나 새 변환을 추가할 때는 기존 매니페스트 값을 덮어쓰지 말고 새 원본 버전과 변환 이력을 명시적으로 남깁니다.

원본 파일이 필요할 때는 외부 보관소에서 SHA-256을 대조해 가져옵니다. 보관용 PNG를 복구 목적으로 `public`에 복사하지 않습니다.
