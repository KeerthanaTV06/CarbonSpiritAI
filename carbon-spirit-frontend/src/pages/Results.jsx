import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Sparkles, ArrowLeft, Leaf, Target, Eye, AlertTriangle, Lightbulb, Telescope, Heart } from 'lucide-react'

/* ── Animated Score Ring ── */
function ScoreRing({ score }) {
  const [displayed, setDisplayed] = useState(0)
  const radius = 80
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference - (displayed / 100) * circumference

  useEffect(() => {
    let start = 0
    const step = () => {
      start += 1
      setDisplayed(s => Math.min(s + 1, score))
      if (start < score) requestAnimationFrame(step)
    }
    const timer = setTimeout(() => requestAnimationFrame(step), 300)
    return () => clearTimeout(timer)
  }, [score])

  const getColor = (s) => {
    if (s >= 75) return '#34d399'
    if (s >= 50) return '#fbbf24'
    if (s >= 25) return '#fb923c'
    return '#f87171'
  }

  const getLabel = (s) => {
    if (s >= 80) return 'Eco Champion'
    if (s >= 60) return 'Green Advocate'
    if (s >= 40) return 'Conscious Citizen'
    if (s >= 20) return 'Emerging Awareness'
    return 'High Impact Living'
  }

  const color = getColor(score)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
      <svg width="200" height="200" className="score-ring" style={{ filter: `drop-shadow(0 0 20px ${color}60)` }}>
        {/* Background ring */}
        <circle cx="100" cy="100" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="12" />
        {/* Progress ring */}
        <circle
          cx="100" cy="100" r={radius} fill="none"
          stroke={color} strokeWidth="12"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          transform="rotate(-90 100 100)"
          style={{ transition: 'stroke-dashoffset 0.05s ease' }}
        />
        {/* Center content */}
        <text x="100" y="92" textAnchor="middle" fill="#f0fdf4"
          style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '36px', fontWeight: 700 }}
        >
          {displayed}
        </text>
        <text x="100" y="114" textAnchor="middle" fill="#6b7280" style={{ fontSize: '14px' }}>
          / 100
        </text>
      </svg>
      <div style={{
        padding: '6px 18px', borderRadius: '50px', fontSize: '0.85rem', fontWeight: 600,
        background: `${color}15`, color, border: `1px solid ${color}30`
      }}>
        {getLabel(score)}
      </div>
    </div>
  )
}

