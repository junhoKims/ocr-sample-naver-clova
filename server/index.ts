import express from 'express'
import cors from 'cors'
import multer from 'multer'

const app = express()
const upload = multer()

app.use(cors())
app.use(express.json())

// 여권 OCR API
const NAVER_OCR_PASSPORT_API_URL = 'https://wwvo3sdeqd.apigw.ntruss.com/custom/v1/49443/a708e5cd9ca6dade2364bcf24da70dcae2ec794f506df269adf53df9867c6af7/infer/'
const NAVER_OCR_PASSPORT_SECRET = 'REhYUk9Hc2pSVWZyTFRqTGxabnpMYlBEVEticXRkVnc='

// 운전면허증 OCR API
const NAVER_OCR_LICENSE_API_URL = 'https://wwvo3sdeqd.apigw.ntruss.com/custom/v1/49446/d4bb9f337b11596dc68d58215f31bae84b70a2a3842cfc78f51d5115ebaf9306/infer/'
const NAVER_OCR_LICENSE_SECRET = 'd29Zc3BIclZGcnBBc0ZFV0xpeFRXZ1BabkxjYnpJUEg='

// 여권 OCR API
app.post('/api/ocr-passport', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '이미지 파일이 필요합니다.' })
    }

    // 파일을 base64로 인코딩
    const base64Image = req.file.buffer.toString('base64')

    // 파일 확장자 추출
    const fileExtension = req.file.originalname.split('.').pop()?.toLowerCase() || 'jpg'

    // JSON body 생성 (샘플 코드 형식에 맞춤)
    const requestBody = {
      images: [
        {
          format: fileExtension,
          name: req.file.originalname,
          data: base64Image
        }
      ],
      requestId: `req-${Date.now()}`,
      timestamp: Date.now(),
      version: 'V2'
    }

    const response = await fetch(NAVER_OCR_PASSPORT_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-OCR-SECRET': NAVER_OCR_PASSPORT_SECRET,
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Naver OCR API Error (Passport):', errorText)
      return res.status(response.status).json({
        error: `API 요청 실패: ${response.status} ${response.statusText}`,
        details: errorText
      })
    }

    const result = await response.json()
    res.json(result)
  } catch (error) {
    console.error('Server Error (Passport):', error)
    res.status(500).json({
      error: '서버 오류가 발생했습니다.',
      details: error instanceof Error ? error.message : String(error)
    })
  }
})

// 운전면허증 OCR API
app.post('/api/ocr-license', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '이미지 파일이 필요합니다.' })
    }

    // 파일을 base64로 인코딩
    const base64Image = req.file.buffer.toString('base64')

    // 파일 확장자 추출
    const fileExtension = req.file.originalname.split('.').pop()?.toLowerCase() || 'jpg'

    // JSON body 생성 (샘플 코드 형식에 맞춤)
    const requestBody = {
      images: [
        {
          format: fileExtension,
          name: req.file.originalname,
          data: base64Image
        }
      ],
      requestId: `req-${Date.now()}`,
      timestamp: Date.now(),
      version: 'V2'
    }

    const response = await fetch(NAVER_OCR_LICENSE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-OCR-SECRET': NAVER_OCR_LICENSE_SECRET,
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Naver OCR API Error (License):', errorText)
      return res.status(response.status).json({
        error: `API 요청 실패: ${response.status} ${response.statusText}`,
        details: errorText
      })
    }

    const result = await response.json()
    res.json(result)
  } catch (error) {
    console.error('Server Error (License):', error)
    res.status(500).json({
      error: '서버 오류가 발생했습니다.',
      details: error instanceof Error ? error.message : String(error)
    })
  }
})

const PORT = 3001

app.listen(PORT, () => {
  console.log(`🚀 OCR Proxy Server running on http://localhost:${PORT}`)
})
