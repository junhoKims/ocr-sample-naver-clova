# Vercel 배포 가이드

이 프로젝트를 Vercel에 배포하기 위한 단계별 가이드입니다.

## 배포 전 확인 사항

프로젝트가 Vercel Serverless Functions 환경에서 동작하도록 다음 구조로 변경되었습니다:

- ✅ `api/` 폴더: Serverless Functions (여권/운전면허증 OCR API)
- ✅ `vercel.json`: Vercel 빌드 설정
- ✅ 환경 변수 사용: API URL과 Secret Keys

## 배포 단계

### 1. Vercel 프로젝트 생성

```bash
# Vercel CLI 설치 (없는 경우)
npm install -g vercel

# 프로젝트 디렉토리에서 Vercel 로그인 및 배포
vercel
```

또는 [Vercel 대시보드](https://vercel.com)에서 GitHub 저장소를 연결하여 배포할 수 있습니다.

### 2. 환경 변수 설정

Vercel 대시보드에서 **Settings > Environment Variables**로 이동하여 다음 환경 변수들을 추가하세요:

#### 여권 OCR API
- **변수명**: `NAVER_OCR_PASSPORT_API_URL`
- **값**: `https://wwvo3sdeqd.apigw.ntruss.com/custom/v1/49443/a708e5cd9ca6dade2364bcf24da70dcae2ec794f506df269adf53df9867c6af7/infer/`

- **변수명**: `NAVER_OCR_PASSPORT_SECRET`
- **값**: `REhYUk9Hc2pSVWZyTFRqTGxabnpMYlBEVEticXRkVnc=`

#### 운전면허증 OCR API
- **변수명**: `NAVER_OCR_LICENSE_API_URL`
- **값**: `https://wwvo3sdeqd.apigw.ntruss.com/custom/v1/49446/d4bb9f337b11596dc68d58215f31bae84b70a2a3842cfc78f51d5115ebaf9306/infer/`

- **변수명**: `NAVER_OCR_LICENSE_SECRET`
- **값**: `d29Zc3BIclZGcnBBc0ZFV0xpeFRXZ1BabkxjYnpJUEg=`

**중요**: 모든 환경 변수에 대해 **Production**, **Preview**, **Development** 모두 체크하세요.

### 3. API 엔드포인트

배포 후 다음 API 엔드포인트를 사용할 수 있습니다:

- 여권 OCR: `https://your-project.vercel.app/api/ocr-passport`
- 운전면허증 OCR: `https://your-project.vercel.app/api/ocr-license`

### 4. 로컬 개발 환경 설정 (선택사항)

로컬에서 Vercel 환경을 테스트하려면:

```bash
# .env 파일 생성
cp .env.example .env

# Vercel CLI로 로컬 개발 서버 실행
vercel dev
```

## 주요 변경 사항

### API 구조 변경
- **이전**: Express 서버 (`server/index.ts`)를 별도로 실행
- **현재**: Vercel Serverless Functions (`api/` 폴더)로 자동 배포

### 프론트엔드 API 호출
- **개발 환경**: `http://localhost:3001/api/ocr-*`
- **프로덕션**: 상대 경로 `/api/ocr-*` (자동으로 Vercel 도메인 사용)

## 문제 해결

### 배포 후 API가 동작하지 않는 경우
1. Vercel 대시보드에서 환경 변수가 올바르게 설정되었는지 확인
2. Functions 탭에서 API 로그 확인
3. 환경 변수 변경 후에는 재배포 필요

### CORS 오류가 발생하는 경우
- API 파일에 CORS 헤더가 이미 설정되어 있습니다
- 추가 도메인 허용이 필요한 경우 `api/*.ts` 파일의 `Access-Control-Allow-Origin` 수정

## 참고 자료

- [Vercel Serverless Functions 문서](https://vercel.com/docs/functions)
- [Vercel 환경 변수 가이드](https://vercel.com/docs/environment-variables)
