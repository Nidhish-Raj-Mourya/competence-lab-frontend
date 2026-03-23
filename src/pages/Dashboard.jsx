import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 24px' }}>

        {/* Welcome Card */}
        <div style={{
          background: 'linear-gradient(135deg, #185FA5, #1e40af)',
          borderRadius: '16px', padding: '32px',
          marginBottom: '32px', color: 'white'
        }}>
          <div style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px' }}>
            Welcome back, {user?.name?.split(' ')[0]}! 👋
          </div>
          <div style={{ fontSize: '15px', opacity: 0.85 }}>
            {user?.college || 'Competence Lab'} · {user?.email}
          </div>
        </div>

        {/* Stats */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '16px', marginBottom: '32px'
        }}>
          {[
            { label: 'Tests Attempted', value: '0', icon: '📝' },
            { label: 'Best Score', value: '—', icon: '🏆' },
            { label: 'Avg Score', value: '—', icon: '📊' },
          ].map(stat => (
            <div key={stat.label} style={{
              background: 'white', borderRadius: '12px',
              padding: '24px', border: '1px solid #e2e8f0',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>{stat.icon}</div>
              <div style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a' }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '16px', marginBottom: '32px'
        }}>
          <div
            onClick={() => navigate('/tests')}
            style={{
              background: 'white', borderRadius: '12px',
              padding: '24px', border: '1px solid #e2e8f0',
              cursor: 'pointer'
            }}>
            <div style={{ fontSize: '24px', marginBottom: '12px' }}>🏆</div>
            <div style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>
              Mock Tests
            </div>
            <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
              TCS, Infosys, Wipro style tests do
            </div>
          </div>

          <div
            onClick={() => navigate('/tests')}
            style={{
              background: 'white', borderRadius: '12px',
              padding: '24px', border: '1px solid #e2e8f0',
              cursor: 'pointer'
            }}>
            <div style={{ fontSize: '24px', marginBottom: '12px' }}>💻</div>
            <div style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>
              Practice Problems
            </div>
            <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
              DSA problems practice karo
            </div>
          </div>
        </div>

        {/* Logout */}
        <button onClick={handleLogout} style={{
          padding: '10px 24px', border: '1px solid #e2e8f0',
          borderRadius: '8px', background: 'white',
          color: '#dc2626', fontSize: '14px',
          fontWeight: '600', cursor: 'pointer'
        }}>
          Logout
        </button>

      </div>
    </div>
  )
}

export default Dashboard