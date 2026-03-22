import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import { getTests } from '../../services/api'

const styles = {
  page: { background: '#f8fafc', minHeight: '100vh' },
  container: { maxWidth: '1100px', margin: '0 auto', padding: '40px 24px' },
  header: { marginBottom: '32px' },
  title: { fontSize: '28px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' },
  subtitle: { fontSize: '15px', color: '#64748b' },
  tabs: { display: 'flex', gap: '8px', marginBottom: '32px' },
  tab: {
    padding: '8px 20px', borderRadius: '20px', border: '1px solid #e2e8f0',
    background: 'white', fontSize: '14px', cursor: 'pointer', color: '#64748b',
    fontWeight: '500',
  },
  activeTab: {
    padding: '8px 20px', borderRadius: '20px', border: '1px solid #185FA5',
    background: '#185FA5', fontSize: '14px', cursor: 'pointer', color: 'white',
    fontWeight: '500',
  },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' },
  card: {
    background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px',
    padding: '24px', cursor: 'pointer',
    transition: 'border-color 0.2s',
  },
  badge: {
    display: 'inline-block', fontSize: '11px', padding: '3px 10px',
    borderRadius: '20px', fontWeight: '600', marginBottom: '12px',
  },
  mockBadge: { background: '#E6F1FB', color: '#185FA5' },
  aptBadge: { background: '#EAF3DE', color: '#3B6D11' },
  codeBadge: { background: '#FAEEDA', color: '#854F0B' },
  cardTitle: { fontSize: '16px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' },
  cardDesc: { fontSize: '13px', color: '#64748b', marginBottom: '16px' },
  cardMeta: { display: 'flex', gap: '16px' },
  metaItem: { fontSize: '12px', color: '#94a3b8' },
  startBtn: {
    width: '100%', marginTop: '16px', padding: '10px',
    background: '#185FA5', color: 'white', border: 'none',
    borderRadius: '8px', fontSize: '14px', fontWeight: '600',
    cursor: 'pointer',
  },
  loading: { textAlign: 'center', padding: '60px', color: '#64748b' },
}

const TABS = [
  { label: 'All Tests', value: '' },
  { label: 'Company Mocks', value: 'mock' },
  { label: 'Aptitude', value: 'aptitude' },
  { label: 'Coding', value: 'coding' },
]

function TestList() {
  const [tests, setTests] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    fetchTests()
  }, [activeTab])

  const fetchTests = async () => {
    setLoading(true)
    try {
      const res = await getTests(activeTab)
      setTests(res.data)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  const getBadgeStyle = (type) => {
    if (type === 'mock') return { ...styles.badge, ...styles.mockBadge }
    if (type === 'aptitude') return { ...styles.badge, ...styles.aptBadge }
    return { ...styles.badge, ...styles.codeBadge }
  }

  const getBadgeLabel = (type) => {
    if (type === 'mock') return 'Company Mock'
    if (type === 'aptitude') return 'Aptitude'
    return 'Coding'
  }

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Mock Tests</h1>
          <p style={styles.subtitle}>
            Company wise mocks, aptitude aur coding tests — sab ek jagah
          </p>
        </div>

        {/* Tabs */}
        <div style={styles.tabs}>
          {TABS.map(tab => (
            <button
              key={tab.value}
              style={activeTab === tab.value ? styles.activeTab : styles.tab}
              onClick={() => setActiveTab(tab.value)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tests Grid */}
        {loading ? (
          <div style={styles.loading}>Loading tests...</div>
        ) : (
          <div style={styles.grid}>
            {tests.map(test => (
              <div key={test.id} style={styles.card}>
                <span style={getBadgeStyle(test.test_type)}>
                  {test.company_name || getBadgeLabel(test.test_type)}
                </span>
                <div style={styles.cardTitle}>{test.title}</div>
                <div style={styles.cardDesc}>{test.description}</div>
                <div style={styles.cardMeta}>
                  <span style={styles.metaItem}>⏱ {test.duration_minutes} min</span>
                  <span style={styles.metaItem}>📝 {test.question_count} questions</span>
                  <span style={styles.metaItem}>🎯 Pass: {test.pass_marks}%</span>
                </div>
                <button
                  style={styles.startBtn}
                  onClick={() => navigate(`/test/${test.id}`)}
                >
                  Start Test →
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default TestList