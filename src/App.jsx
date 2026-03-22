import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import TestList from './pages/tests/TestList'
import TestPage from './pages/tests/TestPage'
import ResultPage from './pages/tests/ResultPage'
import './index.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tests" element={<TestList />} />
        <Route path="/test/:testId" element={<TestPage />} />
        <Route path="/result/:attemptId" element={<ResultPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App