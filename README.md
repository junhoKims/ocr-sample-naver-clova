# Naver OCR Clova 이미지 텍스트 추출

Naver Clova OCR API를 사용하여 이미지에서 텍스트를 추출하는 웹 애플리케이션입니다.

## 기능

- 이미지 파일 업로드 및 미리보기
- Naver Clova OCR API를 통한 텍스트 추출
- 추출된 텍스트의 신뢰도 표시
- 전체 텍스트 통합 보기
- 클립보드로 텍스트 복사

## 기술 스택

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS
- **Backend**: Express, Node.js, TypeScript
- **API**: Naver Clova OCR

## 프로젝트 구조

```
ocr-sample-naver-clova/
├── src/
│   ├── App.tsx          # 메인 애플리케이션 컴포넌트
│   ├── main.tsx         # React 진입점
│   └── index.css        # Tailwind CSS 스타일
├── server/
│   └── index.ts         # Express 프록시 서버 (CORS 해결용)
└── package.json
```

## 설치 및 실행

### 1. 의존성 설치

```bash
pnpm install
```

### 2. 서버 실행

애플리케이션을 실행하려면 **두 개의 터미널**이 필요합니다.

#### 터미널 1: 백엔드 프록시 서버 실행

```bash
pnpm run dev:server
```

서버가 `http://localhost:3001`에서 실행됩니다.

#### 터미널 2: 프론트엔드 개발 서버 실행

```bash
pnpm run dev
```

프론트엔드가 `http://localhost:5173`에서 실행됩니다.

### 3. 브라우저에서 접속

브라우저를 열고 `http://localhost:5173`에 접속합니다.

## 사용 방법

1. "이미지 선택" 버튼을 클릭하여 텍스트가 포함된 이미지를 선택합니다.
2. 선택한 이미지의 미리보기가 표시됩니다.
3. "텍스트 추출하기" 버튼을 클릭합니다.
4. OCR 결과가 표시됩니다:
   - 각 필드별 텍스트와 신뢰도
   - 전체 텍스트 통합 보기
5. "텍스트 복사하기" 버튼으로 추출된 텍스트를 클립보드에 복사할 수 있습니다.

## 빌드

프로덕션 빌드를 생성하려면:

```bash
pnpm run build
```

빌드된 파일은 `dist/` 디렉토리에 생성됩니다.

## CORS 문제 해결

이 프로젝트는 Naver OCR API의 CORS 제한을 우회하기 위해 Express 백엔드 프록시 서버를 사용합니다.

- 프론트엔드 → 백엔드 프록시 (`localhost:3001`) → Naver OCR API
- 백엔드 서버에서 CORS 헤더를 설정하여 프론트엔드의 요청을 허용합니다.

## 라이선스

MIT