import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Home from './pages/Home'
import TestList from './pages/tests/TestList'
import TestPage from './pages/tests/TestPage'
import ResultPage from './pages/tests/ResultPage'
import Login from './pages/Login'
import Register from './pages/Register'
import './index.css'
import Dashboard from './pages/Dashboard'


function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div style={{ textAlign: 'center', padding: '80px' }}>Loading...</div>
  if (!user) return <Navigate to="/login" />
  return children
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/tests" element={<TestList />} />
        <Route path="/test/:testId" element={<TestPage />} />
        <Route path="/result/:attemptId" element={<ResultPage />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App