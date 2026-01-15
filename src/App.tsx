import {useState} from 'react'
import './App.css'

interface OCRResult {
  images: {
    fields: {
      inferText: string
      inferConfidence: number
    }[]
  }[]
}

type DocumentType = 'passport' | 'license'

function App() {
  const [documentType, setDocumentType] = useState<DocumentType>('passport')
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [ocrResult, setOcrResult] = useState<OCRResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setSelectedImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAnalyzeImage = async () => {
    if (!imageFile) {
      alert('이미지를 먼저 선택해주세요.')
      return
    }

    setLoading(true)
    setError(null)
    setOcrResult(null)

    try {
      const formData = new FormData()

      const requestJson = {
        version: 'V2',
        requestId: crypto.randomUUID(),
        timestamp: Date.now(),
        images: [
          {
            format: imageFile.type.split('/')[1],
            name: imageFile.name,
          },
        ],
      }

      formData.append('message', JSON.stringify(requestJson))
      formData.append('file', imageFile)

      // 문서 타입에 따라 다른 API 엔드포인트 사용
      const apiEndpoint = documentType === 'passport'
        ? 'http://localhost:3001/api/ocr-passport'
        : 'http://localhost:3001/api/ocr-license'

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`API 요청 실패: ${response.status} ${response.statusText}`)
      }

      const result = await response.json()
      setOcrResult(result)
      console.log('OCR 결과:', result)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.'
      setError(errorMessage)
      console.error('OCR 오류:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
          대만 문서 OCR 텍스트 추출
        </h1>

        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* 문서 타입 선택 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              문서 타입 선택
            </label>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setDocumentType('passport')
                  setSelectedImage(null)
                  setImageFile(null)
                  setOcrResult(null)
                  setError(null)
                }}
                className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all ${
                  documentType === 'passport'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                여권
              </button>
              <button
                onClick={() => {
                  setDocumentType('license')
                  setSelectedImage(null)
                  setImageFile(null)
                  setOcrResult(null)
                  setError(null)
                }}
                className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all ${
                  documentType === 'license'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                운전면허증
              </button>
            </div>
          </div>

          {/* 이미지 업로드 영역 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              이미지 선택
            </label>
            <div className="flex items-center gap-4">
              <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
                이미지 선택
              </label>
              {imageFile && (
                <span className="text-sm text-gray-600">{imageFile.name}</span>
              )}
            </div>
          </div>

          {/* 이미지 미리보기 */}
          {selectedImage && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">이미지 미리보기</h2>
              <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
                <img
                  src={selectedImage}
                  alt="Selected preview"
                  className="max-w-full h-auto mx-auto max-h-96 object-contain"
                />
              </div>
            </div>
          )}

          {/* 분석 버튼 */}
          <div className="flex justify-center">
            <button
              onClick={handleAnalyzeImage}
              disabled={!selectedImage || loading}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-3 px-8 rounded-lg transition-colors text-lg"
            >
              {loading
                ? '분석 중...'
                : `${documentType === 'passport' ? '여권' : '운전면허증'} 텍스트 추출하기`}
            </button>
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 font-medium">오류 발생</p>
              <p className="text-red-600 text-sm mt-1">{error}</p>
            </div>
          )}

          {/* OCR 결과 영역 */}
          {ocrResult && (
            <div className="mt-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">추출된 텍스트</h2>
              <div className="space-y-4">
                {ocrResult.images.map((image, imageIndex) => (
                  <div key={imageIndex}>
                    {image.fields.map((field, fieldIndex) => (
                      <div
                        key={fieldIndex}
                        className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-sm font-medium text-gray-500">
                            필드 #{fieldIndex + 1}
                          </span>
                          <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                            신뢰도: {(field.inferConfidence * 100).toFixed(1)}%
                          </span>
                        </div>
                        <p className="text-lg text-gray-900">{field.inferText}</p>
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {/* 전체 텍스트 통합 보기 */}
              <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">전체 텍스트</h3>
                <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">
                  {ocrResult.images
                    .flatMap((image) => image.fields.map((field) => field.inferText))
                    .join('\n')}
                </p>
              </div>

              {/* 복사 버튼 */}
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => {
                    const text = ocrResult.images
                      .flatMap((image) => image.fields.map((field) => field.inferText))
                      .join('\n')
                    navigator.clipboard.writeText(text)
                    alert('텍스트가 클립보드에 복사되었습니다.')
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                >
                  텍스트 복사하기
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
