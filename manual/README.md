# RE:VIVE AR Label Demo (Web)

이 폴더는 **라벨 없는 페트병에 '디지털 라벨'을 덧씌워 보여주는 초간단 웹 데모**입니다.
- 카메라 풀스크린 + 이동/확대/회전 가능한 라벨 오버레이
- URL 파라미터로 제품 정보/이미지 변경
- '분리수거 인증' 버튼은 데모 동작(토스트)

## 사용 방법
1. 이 폴더 전체를 아무 정적 호스팅(예: Netlify, Vercel, GitHub Pages, S3)에 업로드하세요.
2. 스마트폰에서 `https://<your-domain>/revive_ar_demo/index.html?name=RE:VIVE%20COLA&ing=물,탄산,콜라향&size=500ml&event=MAMA%20Eco%20Challenge` 같은 URL로 접속하세요.
3. 카메라 권한을 허용하고, 라벨 박스를 병 위에 드래그/핀치로 맞추세요.

## URL 파라미터
- `name` : 제품명 (예: RE:VIVE COLA)
- `ing`  : 성분 리스트 (예: 물,탄산,콜라향)
- `size` : 용량/규격 (예: 500ml)
- `event`: 이벤트/캠페인 문구 (예: MAMA Eco Challenge)
- `img`  : 라벨 아트워크 이미지 URL (선택). PNG/JPG 절대경로 추천

예시:
```
index.html?name=RE:VIVE%20COLA&ing=물,탄산,콜라향&size=500ml&event=Fandom%20For%20Earth
```

## 한계 & 고도화 로드맵
- 이 데모는 **순수 웹**으로, 병 표면 추적/고정 없이 '수동 정렬' 방식입니다.
- 실제 제품 인식/고정은 다음 기술로 업그레이드하세요:
  - MindAR.js(이미지 타깃), WebXR, 8thWall 또는 Niantic Lightship
  - 병 형상 인식 → 라벨 자동 정렬, 궤적 추적
- QR은 단순히 URL을 여는 트리거로 사용합니다.

## QR 코드
같이 포함된 `demo_qr.png`는 아래 예시 URL을 인코딩했습니다.
호스팅 후 실제 도메인으로 바꾸어 새 QR을 생성하세요.
