# WuCalc — 명조(Wuthering Waves) 데미지 계산기

게임의 복잡한 데미지 공식을 정밀 구현한 계산기 웹앱.

## 특징
- 캐릭터 49종 · 무기 104종의 스킬/패시브/공명체인 메커니즘을 TypeScript 타입 시스템으로 정량 모델링
- **단위 테스트 167개 통과** · TypeScript strict 모드 클린
- 데이터 정합성 자동 검증 (0 errors) — 공식 자료·위키 교차 검증
- Tesseract OCR(한/영)로 게임 스크린샷에서 스탯 자동 인식
- 다국어(i18n) 지원, Docker 컨테이너화

## 스택
Next.js · TypeScript(strict) · Tesseract.js · Docker

## 실행
```bash
npm install
npm run dev      # 개발 서버
npm test         # 단위 테스트
```
