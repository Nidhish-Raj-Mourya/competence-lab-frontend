import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loginUser } from '../services/api'
import { useAuth } from '../context/AuthContext'

function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData(p => ({ ...p, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await loginUser(formData)
      login(res.data.user, res.data.tokens)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed')
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#f8fafc',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px'
    }}>
      <div style={{
        background: 'white', borderRadius: '16px',
        padding: '40px', width: '100%', maxWidth: '420px',
        border: '1px solid #e2e8f0'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a' }}>
            Welcome Back!
          </div>
          <div style={{ fontSize: '15px', color: '#64748b', marginTop: '4px' }}>
            Competence Lab mein login karo
          </div>
        </div>

        {error && (
          <div style={{
            background: '#fef2f2', border: '1px solid #fecaca',
            borderRadius: '8px', padding: '12px', marginBottom: '16px',
            fontSize: '14px', color: '#dc2626'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {[
            { name: 'email', label: 'Email', type: 'email', placeholder: 'nidhish@example.com' },
            { name: 'password', label: 'Password', type: 'password', placeholder: '••••••••' },
          ].map(field => (
            <div key={field.name} style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151' }}>
                {field.label}
              </label>
              <input
                name={field.name} type={field.type}
                value={formData[field.name]}
                onChange={handleChange}
                placeholder={field.placeholder}
                required
                style={inputStyle}
              />
            </div>
          ))}

          <button type="submit" disabled={loading} style={btnStyle}>
            {loading ? 'Logging in...' : 'Login →'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#64748b' }}>
          Account nahi hai?{' '}
          <Link to="/register" style={{ color: '#185FA5', fontWeight: '600' }}>
            Register karo
          </Link>
        </div>
      </div>
    </div>
  )
}

const inputStyle = {
  width: '100%', padding: '10px 14px',
  border: '1px solid #e2e8f0', borderRadius: '8px',
  fontSize: '14px', marginTop: '4px',
  outline: 'none', boxSizing: 'border-box'
}

const btnStyle = {
  width: '100%', padding: '13px',
  background: '#185FA5', color: 'white',
  border: 'none', borderRadius: '8px',
  fontSize: '15px', fontWeight: '700',
  cursor: 'pointer', marginTop: '8px'
}

export default Login