import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Leaf, Sparkles, Wind, Droplets, Zap } from 'lucide-react'

function ParticleCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 0.5,
      dx: (Math.random() - 0.5) * 0.4,
      dy: -Math.random() * 0.6 - 0.2,
      alpha: Math.random() * 0.5 + 0.1,
      color: Math.random() > 0.5 ? '#34d399' : '#60a5fa'
    }))

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = p.color + Math.floor(p.alpha * 255).toString(16).padStart(2, '0')
        ctx.fill()
        p.x += p.dx
        p.y += p.dy
        if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width }
        if (p.x < -10) p.x = canvas.width + 10
        if (p.x > canvas.width + 10) p.x = -10
      })
      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} id="particles-canvas" style={{ width: '100%', height: '100%' }} />
}

function StatCard({ icon: Icon, value, label, color }) {
  return (
    <div className="glass-card" style={{ padding: '24px', textAlign: 'center', flex: 1, minWidth: '140px' }}>
      <div style={{
        width: '48px', height: '48px', borderRadius: '14px',
        background: `${color}15`, border: `1px solid ${color}30`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 12px'
      }}>
        <Icon size={22} color={color} />
      </div>
      <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.6rem', fontWeight: 700, color: '#f0fdf4' }}>{value}</div>
      <div style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '4px' }}>{label}</div>
    </div>
  )
}

function FeatureRow({ emoji, title, desc }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
      <span style={{ fontSize: '1.5rem', flexShrink: 0, marginTop: '2px' }}>{emoji}</span>
      <div>
        <div style={{ fontWeight: 600, color: '#f0fdf4', marginBottom: '4px' }}>{title}</div>
        <div style={{ fontSize: '0.9rem', color: '#9ca3af', lineHeight: 1.5 }}>{desc}</div>
      </div>
    </div>
  )
}

