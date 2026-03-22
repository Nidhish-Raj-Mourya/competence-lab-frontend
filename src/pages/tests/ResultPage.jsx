import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getResult } from '../../services/api'

const styles = {
  page: { background: '#f8fafc', minHeight: '100vh', padding: '40px 24px' },
  container: { maxWidth: '700px', margin: '0 auto' },
  card: {
    background: 'white', border: '1px solid #e2e8f0',
    borderRadius: '16px', padding: '40px', marginBottom: '20px',
    textAlign: 'center'
  },
  passedBadge: {
    display: 'inline-block', background: '#EAF3DE', color: '#3B6D11',
    fontSize: '14px', fontWeight: '700', padding: '6px 20px',
    borderRadius: '20px', marginBottom: '20px'
  },
  failedBadge: {
    display: 'inline-block', background: '#fef2f2', color: '#dc2626',
    fontSize: '14px', fontWeight: '700', padding: '6px 20px',
    borderRadius: '20px', marginBottom: '20px'
  },
  score: { fontSize: '64px', fontWeight: '800', color: '#0f172a', lineHeight: 1 },
  scoreLabel: { fontSize: '16px', color: '#94a3b8', marginTop: '8px', marginBottom: '24px' },
  percentage: { fontSize: '28px', fontWeight: '700', color: '#185FA5' },
  statsGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px', marginTop: '24px'
  },
  stat: {
    background: '#f8fafc', borderRadius: '12px',
    padding: '16px', textAlign: 'center'
  },
  statNum: { fontSize: '24px', fontWeight: '700', color: '#0f172a' },
  statLabel: { fontSize: '12px', color: '#94a3b8', marginTop: '4px' },
  infoCard: {
    background: 'white', border: '1px solid #e2e8f0',
    borderRadius: '16px', padding: '24px', marginBottom: '20px'
  },
  infoTitle: { fontSize: '16px', fontWeight: '700', marginBottom: '16px', color: '#0f172a' },
  infoRow: {
    display: 'flex', justifyContent: 'space-between',
    padding: '10px 0', borderBottom: '1px solid #f1f5f9',
    fontSize: '14px'
  },
  infoLabel: { color: '#64748b' },
  infoValue: { fontWeight: '600', color: '#0f172a' },
  btns: { display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '24px' },
  btnPrimary: {
    padding: '12px 28px', background: '#185FA5', color: 'white',
    border: 'none', borderRadius: '8px', fontSize: '15px',
    fontWeight: '600', cursor: 'pointer'
  },
  btnSecondary: {
    padding: '12px 28px', background: 'white', color: '#185FA5',
    border: '1.5px solid #185FA5', borderRadius: '8px', fontSize: '15px',
    fontWeight: '600', cursor: 'pointer'
  },
  loading: { textAlign: 'center', padding: '80px', color: '#64748b' }
}

function ResultPage() {
  const { attemptId } = useParams()
  const navigate = useNavigate()
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchResult()
  }, [attemptId])

  const fetchResult = async () => {
    try {
      const res = await getResult(attemptId)
      setResult(res.data)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${m}m ${s}s`
  }

  if (loading) return <div style={styles.loading}>Loading result...</div>
  if (!result) return <div style={styles.loading}>Result not found!</div>

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* Main Score Card */}
        <div style={styles.card}>
          <div style={result.passed ? styles.passedBadge : styles.failedBadge}>
            {result.passed ? '✅ PASSED!' : '❌ FAILED'}
          </div>

          <div style={styles.score}>
            {result.score}
            <span style={{ fontSize: '32px', color: '#94a3b8' }}>/{result.total_marks}</span>
          </div>
          <div style={styles.scoreLabel}>Total Score</div>
          <div style={styles.percentage}>{result.percentage}%</div>

          <div style={styles.statsGrid}>
            <div style={styles.stat}>
              <div style={{ ...styles.statNum, color: '#16a34a' }}>
                {result.correct_answers}
              </div>
              <div style={styles.statLabel}>Correct</div>
            </div>
            <div style={styles.stat}>
              <div style={{ ...styles.statNum, color: '#dc2626' }}>
                {result.wrong_answers}
              </div>
              <div style={styles.statLabel}>Wrong</div>
            </div>
            <div style={styles.stat}>
              <div style={{ ...styles.statNum, color: '#f59e0b' }}>
                {result.skipped}
              </div>
              <div style={styles.statLabel}>Skipped</div>
            </div>
          </div>
        </div>

        {/* Details Card */}
        <div style={styles.infoCard}>
          <div style={styles.infoTitle}>Test Details</div>
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>Student</span>
            <span style={styles.infoValue}>{result.student_name}</span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>Test</span>
            <span style={styles.infoValue}>{result.test_title}</span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>Time Taken</span>
            <span style={styles.infoValue}>{formatTime(result.time_taken_seconds)}</span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>Total Questions</span>
            <span style={styles.infoValue}>{result.correct_answers + result.wrong_answers + result.skipped}</span>
          </div>
          <div style={{ ...styles.infoRow, border: 'none' }}>
            <span style={styles.infoLabel}>Status</span>
            <span style={{
              ...styles.infoValue,
              color: result.passed ? '#16a34a' : '#dc2626'
            }}>
              {result.passed ? 'Passed ✅' : 'Failed ❌'}
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div style={styles.btns}>
          <button
            style={styles.btnSecondary}
            onClick={() => navigate('/tests')}
          >
            ← All Tests
          </button>
          <button
            style={styles.btnPrimary}
            onClick={() => navigate(`/test/${result.test_title}`)}
          >
            Attempt Again
          </button>
        </div>

      </div>
    </div>
  )
}

export default ResultPage