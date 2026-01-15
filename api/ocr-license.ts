import type { VercelRequest, VercelResponse } from '@vercel/node'
import multer from 'multer'

// Multer 설정 (메모리 스토리지 사용)
const upload = multer({ storage: multer.memoryStorage() })

const NAVER_OCR_LICENSE_API_URL = process.env.NAVER_OCR_LICENSE_API_URL!
const NAVER_OCR_LICENSE_SECRET = process.env.NAVER_OCR_LICENSE_SECRET!

// Multer를 Promise로 래핑
function runMiddleware(req: any, res: any, fn: any) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result)
      }
      return resolve(result)
    })
  })
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS 설정
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Multer 미들웨어 실행
    await runMiddleware(req, res, upload.single('file'))

    const file = (req as any).file

    if (!file) {
      return res.status(400).json({ error: '이미지 파일이 필요합니다.' })
    }

    // 파일을 base64로 인코딩
    const base64Image = file.buffer.toString('base64')

    // 파일 확장자 추출
    const fileExtension = file.originalname.split('.').pop()?.toLowerCase() || 'jpg'

    // JSON body 생성
    const requestBody = {
      images: [
        {
          format: fileExtension,
          name: file.originalname,
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
    return res.json(result)
  } catch (error) {
    console.error('Server Error (License):', error)
    return res.status(500).json({
      error: '서버 오류가 발생했습니다.',
      details: error instanceof Error ? error.message : String(error)
    })
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}