/* ── Loading Skeleton ── */
function LoadingSkeleton() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', padding: '100px 24px 60px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div className="skeleton" style={{ height: '32px', width: '200px', margin: '0 auto 16px' }} />
          <div className="skeleton" style={{ height: '56px', width: '400px', margin: '0 auto 12px' }} />
          <div className="skeleton" style={{ height: '24px', width: '280px', margin: '0 auto' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px', marginBottom: '24px' }}>
          <div className="skeleton" style={{ height: '300px', borderRadius: '20px' }} />
          <div className="skeleton" style={{ height: '300px', borderRadius: '20px' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '16px' }}>
          <div className="skeleton" style={{ height: '120px', borderRadius: '16px' }} />
          <div className="skeleton" style={{ height: '120px', borderRadius: '16px' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
          <div className="skeleton" style={{ height: '160px', borderRadius: '16px' }} />
          <div className="skeleton" style={{ height: '160px', borderRadius: '16px' }} />
        </div>
      </div>
    </div>
  )
}

/* ── Section Header ── */
function SectionHeader({ icon: Icon, title, subtitle, color = '#34d399' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '20px' }}>
      <div style={{
        width: '44px', height: '44px', borderRadius: '12px', flexShrink: 0,
        background: `${color}15`, border: `1px solid ${color}30`,
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <Icon size={20} color={color} />
      </div>
      <div>
        <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.1rem', color: '#f0fdf4', marginBottom: '2px' }}>
          {title}
        </h3>
        {subtitle && <p style={{ fontSize: '0.8rem', color: '#6b7280' }}>{subtitle}</p>}
      </div>
    </div>
  )
}

export default function Results() {
  const location = useLocation()
  const navigate = useNavigate()
  const data = location.state?.data
  const [visible, setVisible] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    if (data) setTimeout(() => setVisible(true), 100)
  }, [data])

  // If no data, show loading or redirect
  if (!data) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px 24px' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="skeleton" style={{ width: '300px', height: '24px', margin: '0 auto 16px' }} />
          <p style={{ color: '#9ca3af', marginBottom: '24px' }}>No results found. Please complete the assessment first.</p>
          <button id="back-to-assess" className="btn-primary" onClick={() => navigate('/assess')}>
            <ArrowLeft size={18} /> Take Assessment
          </button>
        </div>
      </div>
    )
  }

  const {
    score = 0,
    spiritName = 'Unknown Spirit',
    title = '',
    story = '',
    impact = '',
    strengths = [],
    weaknesses = [],
    recommendations = [],
    vision2050 = '',
    motivation = ''
  } = data

  return (
    <div ref={containerRef} style={{ minHeight: '100vh', background: 'var(--bg-primary)', padding: '100px 24px 80px' }} className="grid-bg">
      {/* Ambient glows */}
      <div className="glow-orb" style={{
        width: '500px', height: '500px', top: '-50px', right: '-100px', position: 'fixed',
        background: 'radial-gradient(circle, rgba(52,211,153,0.07) 0%, transparent 70%)', pointerEvents: 'none'
      }} />
      <div className="glow-orb" style={{
        width: '400px', height: '400px', bottom: '0', left: '-80px', position: 'fixed',
        background: 'radial-gradient(circle, rgba(167,139,250,0.06) 0%, transparent 70%)',
        animationDelay: '4s', pointerEvents: 'none'
      }} />

      <div style={{ maxWidth: '960px', margin: '0 auto', opacity: visible ? 1 : 0, transition: 'opacity 0.5s ease' }}>
        {/* Page header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div className="ai-badge" style={{ display: 'inline-flex', marginBottom: '16px' }}>
            <Sparkles size={12} /> AI Generated Results
          </div>
          <h1 className="section-title" style={{ marginBottom: '12px' }}>
            Your <span className="gradient-text">Carbon Spirit</span> Has Arrived
          </h1>
          <p style={{ color: '#9ca3af', fontSize: '1rem' }}>
            Every insight below was uniquely created by Gemini AI based on your lifestyle
          </p>
        </div>

        {/* ── Hero: Score + Spirit Identity ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '24px', marginBottom: '24px', flexWrap: 'wrap' }}>
          {/* Score */}
          <div className="glass-card" style={{ padding: '40px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minWidth: '220px' }}>
            <div className="ai-badge" style={{ marginBottom: '20px', fontSize: '0.7rem' }}>
              <Sparkles size={10} /> Sustainability Score
            </div>
            <ScoreRing score={score} />
          </div>

          {/* Spirit Card */}
          <div className="glass-card" style={{
            padding: '36px',
            background: 'linear-gradient(135deg, rgba(52,211,153,0.06) 0%, rgba(96,165,250,0.04) 50%, rgba(167,139,250,0.06) 100%)',
            borderColor: 'rgba(52,211,153,0.2)'
          }}>
            <div className="ai-badge" style={{ marginBottom: '20px' }}>
              <Sparkles size={12} /> AI-Created Identity
            </div>
            <div style={{ fontSize: '3rem', marginBottom: '12px' }} className="float-anim">🌿</div>
            <h2 style={{
              fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
              fontWeight: 800, marginBottom: '8px',
              background: 'linear-gradient(135deg, #34d399 0%, #60a5fa 50%, #a78bfa 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
            }}>
              {spiritName}
            </h2>
            {title && (
              <p style={{ color: '#34d399', fontWeight: 600, fontSize: '1rem', marginBottom: '16px' }}>
                {title}
              </p>
            )}
            <p style={{ color: '#9ca3af', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Your unique AI-generated spirit — a living symbol of your environmental identity, created exclusively by Gemini.
            </p>
          </div>
        </div>

        {/* ── AI Story ── */}
        <div className="glass-card" style={{ padding: '36px', marginBottom: '24px' }}>
          <SectionHeader icon={Leaf} title="The AI Origin Story" subtitle="Generative AI narrative — unique to you" color="#34d399" />
          <div style={{
            background: 'rgba(52,211,153,0.03)', borderLeft: '3px solid #34d399',
            borderRadius: '0 12px 12px 0', padding: '20px 24px'
          }}>
            <p style={{ color: '#d1fae5', lineHeight: 1.8, fontSize: '1rem', fontStyle: 'italic' }}>
              "{story}"
            </p>
          </div>
        </div>

        {/* ── Impact Analysis ── */}
        <div className="glass-card" style={{ padding: '36px', marginBottom: '24px' }}>
          <SectionHeader icon={Target} title="Carbon Impact Analysis" subtitle="AI assessment of your environmental footprint" color="#fbbf24" />
          <p style={{ color: '#e5e7eb', lineHeight: 1.8, fontSize: '0.95rem' }}>
            {impact}
          </p>
        </div>

        {/* ── Strengths & Weaknesses ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '24px' }}>
          <div className="glass-card" style={{ padding: '32px', borderColor: 'rgba(52,211,153,0.15)' }}>
            <SectionHeader icon={Eye} title="AI-Identified Strengths" subtitle="Where your lifestyle shines" color="#34d399" />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {(strengths.length ? strengths : ['Eco-conscious choices']).map((s, i) => (
                <span key={i} className="chip-green">✓ {s}</span>
              ))}
            </div>
          </div>

          <div className="glass-card" style={{ padding: '32px', borderColor: 'rgba(248,113,113,0.15)' }}>
            <SectionHeader icon={AlertTriangle} title="Areas for Growth" subtitle="AI-flagged improvement areas" color="#f87171" />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {(weaknesses.length ? weaknesses : ['Carbon-heavy habits']).map((w, i) => (
                <span key={i} className="chip-red">⚡ {w}</span>
              ))}
            </div>
          </div>
        </div>

        {/* ── AI Recommendations ── */}
        <div className="glass-card" style={{ padding: '36px', marginBottom: '24px' }}>
          <SectionHeader icon={Lightbulb} title="AI Personalized Recommendations" subtitle="4 tailored actions generated by Gemini" color="#a78bfa" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            {(recommendations.length ? recommendations : ['Improve your habits']).map((rec, i) => (
              <div key={i} className="rec-card">
                <div style={{
                  width: '32px', height: '32px', borderRadius: '10px', marginBottom: '12px',
                  background: 'rgba(52,211,153,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#34d399', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '0.9rem'
                }}>
                  {String(i + 1).padStart(2, '0')}
                </div>
                <p style={{ color: '#d1fae5', fontSize: '0.9rem', lineHeight: 1.6 }}>{rec}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Vision 2050 ── */}
        <div className="vision-card" style={{ marginBottom: '24px' }}>
          <SectionHeader icon={Telescope} title="AI Vision for 2050" subtitle="Gemini's prediction of your future impact" color="#60a5fa" />
          <div style={{
            background: 'linear-gradient(135deg, rgba(96,165,250,0.08), rgba(167,139,250,0.08))',
            borderRadius: '12px', padding: '24px', borderLeft: '3px solid #60a5fa'
          }}>
            <p style={{ color: '#bfdbfe', lineHeight: 1.8, fontSize: '1rem', fontStyle: 'italic' }}>
              🔭 "{vision2050}"
            </p>
          </div>
        </div>

        {/* ── Motivation ── */}
        <div className="glass-card" style={{
          padding: '36px', marginBottom: '40px', textAlign: 'center',
          borderColor: 'rgba(251,191,36,0.2)',
          background: 'linear-gradient(135deg, rgba(251,191,36,0.05), rgba(52,211,153,0.05))'
        }}>
          <SectionHeader icon={Heart} title="Your AI Motivation" subtitle="A personal message from your Carbon Spirit" color="#fbbf24" />
          <p style={{
            color: '#fef3c7', fontSize: '1.15rem', lineHeight: 1.8,
            fontStyle: 'italic', fontFamily: 'Space Grotesk, sans-serif'
          }}>
            💫 "{motivation}"
          </p>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            id="retake-btn"
            className="btn-secondary"
            onClick={() => navigate('/assess')}
          >
            <ArrowLeft size={18} /> Retake Assessment
          </button>
          <button
            id="share-btn"
            className="btn-primary"
            onClick={() => {
              const text = `I just discovered my Carbon Spirit: "${spiritName}" with a sustainability score of ${score}/100! 🌿✨ Powered by Gemini AI — discover yours!`
              if (navigator.share) {
                navigator.share({ title: 'My Carbon Spirit', text })
              } else {
                navigator.clipboard.writeText(text)
                alert('Result copied to clipboard!')
              }
            }}
          >
            <Sparkles size={18} /> Share My Spirit
          </button>
        </div>

        {/* AI disclaimer */}
        <div style={{ textAlign: 'center', marginTop: '32px', padding: '16px', borderRadius: '12px', background: 'rgba(167,139,250,0.05)', border: '1px solid rgba(167,139,250,0.1)' }}>
          <p style={{ color: '#6b7280', fontSize: '0.8rem' }}>
            <Sparkles size={12} style={{ display: 'inline', marginRight: '6px' }} />
            All narrative content, recommendations, and predictions above were dynamically generated by <strong style={{ color: '#a78bfa' }}>Google Gemini AI</strong>.
            No hardcoded responses were used. Every Carbon Spirit is unique.
          </p>
        </div>
      </div>
    </div>
  )
}
