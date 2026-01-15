# 대만 문서 OCR 텍스트 추출

Naver Clova OCR API를 사용하여 대만 여권과 운전면허증에서 텍스트를 추출하는 웹 애플리케이션입니다.

## 기능

- 문서 타입 선택 (여권 / 운전면허증)
- 이미지 파일 업로드 및 미리보기
- Naver Clova OCR API를 통한 텍스트 추출
- 추출된 텍스트의 신뢰도 표시
- 전체 텍스트 통합 보기
- 클립보드로 텍스트 복사

## 기술 스택

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS
- **Backend**: Vercel Serverless Functions
- **API**: Naver Clova OCR (여권 & 운전면허증)

## 프로젝트 구조

```
ocr-sample-naver-clova/
├── src/
│   ├── App.tsx          # 메인 애플리케이션 컴포넌트
│   ├── main.tsx         # React 진입점
│   └── index.css        # Tailwind CSS 스타일
├── api/
│   ├── ocr-passport.ts  # 여권 OCR Serverless Function
│   └── ocr-license.ts   # 운전면허증 OCR Serverless Function
├── server/
│   └── index.ts         # 로컬 개발용 Express 서버
├── vercel.json          # Vercel 배포 설정
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

1. 문서 타입을 선택합니다 (여권 또는 운전면허증)
2. "이미지 선택" 버튼을 클릭하여 해당 문서 이미지를 선택합니다.
3. 선택한 이미지의 미리보기가 표시됩니다.
4. "텍스트 추출하기" 버튼을 클릭합니다.
5. OCR 결과가 표시됩니다:
   - 각 필드별 텍스트와 신뢰도
   - 전체 텍스트 통합 보기
6. "텍스트 복사하기" 버튼으로 추출된 텍스트를 클립보드에 복사할 수 있습니다.

## 빌드

프로덕션 빌드를 생성하려면:

```bash
pnpm run build
```

빌드된 파일은 `dist/` 디렉토리에 생성됩니다.

## Vercel 배포

이 프로젝트는 Vercel에 배포할 수 있습니다. 자세한 배포 가이드는 [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)를 참고하세요.

### 빠른 배포 가이드

1. Vercel에 프로젝트 연결
2. 환경 변수 설정 (API URL, Secret Keys)
3. 배포

## 개발 환경 vs 프로덕션 환경

### 로컬 개발
- 백엔드: Express 서버 (`server/index.ts`)
- API URL: `http://localhost:3001/api/*`

### Vercel 프로덕션
- 백엔드: Serverless Functions (`api/*.ts`)
- API URL: `/api/*` (상대 경로, 자동으로 Vercel 도메인 사용)

프론트엔드는 환경을 자동으로 감지하여 적절한 API URL을 사용합니다.

## 라이선스

MIT