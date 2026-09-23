import { useState } from 'react'
import type { UserRole } from './types'

const DEMO_USERS: Record<string, { password: string; role: UserRole; name: string; plant: string; phone: string }> = {
  'admin@miho.de': { password: 'miho2026', role: 'Miho Admin', name: 'Klaus Weber', plant: 'HQ — Frankfurt', phone: '+49 69 123 4567' },
  'field@miho.de': { password: 'miho2026', role: 'Field Engineer', name: 'Tunde Akinola', plant: 'NBC Lagos Plant', phone: '+234 802 111 2233' },
  'procurement@nbc.ng': { password: 'miho2026', role: 'Procurement Manager', name: 'Chidinma Eze', plant: 'NBC Lagos Plant', phone: '+234 803 222 3344' },
  'engineer@nbc.ng': { password: 'miho2026', role: 'Brewery Engineer', name: 'Emeka Okonkwo', plant: 'NBC Lagos Plant', phone: '+234 805 333 4455' },
}

interface Props {
  onLogin: (role: UserRole, name: string, email: string, plant: string, phone: string) => void
}

export default function Login({ onLogin }: Props) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<UserRole>('Miho Admin')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    setTimeout(() => {
      const user = DEMO_USERS[email]
      if (user && user.password === password) {
        onLogin(user.role, user.name, email, user.plant, user.phone)
      } else if (!email || !password) {
        setError('Please enter your email and password.')
      } else {
        setError('Invalid credentials. Try admin@miho.de / miho2026')
      }
      setLoading(false)
    }, 600)
  }

  const quickLogin = (e: string) => {
    const u = DEMO_USERS[e]
    if (u) { setEmail(e); setPassword(u.password); setRole(u.role) }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #001f3f 0%, #003366 55%, #0055A4 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      {/* Logo */}
      <div style={{ marginBottom: 40, display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ background: '#FF6600', borderRadius: 6, padding: '8px 10px', lineHeight: 1 }}>
          <svg width="24" height="18" viewBox="0 0 24 18" fill="white">
            <rect x="0" y="0" width="24" height="4" rx="1.5"/>
            <rect x="0" y="7" width="15" height="4" rx="1.5"/>
            <rect x="0" y="14" width="24" height="4" rx="1.5"/>
          </svg>
        </div>
        <div>
          <div style={{ color: '#fff', fontWeight: 900, fontSize: 26, letterSpacing: '-0.03em', lineHeight: 1 }}>miho</div>
          <div style={{ color: '#7fa8cc', fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Portal</div>
        </div>
      </div>

      {/* Card */}
      <div style={{ background: '#fff', borderRadius: 8, width: '100%', maxWidth: 420, boxShadow: '0 20px 60px rgba(0,0,0,0.4)', overflow: 'hidden' }}>
        <div style={{ background: '#003366', padding: '20px 28px', borderBottom: '3px solid #FF6600' }}>
          <div style={{ color: '#fff', fontSize: 16, fontWeight: 700 }}>Staff Portal Sign In</div>
          <div style={{ color: '#7fa8cc', fontSize: 12.5, marginTop: 2 }}>Miho Inspection Systems Ltd</div>
        </div>
        <form onSubmit={handleSubmit} style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#4a6278', display: 'block', marginBottom: 5 }}>Email Address <span style={{ color: '#EF4444' }}>*</span></label>
            <input
              className="form-input"
              type="email"
              placeholder="you@miho.de"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#4a6278', display: 'block', marginBottom: 5 }}>Password <span style={{ color: '#EF4444' }}>*</span></label>
            <div style={{ position: 'relative' }}>
              <input
                className="form-input"
                type={showPw ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
                style={{ paddingRight: 44 }}
              />
              <button
                type="button"
                onClick={() => setShowPw(v => !v)}
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#8fa3b3', fontSize: 12, fontWeight: 600 }}
              >{showPw ? 'Hide' : 'Show'}</button>
            </div>
            <div style={{ textAlign: 'right', marginTop: 5 }}>
              <button type="button" style={{ background: 'none', border: 'none', color: '#0055A4', fontSize: 12, cursor: 'pointer', fontWeight: 500 }}>Forgot Password?</button>
            </div>
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#4a6278', display: 'block', marginBottom: 5 }}>Role</label>
            <select className="form-input" value={role} onChange={e => setRole(e.target.value as UserRole)}>
              <option>Brewery Engineer</option>
              <option>Procurement Manager</option>
              <option>Miho Admin</option>
              <option>Field Engineer</option>
            </select>
          </div>
          {error && (
            <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 4, padding: '9px 12px', fontSize: 13, color: '#991b1b' }}>
              {error}
            </div>
          )}
          <button
            type="submit"
            className="btn-primary w-full"
            disabled={loading}
            style={{ padding: '12px', fontSize: 14, fontWeight: 700, background: loading ? '#7fa8cc' : '#003366', marginTop: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
          >
            {loading ? (
              <><span style={{ display: 'inline-block', width: 14, height: 14, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', animation: 'spin 0.7s linear infinite' }}></span> Signing in...</>
            ) : 'Sign In →'}
          </button>
        </form>

        {/* Quick login shortcuts */}
        <div style={{ borderTop: '1px solid #eef1f5', padding: '14px 28px', background: '#f8fafc' }}>
          <div style={{ fontSize: 11, color: '#8fa3b3', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Demo Quick Login</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {Object.entries(DEMO_USERS).map(([e, u]) => (
              <button key={e} type="button" onClick={() => quickLogin(e)}
                style={{ fontSize: 11, padding: '4px 8px', borderRadius: 3, background: '#e2e8f0', border: 'none', cursor: 'pointer', color: '#4a6278', fontWeight: 600 }}>
                {u.role.split(' ')[u.role.split(' ').length - 1]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ color: '#4a6278', fontSize: 12, marginTop: 28, textAlign: 'center' }}>
        © 2026 Miho Inspection Systems Ltd Nigeria. All rights reserved.
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
