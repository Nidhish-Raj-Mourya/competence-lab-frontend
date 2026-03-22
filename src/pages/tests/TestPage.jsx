import { useEffect, useState, useRef, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getTestDetail, submitTest } from '../../services/api'

const getQColor = (qId, currentQId, answers, marked, visited) => {
  if (qId === currentQId)
    return { bg: '#1e40af', color: '#fff', border: '2px solid #1e3a8a' }
  if (answers[qId] && marked[qId])
    return { bg: '#7c3aed', color: '#fff', border: 'none' }
  if (answers[qId])
    return { bg: '#16a34a', color: '#fff', border: 'none' }
  if (marked[qId])
    return { bg: '#f59e0b', color: '#fff', border: 'none' }
  if (visited[qId])
    return { bg: '#dc2626', color: '#fff', border: 'none' }
  return { bg: '#e2e8f0', color: '#374151', border: '1px solid #cbd5e1' }
}

const fmt = (s) => {
  if (!s && s !== 0) return '00:00'
  const m = Math.floor(s / 60).toString().padStart(2, '0')
  const sec = (s % 60).toString().padStart(2, '0')
  return `${m}:${sec}`
}

function TestPage() {
  const { testId } = useParams()
  const navigate = useNavigate()
  
  // ── Refs ──
  const startTimeRef = useRef(Date.now())
  const studentInfoRef = useRef(null)
  const testRef = useRef(null)
  const answersRef = useRef({})
  const submittingRef = useRef(false)


  // ── State ──
  const [test, setTest] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState({})
  const [marked, setMarked] = useState({})
  const [visited, setVisited] = useState({})
  const [timeLeft, setTimeLeft] = useState(0)
  const [sectionTimeLeft, setSectionTimeLeft] = useState({})
  const [activeSectionTab, setActiveSectionTab] = useState(0)
  const [showConfirm, setShowConfirm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  // const [showForm, setShowForm] = useState(true)
  const [showForm, setShowForm] = useState(() => {
  return !sessionStorage.getItem('studentInfo')
})
  // const [studentInfo, setStudentInfo] = useState(null)
  const [studentInfo, setStudentInfo] = useState(() => {
  const saved = sessionStorage.getItem('studentInfo')
  if (saved) {
    const parsed = JSON.parse(saved)
    studentInfoRef.current = parsed
    return parsed
  }
  return null
  })
  const [formData, setFormData] = useState(() => {
  const saved = sessionStorage.getItem('studentInfo')
  return saved ? JSON.parse(saved) : { name: '', email: '', roll: '', institute: '' }
})

  // ── Derived values — SABSE PEHLE ──
  const questions = test?.questions || []
  const hasSections = test?.sections?.length > 0
  const currentQuestion = questions[currentQ]
  const getCurrentSection = () => {
    if (!hasSections || !currentQuestion) return null
    return test.sections.find(s =>
      s.questions?.some(q => q.id === currentQuestion.id)
    )
  }
  const currentSection = getCurrentSection()
  const answeredCount = Object.keys(answers).length
  const markedCount = Object.keys(marked).filter(k => marked[k]).length
  const visitedCount = Object.keys(visited).length
  const notAnswered = visitedCount - answeredCount
  const notVisited = questions.length - visitedCount

  // ── Keep refs in sync ──
  useEffect(() => { answersRef.current = answers }, [answers])
  useEffect(() => { studentInfoRef.current = studentInfo }, [studentInfo])
  useEffect(() => { testRef.current = test }, [test])

  // ── Fetch test ──
  useEffect(() => { fetchTest() }, [testId])

  // ── Setup timers when test starts ──
  useEffect(() => {
    if (!test || showForm) return
    setTimeLeft(test.duration_minutes * 60)
    if (test.sections?.length > 0) {
      const t = {}
      test.sections.forEach(s => { t[s.id] = s.duration_minutes * 60 })
      setSectionTimeLeft(t)
    }
    if (test.questions?.length > 0) {
      setVisited({ [test.questions[0].id]: true })
    }
  }, [test, showForm])

  // ── Overall timer ──
  useEffect(() => {
    if (showForm) return
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          autoSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [showForm])

  // ── Section timer ──
  useEffect(() => {
    if (showForm) return
    const timer = setInterval(() => {
      setSectionTimeLeft(prev => {
        const updated = { ...prev }
        Object.keys(updated).forEach(id => {
          if (updated[id] > 0) updated[id] -= 1
        })
        return updated
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [showForm])

  // ── Functions ──
  const fetchTest = async () => {
    try {
      const res = await getTestDetail(testId)
      setTest(res.data)
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  const autoSubmit = async () => {
    if (submittingRef.current) return
    submittingRef.current = true
    const info = studentInfoRef.current
    const t = testRef.current
    const ans = answersRef.current
    if (!info || !t) return
    const timeTaken = Math.floor((Date.now() - startTimeRef.current) / 1000)
    const payload = t.questions.map(q => ({
      question: q.id,
      selected_option: ans[q.id] || ''
    }))
    try {
      const res = await submitTest(testId, {
        student_name: info.name,
        student_email: info.email,
        student_roll: info.roll,
        institute_name: info.institute,
        answers: payload,
        time_taken_seconds: timeTaken
      })
      navigate(`/result/${res.data.attempt_id}`)
    } catch (e) {
      console.error(e)
      submittingRef.current = false
    }
  }

  const handleSubmit = async () => {
    if (submittingRef.current) return
    setShowConfirm(false)
    setSubmitting(true)
    submittingRef.current = true
    const timeTaken = Math.floor((Date.now() - startTimeRef.current) / 1000)
    const payload = questions.map(q => ({
      question: q.id,
      selected_option: answers[q.id] || ''
    }))
    try {
      const res = await submitTest(testId, {
        student_name: studentInfo.name,
        student_email: studentInfo.email,
        student_roll: studentInfo.roll,
        institute_name: studentInfo.institute,
        answers: payload,
        time_taken_seconds: timeTaken
      })
      navigate(`/result/${res.data.attempt_id}`)
    } catch (e) {
      console.error(e)
      setSubmitting(false)
      submittingRef.current = false
    }
  }

  const goToQ = useCallback((index) => {
    if (index < 0 || index >= questions.length) return
    setVisited(prev => {
      const updated = { ...prev }
      if (questions[currentQ]) updated[questions[currentQ].id] = true
      if (questions[index]) updated[questions[index].id] = true
      return updated
    })
    setCurrentQ(index)
  }, [currentQ, questions])

  const handleAnswer = (qId, opt) => {
    setAnswers(prev => ({ ...prev, [qId]: opt }))
    setVisited(prev => ({ ...prev, [qId]: true }))
  }

  const handleClear = (qId) => {
    if (!qId) return
    setAnswers(prev => {
      const updated = { ...prev }
      delete updated[qId]
      return updated
    })
  }

  const handleMark = (qId) => {
    if (!qId) return
    setMarked(prev => ({ ...prev, [qId]: !prev[qId] }))
  }

  const handleSaveNext = () => {
    if (currentQ >= questions.length - 1) return
    goToQ(currentQ + 1)
  }

  const handleMarkNext = () => {
    if (currentQuestion) {
      setMarked(prev => ({ ...prev, [currentQuestion.id]: !prev[currentQuestion.id] }))
    }
    handleSaveNext()
  }

  const handlePrevious = () => {
    if (currentQ <= 0) return
    goToQ(currentQ - 1)
  }

const handleStartTest = () => {
  if (!formData.name.trim()) return alert('Name zaroori hai!')
  if (!formData.email.trim()) return alert('Email zaroori hai!')
  const info = { ...formData }
  setStudentInfo(info)
  studentInfoRef.current = info
  startTimeRef.current = Date.now()
  sessionStorage.setItem('studentInfo', JSON.stringify(info))
  setShowForm(false)
}

  // ── Render ──
  if (loading) return (
    <div style={{ textAlign: 'center', padding: '80px', color: '#64748b' }}>
      Loading test...
    </div>
  )
  if (!test) return (
    <div style={{ textAlign: 'center', padding: '80px', color: '#64748b' }}>
      Test not found!
    </div>
  )

  return (
    <div style={{
      background: '#f1f5f9', minHeight: '100vh',
      fontFamily: 'Segoe UI, sans-serif',
      display: 'flex', flexDirection: 'column'
    }}>

      {/* ── Student Form ── */}
      {showForm && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
          display: 'flex', alignItems: 'center',
          justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{
            background: 'white', borderRadius: '16px', padding: '36px',
            maxWidth: '460px', width: '90%'
          }}>
            <div style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a', marginBottom: '4px' }}>
              {test.title}
            </div>
            <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>
              {test.company_name && `${test.company_name} · `}
              {test.duration_minutes} min · {questions.length} questions · Pass: {test.pass_marks}%
            </div>

            {hasSections && (
              <div style={{
                background: '#f8fafc', borderRadius: '10px',
                padding: '12px 16px', marginBottom: '20px'
              }}>
                {test.sections.map((s, i) => (
                  <div key={s.id} style={{
                    display: 'flex', justifyContent: 'space-between',
                    fontSize: '13px', padding: '5px 0',
                    borderBottom: i < test.sections.length - 1 ? '1px solid #e2e8f0' : 'none'
                  }}>
                    <span style={{ fontWeight: '600', color: '#374151' }}>{s.name}</span>
                    <span style={{ color: '#64748b' }}>
                      {s.questions?.length || 0}Q · {s.duration_minutes}min
                    </span>
                  </div>
                ))}
              </div>
            )}

            {[
              { ph: 'Full Name *', key: 'name', type: 'text' },
              { ph: 'Email Address *', key: 'email', type: 'email' },
              { ph: 'Roll Number (optional)', key: 'roll', type: 'text' },
              { ph: 'College/Institute (optional)', key: 'institute', type: 'text' },
            ].map(field => (
              <input key={field.key}
                placeholder={field.ph}
                type={field.type}
                value={formData[field.key]}
                onChange={e => setFormData(p => ({ ...p, [field.key]: e.target.value }))}
                style={{
                  width: '100%', padding: '12px 16px',
                  border: '1px solid #e2e8f0', borderRadius: '8px',
                  fontSize: '14px', marginBottom: '10px',
                  outline: 'none', boxSizing: 'border-box'
                }}
              />
            ))}

            <button onClick={handleStartTest} style={{
              width: '100%', padding: '14px', background: '#185FA5',
              color: 'white', border: 'none', borderRadius: '8px',
              fontSize: '15px', fontWeight: '700', cursor: 'pointer'
            }}>
              Start Test →
            </button>
          </div>
        </div>
      )}

      {/* ── TOP BAR ── */}
      <div style={{
        background: '#1e293b', padding: '0 24px',
        display: 'flex', alignItems: 'stretch',
        minHeight: '56px', flexShrink: 0, zIndex: 100
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', color: 'white',
          fontSize: '15px', fontWeight: '700',
          paddingRight: '24px', borderRight: '1px solid #334155'
        }}>
          {test.title}
          {test.company_name && (
            <span style={{
              marginLeft: '8px', fontSize: '11px', background: '#185FA5',
              color: 'white', padding: '2px 8px', borderRadius: '4px'
            }}>
              {test.company_name}
            </span>
          )}
        </div>

        <div style={{
          flex: 1, display: 'flex',
          alignItems: 'center', justifyContent: 'center', gap: '12px'
        }}>
          {currentSection && (
            <>
              <span style={{ color: '#94a3b8', fontSize: '13px' }}>Section:</span>
              <span style={{ color: '#f1f5f9', fontSize: '14px', fontWeight: '600' }}>
                {currentSection.name}
              </span>
              {sectionTimeLeft[currentSection.id] !== undefined && (
                <div style={{
                  background: sectionTimeLeft[currentSection.id] <= 120
                    ? '#dc2626' : '#0f766e',
                  color: 'white', padding: '4px 12px',
                  borderRadius: '6px', fontSize: '14px', fontWeight: '700'
                }}>
                  ⏱ {fmt(sectionTimeLeft[currentSection.id])}
                </div>
              )}
            </>
          )}
        </div>

        <div style={{
          display: 'flex', alignItems: 'center',
          paddingLeft: '24px', borderLeft: '1px solid #334155', gap: '8px'
        }}>
          <span style={{ color: '#94a3b8', fontSize: '12px' }}>Overall</span>
          <div style={{
            background: timeLeft <= 300 ? '#dc2626' : '#185FA5',
            color: 'white', padding: '6px 14px', borderRadius: '6px',
            fontSize: '16px', fontWeight: '800', letterSpacing: '1px'
          }}>
            {fmt(timeLeft)}
          </div>
        </div>
      </div>

      {/* ── BODY ── */}
      <div style={{
        display: 'flex', flex: 1,
        overflow: 'hidden', paddingBottom: '60px'
      }}>

        {/* LEFT — Question */}
        <div style={{ flex: 1, overflow: 'auto', padding: '24px 32px' }}>

          <div style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', marginBottom: '16px'
          }}>
            <div style={{ fontSize: '13px', color: '#64748b' }}>
              Question{' '}
              <strong style={{ color: '#0f172a' }}>{currentQ + 1}</strong>
              {' '}of {questions.length}
              {currentSection && (
                <span style={{
                  marginLeft: '10px', background: '#E6F1FB',
                  color: '#185FA5', fontSize: '11px',
                  padding: '2px 8px', borderRadius: '4px', fontWeight: '600'
                }}>
                  {currentSection.name}
                </span>
              )}
            </div>
            <div style={{ display: 'flex', gap: '8px', fontSize: '12px' }}>
              {answers[currentQuestion?.id] && (
                <span style={{ color: '#16a34a', fontWeight: '700' }}>✓ Answered</span>
              )}
              {marked[currentQuestion?.id] && (
                <span style={{ color: '#f59e0b', fontWeight: '700' }}>🔖 Marked</span>
              )}
            </div>
          </div>

          {currentQuestion && (
            <div style={{
              background: 'white', border: '1px solid #e2e8f0',
              borderRadius: '12px', padding: '28px', marginBottom: '20px'
            }}>
              <div style={{
                fontSize: '16px', color: '#0f172a',
                lineHeight: '1.7', marginBottom: '24px'
              }}>
                {currentQuestion.text}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {['A', 'B', 'C', 'D'].map(opt => {
                  const isSelected = answers[currentQuestion.id] === opt
                  const optText = currentQuestion[`option_${opt.toLowerCase()}`]
                  if (!optText) return null
                  return (
                    <button key={opt}
                      onClick={() => handleAnswer(currentQuestion.id, opt)}
                      style={{
                        padding: '13px 18px', borderRadius: '10px',
                        cursor: 'pointer', fontSize: '14px',
                        textAlign: 'left', display: 'flex',
                        alignItems: 'center', gap: '12px',
                        background: isSelected ? '#EFF6FF' : 'white',
                        border: isSelected ? '2px solid #185FA5' : '1.5px solid #e2e8f0',
                        color: isSelected ? '#185FA5' : '#374151',
                        fontWeight: isSelected ? '600' : '400',
                        width: '100%'
                      }}
                    >
                      <span style={{
                        width: '28px', height: '28px', borderRadius: '50%',
                        flexShrink: 0, display: 'flex', alignItems: 'center',
                        justifyContent: 'center', fontSize: '13px', fontWeight: '700',
                        background: isSelected ? '#185FA5' : '#f1f5f9',
                        color: isSelected ? 'white' : '#374151'
                      }}>
                        {opt}
                      </span>
                      {optText}
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT — Side Panel */}
        <div style={{
          width: '280px', flexShrink: 0, background: 'white',
          borderLeft: '1px solid #e2e8f0', display: 'flex',
          flexDirection: 'column', overflow: 'hidden'
        }}>
          <div style={{
            padding: '12px 16px', background: '#1e293b',
            color: 'white', fontSize: '13px', fontWeight: '600', flexShrink: 0
          }}>
            👤 {studentInfo?.name || 'Student'}
          </div>

          {hasSections && (
            <div style={{
              display: 'flex', borderBottom: '1px solid #e2e8f0',
              flexShrink: 0, overflowX: 'auto'
            }}>
              {test.sections.map((s, i) => (
                <button key={s.id}
                  onClick={() => setActiveSectionTab(i)}
                  style={{
                    flex: 1, padding: '8px 6px', fontSize: '10px',
                    fontWeight: '700', border: 'none', cursor: 'pointer',
                    minWidth: '60px',
                    background: activeSectionTab === i ? '#185FA5' : '#f8fafc',
                    color: activeSectionTab === i ? 'white' : '#64748b',
                    borderBottom: activeSectionTab === i
                      ? '3px solid #0c4a84' : '3px solid transparent'
                  }}
                >
                  <div>{s.name.split(' ')[0]}</div>
                  <div style={{ fontSize: '9px', marginTop: '2px' }}>
                    {sectionTimeLeft[s.id] !== undefined
                      ? fmt(sectionTimeLeft[s.id])
                      : `${s.duration_minutes}m`}
                  </div>
                </button>
              ))}
            </div>
          )}

          <div style={{
            padding: '10px 14px', borderBottom: '1px solid #f1f5f9', flexShrink: 0
          }}>
            <div style={{ fontSize: '10px', fontWeight: '700', color: '#94a3b8', marginBottom: '6px' }}>
              LEGEND
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
              {[
                { color: '#16a34a', label: 'Answered' },
                { color: '#dc2626', label: 'Not Answered' },
                { color: '#f59e0b', label: 'Marked' },
                { color: '#7c3aed', label: 'Ans + Marked' },
                { color: '#e2e8f0', label: 'Not Visited', border: '1px solid #cbd5e1' },
                { color: '#1e40af', label: 'Current' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <div style={{
                    width: '14px', height: '14px', borderRadius: '3px',
                    background: item.color, flexShrink: 0,
                    border: item.border || 'none'
                  }} />
                  <span style={{ fontSize: '10px', color: '#64748b' }}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{
            padding: '10px 14px', borderBottom: '1px solid #f1f5f9',
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '5px', flexShrink: 0
          }}>
            {[
              { num: answeredCount, label: 'Answered', color: '#16a34a', bg: '#f0fdf4' },
              { num: notAnswered, label: 'Not Ans', color: '#dc2626', bg: '#fef2f2' },
              { num: markedCount, label: 'Marked', color: '#f59e0b', bg: '#fffbeb' },
              { num: notVisited, label: 'Not Visit', color: '#64748b', bg: '#f8fafc' },
              { num: questions.length, label: 'Total', color: '#185FA5', bg: '#eff6ff' },
            ].map(item => (
              <div key={item.label} style={{
                background: item.bg, borderRadius: '6px',
                padding: '6px 4px', textAlign: 'center'
              }}>
                <div style={{ fontSize: '16px', fontWeight: '800', color: item.color }}>
                  {item.num}
                </div>
                <div style={{ fontSize: '9px', color: '#94a3b8', marginTop: '1px' }}>
                  {item.label}
                </div>
              </div>
            ))}
          </div>

          {/* Question Map */}
          <div style={{ padding: '10px 14px', flex: 1, overflow: 'auto' }}>
            <div style={{ 
              fontSize: '10px', fontWeight: '700',
              color: '#94a3b8', marginBottom: '8px' 
            }}>
              QUESTION MAP
            </div>

            {hasSections ? (
              // Sab sections ek saath dikhao — scroll karke dekh sako
              test.sections.map((section, si) => {
                const sectionColors = [
                  { bg: '#EFF6FF', text: '#185FA5' },
                  { bg: '#F0FDF4', text: '#16a34a' },
                  { bg: '#FFF7ED', text: '#ea580c' },
                  { bg: '#FAF5FF', text: '#7c3aed' },
                  { bg: '#FFF1F2', text: '#e11d48' },
                ]
                const sc = sectionColors[si % sectionColors.length]
                return (
                  <div key={section.id} style={{ marginBottom: '16px' }}>
                    {/* Section Label */}
                    <div style={{
                      background: sc.bg, color: sc.text,
                      fontSize: '10px', fontWeight: '700',
                      padding: '4px 8px', borderRadius: '6px',
                      marginBottom: '6px', display: 'inline-block'
                    }}>
                      {section.name}
                    </div>
                    {/* Questions Grid — 5 per row */}
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(5, 1fr)', 
                      gap: '4px' 
                    }}>
                      {section.questions?.map(q => {
                        const gi = questions.findIndex(gq => gq.id === q.id)
                        if (gi === -1) return null
                        const c = getQColor(
                          q.id, currentQuestion?.id,
                          answers, marked, visited
                        )
                        return (
                          <button key={q.id} onClick={() => goToQ(gi)}
                            title={`Q${gi + 1} - ${
                              answers[q.id] ? 'Answered' :
                              visited[q.id] ? 'Not Answered' :
                              'Not Visited'
                            }`}
                            style={{
                              width: '100%', aspectRatio: '1',
                              borderRadius: '6px', fontSize: '11px',
                              fontWeight: '700', cursor: 'pointer',
                              background: c.bg, color: c.color,
                              border: c.border, padding: '0'
                            }}
                          >
                            {gi + 1}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )
              })
            ) : (
              // No sections
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(5, 1fr)', 
                gap: '4px' 
              }}>
                {questions.map((q, i) => {
                  const c = getQColor(
                    q.id, currentQuestion?.id,
                    answers, marked, visited
                  )
                  return (
                    <button key={q.id} onClick={() => goToQ(i)}
                      style={{
                        width: '100%', aspectRatio: '1',
                        borderRadius: '6px', fontSize: '11px',
                        fontWeight: '700', cursor: 'pointer',
                        background: c.bg, color: c.color,
                        border: c.border, padding: '0'
                      }}
                    >
                      {i + 1}
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          <div style={{ padding: '12px 14px', borderTop: '1px solid #e2e8f0', flexShrink: 0 }}>
            <button onClick={() => setShowConfirm(true)} disabled={submitting}
              style={{
                width: '100%', padding: '11px', background: '#185FA5',
                color: 'white', border: 'none', borderRadius: '8px',
                fontSize: '14px', fontWeight: '700', cursor: 'pointer'
              }}
            >
              Submit Test ✓
            </button>
          </div>
        </div>
      </div>

      {/* ── BOTTOM NAV ── */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: 'white', borderTop: '1px solid #e2e8f0',
        padding: '10px 32px', display: 'flex',
        justifyContent: 'space-between', alignItems: 'center',
        height: '60px', zIndex: 99
      }}>
        <button onClick={handlePrevious} disabled={currentQ === 0}
          style={{
            padding: '9px 20px', borderRadius: '8px', fontSize: '13px',
            fontWeight: '600', border: '1px solid #e2e8f0',
            background: 'white', color: '#374151',
            cursor: currentQ === 0 ? 'not-allowed' : 'pointer',
            opacity: currentQ === 0 ? 0.4 : 1
          }}
        >
          ← Previous
        </button>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => handleClear(currentQuestion?.id)}
            style={{
              padding: '9px 16px', borderRadius: '8px', fontSize: '13px',
              fontWeight: '600', border: '1px solid #e2e8f0',
              background: 'white', color: '#dc2626', cursor: 'pointer'
            }}
          >
            Clear
          </button>
          <button onClick={handleMarkNext}
            style={{
              padding: '9px 16px', borderRadius: '8px', fontSize: '13px',
              fontWeight: '600', border: '1.5px solid #f59e0b',
              background: marked[currentQuestion?.id] ? '#fef3c7' : '#fffbeb',
              color: '#b45309', cursor: 'pointer'
            }}
          >
            {marked[currentQuestion?.id] ? '🔖 Marked & Next' : '📌 Mark & Next'}
          </button>
          <button onClick={handleSaveNext}
            disabled={currentQ === questions.length - 1}
            style={{
              padding: '9px 20px', borderRadius: '8px', fontSize: '13px',
              fontWeight: '700', border: 'none',
              background: currentQ === questions.length - 1 ? '#94a3b8' : '#185FA5',
              color: 'white', cursor: 'pointer'
            }}
          >
            Save & Next →
          </button>
        </div>
      </div>

      {/* ── Confirm Modal ── */}
      {showConfirm && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center',
          justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{
            background: 'white', borderRadius: '16px', padding: '32px',
            maxWidth: '400px', width: '90%', textAlign: 'center'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>📋</div>
            <div style={{ fontSize: '20px', fontWeight: '800', marginBottom: '20px', color: '#0f172a' }}>
              Submit Test?
            </div>
            <div style={{
              background: '#f8fafc', borderRadius: '10px',
              padding: '16px', marginBottom: '20px', textAlign: 'left'
            }}>
              {[
                { label: 'Answered', value: answeredCount, color: '#16a34a' },
                { label: 'Not Answered', value: notAnswered, color: '#dc2626' },
                { label: 'Marked for Review', value: markedCount, color: '#f59e0b' },
                { label: 'Not Visited', value: notVisited, color: '#64748b' },
                { label: 'Total Questions', value: questions.length, color: '#185FA5' },
              ].map(item => (
                <div key={item.label} style={{
                  display: 'flex', justifyContent: 'space-between',
                  padding: '7px 0', borderBottom: '1px solid #f1f5f9', fontSize: '14px'
                }}>
                  <span style={{ color: '#64748b' }}>{item.label}</span>
                  <span style={{ fontWeight: '800', color: item.color }}>{item.value}</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button onClick={() => setShowConfirm(false)}
                style={{
                  padding: '11px 24px', border: '1px solid #e2e8f0',
                  borderRadius: '8px', background: 'white',
                  cursor: 'pointer', fontSize: '14px', fontWeight: '600'
                }}
              >
                Cancel
              </button>
              <button onClick={handleSubmit} disabled={submitting}
                style={{
                  padding: '11px 24px', border: 'none',
                  borderRadius: '8px', background: '#185FA5',
                  color: 'white', cursor: 'pointer',
                  fontSize: '14px', fontWeight: '700'
                }}
              >
                {submitting ? 'Submitting...' : 'Submit Test'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default TestPage