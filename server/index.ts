import express from 'express'
import cors from 'cors'
import multer from 'multer'

const app = express()
const upload = multer()

app.use(cors())
app.use(express.json())

const NAVER_OCR_API_URL = 'https://wwvo3sdeqd.apigw.ntruss.com/custom/v1/49424/dc99b139fa2b34dceaac1be1d1a0eee14cd40bd52b9deeebc9e9ece28e752cb0/general'
const NAVER_OCR_SECRET = 'VkNra2ZyV1RzYkZVaXVnbkZZWE5qQWt1b3F1Z2dRdXo='

app.post('/api/ocr', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '이미지 파일이 필요합니다.' })
    }

    const message = req.body.message

    const formData = new FormData()
    formData.append('message', message)
    formData.append('file', new Blob([req.file.buffer], { type: req.file.mimetype }), req.file.originalname)

    const response = await fetch(NAVER_OCR_API_URL, {
      method: 'POST',
      headers: {
        'X-OCR-SECRET': NAVER_OCR_SECRET,
      },
      body: formData,
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Naver OCR API Error:', errorText)
      return res.status(response.status).json({
        error: `API 요청 실패: ${response.status} ${response.statusText}`,
        details: errorText
      })
    }

    const result = await response.json()
    res.json(result)
  } catch (error) {
    console.error('Server Error:', error)
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
