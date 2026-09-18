# NIGHT 미디어 원본 관리

사이트에서 사용하는 미디어는 **보관용 원본**과 **배포용 파일**을 분리해 관리합니다. `public/assets/images`와 `public/assets/audio`는 빌드·배포에 포함되는 웹 전달용 영역이며, 원본 보관소가 아닙니다.

## 저장 위치와 역할

- 보관용 원본: 로컬 원본 아카이브 또는 별도 클라우드 등 저장소 외부에 보관합니다. GitHub Pages와 `public`에는 넣지 않습니다.
- `public/assets/images`: 페이지가 실제로 불러오는 최적화 이미지입니다.
- `public/assets/audio`: 페이지가 실제로 불러오는 배포용 음원입니다.
- `original-media-manifest.json`: WebP로 교체한 PNG 원본의 경로·용량·SHA-256 기록입니다. 원본 파일 자체를 포함하지 않습니다.
- `media-conversions.json`: PNG 원본과 WebP 배포본의 대응 경로, 양쪽 해시·용량·픽셀 크기, 신규 변환/기존 파일 재사용 여부를 기록하는 **변환 이력**입니다. 과거에 배포되었다가 은퇴한 변환도 이력 보존을 위해 삭제하지 않습니다.
- `retired-media.json`: 더 이상 페이지에서 사용하지 않아 `public`에서 제거한 웹 배포본 경로를 기록합니다. 이 파일에 있는 경로는 `media-conversions.json`의 과거 변환 이력은 유지하지만 현재 배포 파일로 간주하지 않습니다.
- `web-media-manifest.json`: 현재 `public/assets`에 배포되는 전체 미디어의 개수·용량·집계 SHA-256 지문입니다.
- `image-audit.json`: 현재 배포 이미지의 크기·참조 상태·중복 여부를 기록합니다.

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

## 검증 원칙

- `npm run audit:media`는 현재 배포 파일의 바이트 수와 SHA-256이 매니페스트와 같은지 확인합니다.
- 활성 변환 기록의 원본 경로가 `public`에 다시 들어오지 않았는지, 코드가 삭제된 PNG를 참조하지 않는지 확인합니다.
- `retired-media.json`의 경로는 `public`에 존재하거나 소스에서 다시 참조되면 실패합니다.
- 신규 변환본은 원본과 WebP의 픽셀 크기가 같은지 확인해 의도하지 않은 리사이즈를 막습니다. 이전부터 있던 WebP를 재사용한 경우에는 원본·배포본 크기를 각각 기록합니다.
- `image-audit.json`의 `needs-dynamic-reference-review`는 삭제 허가가 아닙니다. JavaScript 경로 조합과 `full`/`thumbs` 규칙을 먼저 확인해야 합니다.
- 원본 파일을 교체하거나 새 변환을 추가할 때는 기존 매니페스트 값을 덮어쓰지 말고 새 원본 버전과 변환 이력을 명시적으로 남깁니다.

원본 파일이 필요할 때는 외부 보관소에서 SHA-256을 대조해 가져옵니다. 보관용 PNG를 복구 목적으로 `public`에 복사하지 않습니다.
