import { Link, useLocation } from 'react-router-dom'
import { Leaf, Sparkles } from 'lucide-react'

export default function Navbar() {
  const location = useLocation()

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #34d399, #10b981)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 20px rgba(52, 211, 153, 0.3)'
          }}>
            <Leaf size={18} color="#000" strokeWidth={2.5} />
          </div>
          <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.1rem', color: '#f0fdf4' }}>
            Carbon<span style={{ color: '#34d399' }}>Spirit</span>
          </span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div className="ai-badge">
            <Sparkles size={12} />
            Powered by Gemini AI
          </div>
          {location.pathname !== '/assess' && (
            <Link to="/assess" className="btn-primary" style={{ padding: '10px 22px', fontSize: '0.9rem', textDecoration: 'none' }}>
              Start Assessment
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
