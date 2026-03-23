import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerUser } from '../services/api'
import { useAuth } from '../context/AuthContext'

function Register() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    first_name: '', last_name: '',
    email: '', college: '',
    password: '', password2: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData(p => ({ ...p, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (formData.password !== formData.password2)
      return setError('Passwords match nahi kar rahe!')
    setLoading(true)
    try {
      const res = await registerUser(formData)
      login(res.data.user, res.data.tokens)
      navigate('/dashboard')
    } catch (err) {
      const data = err.response?.data
      if (data?.email) setError(data.email[0])
      else if (data?.password) setError(data.password[0])
      else setError('Kuch galat hua — dobara try karo')
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
        padding: '40px', width: '100%', maxWidth: '480px',
        border: '1px solid #e2e8f0'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a' }}>
            Competence Lab
          </div>
          <div style={{ fontSize: '15px', color: '#64748b', marginTop: '4px' }}>
            Account banao — bilkul free!
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
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151' }}>
                First Name
              </label>
              <input
                name="first_name" value={formData.first_name}
                onChange={handleChange} required
                placeholder="Nidhish"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151' }}>
                Last Name
              </label>
              <input
                name="last_name" value={formData.last_name}
                onChange={handleChange}
                placeholder="Mourya"
                style={inputStyle}
              />
            </div>
          </div>

          {[
            { name: 'email', label: 'Email', type: 'email', placeholder: 'nidhish@example.com' },
            { name: 'college', label: 'College/Institute', type: 'text', placeholder: 'SAGE University' },
            { name: 'password', label: 'Password', type: 'password', placeholder: '••••••••' },
            { name: 'password2', label: 'Confirm Password', type: 'password', placeholder: '••••••••' },
          ].map(field => (
            <div key={field.name} style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151' }}>
                {field.label}
              </label>
              <input
                name={field.name} type={field.type}
                value={formData[field.name]}
                onChange={handleChange}
                placeholder={field.placeholder}
                required={field.name !== 'college'}
                style={inputStyle}
              />
            </div>
          ))}

          <button type="submit" disabled={loading} style={btnStyle}>
            {loading ? 'Creating account...' : 'Create Account →'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#64748b' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#185FA5', fontWeight: '600' }}>
            Login karo
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

export default Register