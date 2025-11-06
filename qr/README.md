# RE:VIVE QR-Anchor AR Label (Web)

**목표:** 라벨 없는 페트병에 QR 스티커를 붙이면, 카메라가 QR을 인식하여 해당 위치/각도에 맞춰 디지털 라벨을 자동 부착해 보여주는 데모.

## 사용법
1. 빈 페트병에 **QR 스티커**를 붙이세요. (어떤 QR도 가능)  
2. 스마트폰에서 `index.html`을 열고 카메라 권한을 허용하세요.  
3. 카메라가 QR을 인식하면 라벨이 자동으로 붙습니다.  
4. iOS Safari 17+ 또는 최신 Chrome 권장. 미지원 기기는 수동 중앙 배치 모드로 동작합니다.

## 파라미터
- `name`, `ing`, `size`, `event` → 라벨 텍스트 변경

예시:
```
index.html?name=RE:VIVE%20COLA&ing=물,탄산,콜라향&size=500ml&event=Fandom%20For%20Earth
```
