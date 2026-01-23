import {BrowserRouter, Routes, Route, Link, Navigate} from 'react-router-dom'
import './App.css'
import NaverClova from './pages/NaverClova'
import GoogleVision from './pages/GoogleVision'

function Home() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
          대만 문서 OCR 텍스트 추출
        </h1>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <p className="text-lg text-gray-700 mb-8 text-center">
            OCR 서비스를 선택하세요
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              to="/naver-clova"
              className="block p-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              <h2 className="text-2xl font-bold text-white mb-3">Naver Clova OCR</h2>
              <p className="text-blue-100">
                네이버 클로바 OCR로 문서를 분석합니다
              </p>
            </Link>

            <Link
              to="/google-vision"
              className="block p-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              <h2 className="text-2xl font-bold text-white mb-3">Google Vision API</h2>
              <p className="text-green-100">
                구글 비전 API로 문서를 분석합니다
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/naver-clova" element={<NaverClova />} />
        <Route path="/google-vision" element={<GoogleVision />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
