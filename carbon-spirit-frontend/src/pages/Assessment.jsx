import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { ChevronRight, ChevronLeft, Sparkles, CheckCircle } from 'lucide-react'

const QUESTIONS = [
  {
    id: 'transport',
    category: 'Transportation',
    emoji: '🚗',
    color: '#60a5fa',
    question: 'How do you primarily get around on a daily basis?',
    options: [
      { value: 'car_solo', label: 'Personal car (alone)', score: 0 },
      { value: 'car_shared', label: 'Carpool / shared rides', score: 30 },
      { value: 'public', label: 'Public transit (bus/metro/train)', score: 60 },
      { value: 'ev', label: 'Electric vehicle', score: 75 },
      { value: 'bike_walk', label: 'Bicycle or walking', score: 100 },
    ]
  },
  {
    id: 'food',
    category: 'Food & Diet',
    emoji: '🥗',
    color: '#34d399',
    question: 'What best describes your typical diet?',
    options: [
      { value: 'heavy_meat', label: 'Heavy meat eater (daily red meat)', score: 0 },
      { value: 'meat_regular', label: 'Regular omnivore (meat most days)', score: 25 },
      { value: 'flexitarian', label: 'Flexitarian (meat a few times/week)', score: 55 },
      { value: 'vegetarian', label: 'Vegetarian', score: 80 },
      { value: 'vegan', label: 'Vegan / plant-based', score: 100 },
    ]
  },
  {
    id: 'electricity',
    category: 'Electricity Usage',
    emoji: '⚡',
    color: '#fbbf24',
    question: 'How would you describe your home electricity consumption?',
    options: [
      { value: 'very_high', label: 'Very high — always running AC/heat', score: 0 },
      { value: 'high', label: 'High — many devices, frequent use', score: 25 },
      { value: 'moderate', label: 'Moderate — careful with usage', score: 55 },
      { value: 'low', label: 'Low — energy efficient habits', score: 80 },
      { value: 'renewable', label: 'Solar / 100% renewable energy', score: 100 },
    ]
  },
  {
    id: 'shopping',
    category: 'Shopping Behavior',
    emoji: '🛍️',
    color: '#f87171',
    question: 'How often do you buy new clothes, gadgets, or products?',
    options: [
      { value: 'weekly', label: 'Very often — weekly purchases', score: 0 },
      { value: 'monthly', label: 'Frequently — several times/month', score: 25 },
      { value: 'occasionally', label: 'Occasionally — once a month or less', score: 60 },
      { value: 'rarely', label: 'Rarely — only what I need', score: 80 },
      { value: 'secondhand', label: 'Mostly secondhand / minimal buying', score: 100 },
    ]
  },
  {
    id: 'recycling',
    category: 'Recycling Habits',
    emoji: '♻️',
    color: '#34d399',
    question: 'How consistent are you with recycling and waste reduction?',
    options: [
      { value: 'never', label: 'Rarely ever recycle', score: 0 },
      { value: 'sometimes', label: 'Sometimes, when it\'s convenient', score: 30 },
      { value: 'most', label: 'Recycle most materials consistently', score: 65 },
      { value: 'always', label: 'Diligently recycle + compost', score: 85 },
      { value: 'zero_waste', label: 'Zero-waste lifestyle', score: 100 },
    ]
  },
  {
    id: 'water',
    category: 'Water Conservation',
    emoji: '💧',
    color: '#60a5fa',
    question: 'How conscious are you about water usage?',
    options: [
      { value: 'wasteful', label: 'Not at all — long showers, full tubs', score: 0 },
      { value: 'average', label: 'Average — no specific habits', score: 35 },
      { value: 'some_effort', label: 'Some effort — shorter showers', score: 60 },
      { value: 'careful', label: 'Careful — fix leaks, low-flow fixtures', score: 80 },
      { value: 'very_careful', label: 'Very mindful — rainwater harvesting etc.', score: 100 },
    ]
  },
  {
    id: 'travel',
    category: 'Travel Frequency',
    emoji: '✈️',
    color: '#a78bfa',
    question: 'How often do you take long-distance trips (flights)?',
    options: [
      { value: 'monthly', label: 'Monthly or more', score: 0 },
      { value: 'quarterly', label: '4–6 times per year', score: 20 },
      { value: 'twice', label: '2–3 times per year', score: 45 },
      { value: 'once', label: 'Once per year or less', score: 70 },
      { value: 'never', label: 'Rarely fly — prefer trains/local', score: 100 },
    ]
  },
  {
    id: 'digital',
    category: 'Digital Consumption',
    emoji: '📱',
    color: '#fb923c',
    question: 'How much time do you spend on screens and streaming daily?',
    options: [
      { value: 'very_high', label: '8+ hours of streaming/gaming daily', score: 0 },
      { value: 'high', label: '5–8 hours daily', score: 25 },
      { value: 'moderate', label: '3–5 hours daily', score: 55 },
      { value: 'low', label: '1–3 hours, device-aware habits', score: 80 },
      { value: 'minimal', label: 'Minimal screen time, offline often', score: 100 },
    ]
  },
  {
    id: 'home',
    category: 'Home Energy Efficiency',
    emoji: '🏠',
    color: '#34d399',
    question: 'How energy-efficient is your home setup?',
    options: [
      { value: 'poor', label: 'Poorly insulated, old appliances', score: 0 },
      { value: 'average', label: 'Average — no specific upgrades', score: 30 },
      { value: 'some', label: 'Some LED lights and efficient appliances', score: 60 },
      { value: 'good', label: 'Well insulated, smart thermostat', score: 80 },
      { value: 'excellent', label: 'Highly efficient / solar panels', score: 100 },
    ]
  }
]