export default function Landing() {
  const navigate = useNavigate()

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Hero Section */}
      <section style={{
        position: 'relative', minHeight: '100vh', display: 'flex',
        alignItems: 'center', justifyContent: 'center', overflow: 'hidden'
      }} className="grid-bg">
        <ParticleCanvas />

        {/* Glow orbs */}
        <div className="glow-orb" style={{
          width: '600px', height: '600px', top: '-100px', right: '-100px',
          background: 'radial-gradient(circle, rgba(52,211,153,0.12) 0%, transparent 70%)'
        }} />
        <div className="glow-orb" style={{
          width: '400px', height: '400px', bottom: '100px', left: '-80px',
          background: 'radial-gradient(circle, rgba(96,165,250,0.1) 0%, transparent 70%)',
          animationDelay: '3s'
        }} />
        <div className="glow-orb" style={{
          width: '300px', height: '300px', top: '40%', left: '40%',
          background: 'radial-gradient(circle, rgba(167,139,250,0.08) 0%, transparent 70%)',
          animationDelay: '5s'
        }} />

        <div style={{
          position: 'relative', zIndex: 2, maxWidth: '900px',
          margin: '0 auto', padding: '120px 24px 60px', textAlign: 'center'
        }}>
          {/* AI badge */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '28px' }}>
            <div className="ai-badge fade-in-up">
              <Sparkles size={12} />
              Generative AI Powered Experience
            </div>
          </div>

          {/* Main headline */}
          <h1 className="section-title fade-in-up" style={{ animationDelay: '0.1s', marginBottom: '20px' }}>
            Meet the Creature<br />
            <span className="gradient-text">Your Lifestyle Creates</span>
          </h1>

          <p style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.25rem)', color: '#9ca3af',
            maxWidth: '620px', margin: '0 auto 40px', lineHeight: 1.7,
            animation: 'fadeInUp 0.6s ease forwards', animationDelay: '0.2s', opacity: 0
          }} className="fade-in-up">
            Powered by Generative AI to reveal your environmental identity.
            Your daily habits shape an AI-born spirit—unique, symbolic, and deeply personal.
          </p>

          {/* CTA */}
          <div style={{
            display: 'flex', gap: '16px', justifyContent: 'center',
            flexWrap: 'wrap', marginBottom: '60px',
            animation: 'fadeInUp 0.6s ease forwards', animationDelay: '0.3s', opacity: 0
          }} className="fade-in-up">
            <button
              id="discover-spirit-btn"
              className="btn-primary pulse-green"
              onClick={() => navigate('/assess')}
              style={{ fontSize: '1.05rem', padding: '16px 36px' }}
            >
              Discover My Carbon Spirit
              <ArrowRight size={20} />
            </button>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <StatCard icon={Leaf} value="9" label="Lifestyle Areas" color="#34d399" />
            <StatCard icon={Sparkles} value="AI" label="Generated Spirit" color="#a78bfa" />
            <StatCard icon={Zap} value="100%" label="Personalized" color="#fbbf24" />
            <StatCard icon={Wind} value="2050" label="AI Future Vision" color="#60a5fa" />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{ padding: '100px 24px', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <div className="ai-badge" style={{ display: 'inline-flex', marginBottom: '20px' }}>
            <Sparkles size={12} /> How It Works
          </div>
          <h2 className="section-title" style={{ marginBottom: '16px' }}>
            From Habits to <span className="green-text">AI Identity</span>
          </h2>
          <p style={{ color: '#9ca3af', maxWidth: '480px', margin: '0 auto', lineHeight: 1.6 }}>
            In three steps, our AI transforms your lifestyle into a living, breathing carbon spirit.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          {[
            {
              step: '01',
              title: 'Answer the Assessment',
              desc: 'Share your transportation, diet, energy use, and more across 9 lifestyle categories. No judgment, just data.',
              icon: '📋',
              color: '#34d399'
            },
            {
              step: '02',
              title: 'AI Calculates & Analyzes',
              desc: 'Gemini AI processes your habits, calculates your carbon impact score, and builds your environmental profile.',
              icon: '🧠',
              color: '#a78bfa'
            },
            {
              step: '03',
              title: 'Meet Your Carbon Spirit',
              desc: 'Receive a fully AI-generated spirit with a unique name, backstory, recommendations, and a vision for 2050.',
              icon: '✨',
              color: '#60a5fa'
            }
          ].map(({ step, title, desc, icon, color }, i) => (
            <div key={i} className="glass-card" style={{ padding: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.8rem', fontWeight: 700, color, letterSpacing: '0.1em' }}>
                  STEP {step}
                </span>
                <span style={{ fontSize: '1.5rem' }}>{icon}</span>
              </div>
              <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.2rem', fontWeight: 700, marginBottom: '12px', color: '#f0fdf4' }}>
                {title}
              </h3>
              <p style={{ color: '#9ca3af', lineHeight: 1.6, fontSize: '0.95rem' }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '0 24px 100px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          <div className="glass-card" style={{ padding: '40px', borderColor: 'rgba(52, 211, 153, 0.2)' }}>
            <div className="ai-badge" style={{ marginBottom: '24px' }}>
              <Sparkles size={12} /> 100% AI Generated
            </div>
            <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.4rem', fontWeight: 700, marginBottom: '24px' }}>
              Every Spirit is <span className="green-text">Unique</span>
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <FeatureRow emoji="🌿" title="AI Spirit Name & Identity" desc="Gemini creates a symbolic name and personality that reflects your unique environmental footprint." />
              <FeatureRow emoji="📖" title="AI Backstory & Narrative" desc="A rich, poetic story about your spirit's origin and relationship with the planet." />
              <FeatureRow emoji="🎯" title="Personalized Recommendations" desc="Four specific, actionable AI recommendations tailored to your exact habits and score." />
              <FeatureRow emoji="🔭" title="AI Vision for 2050" desc="A future prediction of your environmental impact if you follow the recommended path." />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="glass-card" style={{ padding: '28px', flex: 1 }}>
              <div style={{ fontSize: '2rem', marginBottom: '12px' }}>🌍</div>
              <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.1rem', marginBottom: '8px' }}>9 Lifestyle Categories</h3>
              <p style={{ color: '#9ca3af', fontSize: '0.9rem', lineHeight: 1.5 }}>
                Transport, food, energy, shopping, recycling, water, travel, digital consumption, and home efficiency.
              </p>
            </div>
            <div className="glass-card" style={{ padding: '28px', flex: 1, borderColor: 'rgba(167, 139, 250, 0.2)' }}>
              <div style={{ fontSize: '2rem', marginBottom: '12px' }}>⚡</div>
              <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.1rem', marginBottom: '8px' }}>Real-time AI Processing</h3>
              <p style={{ color: '#9ca3af', fontSize: '0.9rem', lineHeight: 1.5 }}>
                Powered by Google Gemini, your spirit is generated live with elegant loading animations.
              </p>
            </div>
            <div className="glass-card" style={{ padding: '28px', flex: 1, borderColor: 'rgba(96, 165, 250, 0.2)' }}>
              <div style={{ fontSize: '2rem', marginBottom: '12px' }}>📊</div>
              <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.1rem', marginBottom: '8px' }}>Sustainability Score</h3>
              <p style={{ color: '#9ca3af', fontSize: '0.9rem', lineHeight: 1.5 }}>
                A 0–100 score calculated from your answers, visualized with a stunning animated ring.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section style={{
        padding: '80px 24px 120px', textAlign: 'center',
        background: 'linear-gradient(180deg, transparent, rgba(52,211,153,0.03))'
      }}>
        <h2 className="section-title" style={{ marginBottom: '16px' }}>
          Ready to Meet Your <span className="gradient-text">Spirit?</span>
        </h2>
        <p style={{ color: '#9ca3af', marginBottom: '40px', fontSize: '1.1rem' }}>
          Takes just 3 minutes. Powered by Gemini AI.
        </p>
        <button
          id="cta-bottom-btn"
          className="btn-primary"
          onClick={() => navigate('/assess')}
          style={{ fontSize: '1.1rem', padding: '18px 44px' }}
        >
          Begin My Assessment <ArrowRight size={22} />
        </button>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '24px', textAlign: 'center', color: '#4b5563', fontSize: '0.85rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <Leaf size={14} color="#34d399" />
          <span>Carbon Spirit — AI-powered sustainability insights</span>
          <Sparkles size={14} color="#a78bfa" />
        </div>
      </footer>
    </main>
  )
}