function QuestionCard({ question, selected, onSelect, index, total }) {
  return (
    <div style={{ animation: 'fadeInUp 0.4s ease forwards' }}>
      {/* Category badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
        <span style={{ fontSize: '1.5rem' }}>{question.emoji}</span>
        <span style={{
          padding: '4px 12px', borderRadius: '50px', fontSize: '0.8rem', fontWeight: 600,
          background: `${question.color}15`, color: question.color,
          border: `1px solid ${question.color}30`
        }}>
          {question.category}
        </span>
        <span style={{ marginLeft: 'auto', color: '#6b7280', fontSize: '0.85rem' }}>
          {index + 1} of {total}
        </span>
      </div>

      <h2 style={{
        fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(1.1rem, 3vw, 1.4rem)',
        fontWeight: 700, color: '#f0fdf4', marginBottom: '28px', lineHeight: 1.4
      }}>
        {question.question}
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {question.options.map((opt) => (
          <button
            key={opt.value}
            id={`option-${opt.value}`}
            onClick={() => onSelect(opt.value)}
            style={{
              padding: '16px 20px', borderRadius: '14px', cursor: 'pointer',
              textAlign: 'left', fontFamily: 'Inter, sans-serif', fontSize: '0.95rem',
              transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', gap: '12px',
              background: selected === opt.value
                ? `${question.color}15`
                : 'rgba(255,255,255,0.03)',
              border: selected === opt.value
                ? `1.5px solid ${question.color}`
                : '1.5px solid rgba(255,255,255,0.07)',
              color: selected === opt.value ? '#f0fdf4' : '#9ca3af',
              fontWeight: selected === opt.value ? 600 : 400,
            }}
          >
            <div style={{
              width: '20px', height: '20px', borderRadius: '50%', flexShrink: 0,
              border: selected === opt.value ? `2px solid ${question.color}` : '2px solid rgba(255,255,255,0.15)',
              background: selected === opt.value ? question.color : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s ease'
            }}>
              {selected === opt.value && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#000' }} />}
            </div>
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function Assessment() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const question = QUESTIONS[currentIndex]
  const progress = ((currentIndex) / QUESTIONS.length) * 100
  const allAnswered = Object.keys(answers).length === QUESTIONS.length

  const handleSelect = (value) => {
    setAnswers(prev => ({ ...prev, [question.id]: value }))
  }

  const handleNext = () => {
    if (currentIndex < QUESTIONS.length - 1) setCurrentIndex(i => i + 1)
  }

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(i => i - 1)
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)
    try {
      const payload = { answers }
      const apiBase = import.meta.env.VITE_API_URL || ''
      const res = await axios.post(`${apiBase}/api/analyze`, payload)
      navigate('/results', { state: { data: res.data } })
    } catch (err) {
      console.error(err)
      setError('Something went wrong. Make sure the backend is running with a valid Gemini API key.')
      setLoading(false)
    }
  }

  const isLast = currentIndex === QUESTIONS.length - 1
  const canProceed = answers[question.id]

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', padding: '100px 24px 60px' }} className="grid-bg">
      {/* Glow */}
      <div className="glow-orb" style={{
        width: '400px', height: '400px', top: '0', right: '0',
        background: 'radial-gradient(circle, rgba(52,211,153,0.08) 0%, transparent 70%)',
        position: 'fixed', pointerEvents: 'none'
      }} />

      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div className="ai-badge" style={{ display: 'inline-flex', marginBottom: '16px' }}>
            <Sparkles size={12} /> AI Lifestyle Assessment
          </div>
          <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.8rem', fontWeight: 700, color: '#f0fdf4' }}>
            Tell Us About Your <span className="green-text">Lifestyle</span>
          </h1>
          <p style={{ color: '#9ca3af', marginTop: '8px', fontSize: '0.95rem' }}>
            Your answers will be analyzed by Gemini AI to create your unique Carbon Spirit
          </p>
        </div>

        {/* Progress */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.85rem', color: '#9ca3af' }}>
              Progress: {Object.keys(answers).length}/{QUESTIONS.length} answered
            </span>
            <span style={{ fontSize: '0.85rem', color: '#34d399', fontWeight: 600 }}>
              {Math.round(progress)}%
            </span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Question dots */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '32px' }}>
          {QUESTIONS.map((q, i) => (
            <button
              key={q.id}
              id={`step-${i}`}
              onClick={() => setCurrentIndex(i)}
              style={{
                width: '32px', height: '32px', borderRadius: '50%', border: 'none',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.75rem', fontWeight: 700, transition: 'all 0.2s ease',
                background: answers[q.id]
                  ? 'linear-gradient(135deg, #34d399, #10b981)'
                  : currentIndex === i
                    ? 'rgba(52, 211, 153, 0.2)'
                    : 'rgba(255,255,255,0.05)',
                color: answers[q.id] ? '#000' : currentIndex === i ? '#34d399' : '#6b7280',
                border: currentIndex === i ? '1.5px solid #34d399' : '1.5px solid transparent',
                boxShadow: answers[q.id] ? '0 0 8px rgba(52,211,153,0.3)' : 'none'
              }}
            >
              {answers[q.id] ? <CheckCircle size={14} /> : i + 1}
            </button>
          ))}
        </div>

        {/* Card */}
        <div className="glass-card" style={{ padding: '40px', marginBottom: '24px' }}>
          <QuestionCard
            key={question.id}
            question={question}
            selected={answers[question.id]}
            onSelect={handleSelect}
            index={currentIndex}
            total={QUESTIONS.length}
          />
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)',
            borderRadius: '12px', padding: '16px', marginBottom: '20px',
            color: '#f87171', fontSize: '0.9rem', lineHeight: 1.5
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Navigation */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            id="prev-btn"
            className="btn-secondary"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            style={{ opacity: currentIndex === 0 ? 0.3 : 1 }}
          >
            <ChevronLeft size={18} /> Back
          </button>

          {isLast ? (
            <button
              id="submit-btn"
              className="btn-primary"
              onClick={handleSubmit}
              disabled={!allAnswered || loading}
              style={{ flex: 1, maxWidth: '300px', justifyContent: 'center' }}
            >
              {loading ? (
                <>
                  <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite', fontSize: '1rem' }}>⟳</span>
                  Gemini is analyzing…
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  Generate My Carbon Spirit
                </>
              )}
            </button>
          ) : (
            <button
              id="next-btn"
              className="btn-primary"
              onClick={handleNext}
              disabled={!canProceed}
              style={{ flex: 1, maxWidth: '200px', justifyContent: 'center' }}
            >
              Next <ChevronRight size={18} />
            </button>
          )}
        </div>

        {isLast && !allAnswered && (
          <p style={{ textAlign: 'center', color: '#6b7280', fontSize: '0.85rem', marginTop: '12px' }}>
            Answer all {QUESTIONS.length} questions to unlock your AI Carbon Spirit
          </p>
        )}
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
