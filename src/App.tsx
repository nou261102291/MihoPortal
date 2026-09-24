import { useState, useEffect, useCallback, useRef } from 'react'
import Login from './Login'
import AdminPanel from './AdminPanel'
import { useAppState } from './useAppState'
import type { AppState, AuthUser, CatalogItem, Order, RfqLineItem, Screen, Toast, Ticket, UserRole } from './types'

// ─── RBAC ─────────────────────────────────────────────────────────────────
const ROLE_NAV: Record<UserRole, Screen[]> = {
  'Miho Admin':           ['dashboard', 'catalog', 'tickets', 'orders', 'admin', 'profile'],
  'Field Engineer':       ['dashboard', 'tickets', 'catalog', 'profile'],
  'Procurement Manager':  ['dashboard', 'catalog', 'orders', 'tickets', 'profile'],
  'Brewery Engineer':     ['dashboard', 'catalog', 'tickets', 'orders', 'profile'],
}
const NAV_META: { id: Screen; label: string; icon: React.ReactNode }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <svg width="15" height="15" viewBox="0 0 20 20" fill="currentColor"><rect x="2" y="2" width="7" height="7" rx="1.5"/><rect x="11" y="2" width="7" height="7" rx="1.5"/><rect x="2" y="11" width="7" height="7" rx="1.5"/><rect x="11" y="11" width="7" height="7" rx="1.5"/></svg> },
  { id: 'catalog',   label: 'Spare Parts',    icon: <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 3l-5 5 2 2-2 2 5 5 2-2 2 2 5-5-2-2 2-2L14 3l-2 2-2-2z"/></svg> },
  { id: 'tickets',   label: 'Service Tickets', icon: <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="4" width="14" height="13" rx="2"/><path d="M7 4V3M13 4V3M3 9h14"/></svg> },
  { id: 'orders',    label: 'Orders',         icon: <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 2h8l2 5H4L6 2z"/><rect x="2" y="7" width="16" height="11" rx="1.5"/></svg> },
  { id: 'admin',     label: 'Admin',          icon: <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="10" cy="7" r="3"/><path d="M4 17c0-3.3 2.7-6 6-6s6 2.7 6 6"/></svg> },
  { id: 'profile',   label: 'Profile',        icon: <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="10" cy="8" r="3"/><rect x="3" y="14" width="14" height="4" rx="2"/></svg> },
]

// ─── TOAST SYSTEM ─────────────────────────────────────────────────────────
function ToastContainer({ toasts, dismiss }: { toasts: Toast[]; dismiss: (id: string) => void }) {
  return (
    <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 1000, display: 'flex', flexDirection: 'column', gap: 8, pointerEvents: 'none' }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          background: t.type === 'success' ? '#003366' : t.type === 'error' ? '#EF4444' : '#0055A4',
          color: '#fff', padding: '10px 16px', borderRadius: 4, fontSize: 13.5, fontWeight: 600,
          boxShadow: '0 4px 20px rgba(0,0,0,0.25)', display: 'flex', alignItems: 'center', gap: 10,
          animation: 'slideInRight 0.25s ease',
          pointerEvents: 'all', maxWidth: 340,
          borderLeft: `3px solid ${t.type === 'success' ? '#10B981' : t.type === 'error' ? '#fca5a5' : '#7dd3fc'}`,
        }}>
          <span style={{ fontSize: 16 }}>{t.type === 'success' ? '✓' : t.type === 'error' ? '✕' : 'ℹ'}</span>
          <span style={{ flex: 1 }}>{t.message}</span>
          <button onClick={() => dismiss(t.id)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: 14, padding: 0 }}>✕</button>
        </div>
      ))}
      <style>{`@keyframes slideInRight { from { transform: translateX(40px); opacity: 0; } to { transform: none; opacity: 1; } }`}</style>
    </div>
  )
}

// ─── SIDEBAR ──────────────────────────────────────────────────────────────
function Sidebar({ user, active, onNav, onLogout }: { user: AuthUser; active: Screen; onNav: (s: Screen) => void; onLogout: () => void }) {
  const allowed = ROLE_NAV[user.role]
  const visibleNav = NAV_META.filter(n => allowed.includes(n.id) && n.id !== 'profile')
  const initials = user.name.split(' ').map(n => n[0]).join('').slice(0, 2)

  return (
    <aside style={{ background: '#001f3f', width: 216, minWidth: 216, display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '18px 20px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ background: '#FF6600', borderRadius: 5, padding: '6px 8px', lineHeight: 1 }}>
            <svg width="18" height="14" viewBox="0 0 18 14" fill="white">
              <rect x="0" y="0" width="18" height="3.5" rx="1.5"/>
              <rect x="0" y="5.5" width="11" height="3.5" rx="1.5"/>
              <rect x="0" y="10.5" width="18" height="3.5" rx="1.5"/>
            </svg>
          </div>
          <div>
            <div style={{ color: '#fff', fontWeight: 900, fontSize: 15, letterSpacing: '-0.02em', lineHeight: 1.1 }}>miho</div>
            <div style={{ color: '#5a7e9a', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Staff Portal</div>
          </div>
        </div>
      </div>

      {/* Role badge */}
      <div style={{ padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <span style={{
          fontSize: 10.5, fontWeight: 700, padding: '3px 8px', borderRadius: 3,
          background: user.role === 'Miho Admin' ? 'rgba(255,102,0,0.2)' : 'rgba(0,85,164,0.3)',
          color: user.role === 'Miho Admin' ? '#FF6600' : '#7fa8cc',
          letterSpacing: '0.04em', textTransform: 'uppercase'
        }}>{user.role}</span>
      </div>

      <nav style={{ flex: 1, padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {visibleNav.map(item => (
          <button key={item.id} onClick={() => onNav(item.id)}
            className={`sidebar-link ${active === item.id ? 'active' : ''}`}>
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '12px 14px' }}>
        <button onClick={() => onNav('profile')}
          style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', background: active === 'profile' ? 'rgba(0,85,164,0.5)' : 'none', border: 'none', cursor: 'pointer', padding: '8px 10px', borderRadius: 4, transition: 'background 0.15s' }}>
          <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#0055A4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{initials}</div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ color: '#fff', fontSize: 12.5, fontWeight: 600, lineHeight: 1.2 }}>{user.name}</div>
            <div style={{ color: '#5a7e9a', fontSize: 11 }}>{user.plant}</div>
          </div>
        </button>
        <button onClick={onLogout}
          style={{ width: '100%', marginTop: 6, background: 'none', border: 'none', cursor: 'pointer', color: '#5a7e9a', fontSize: 12, fontWeight: 500, padding: '6px 10px', borderRadius: 4, textAlign: 'left', transition: 'color 0.15s' }}
          onMouseOver={e => (e.currentTarget.style.color = '#fff')}
          onMouseOut={e => (e.currentTarget.style.color = '#5a7e9a')}>
          Sign Out →
        </button>
      </div>
    </aside>
  )
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────
function Dashboard({
  user,
  addToast,
  onNav,
  tickets,
  onCreateTicket,
}: {
  user: AuthUser
  addToast: (m: string, t?: 'success' | 'error' | 'info') => void
  onNav: (s: Screen) => void
  tickets: Ticket[]
  onCreateTicket: (input: { machine: string; desc: string; priority: Ticket['priority'] }) => void
}) {
  const [emergencyOpen, setEmergencyOpen] = useState(false)
  const [newTicketMachine, setNewTicketMachine] = useState('miho EC-Cam')
  const [newTicketDesc, setNewTicketDesc] = useState('')
  const [newTicketPriority, setNewTicketPriority] = useState<Ticket['priority']>('Critical')

  const machines = [
    { name: 'miho David 2', type: 'Empty Bottle Inspector', status: 'OK' as const, uptime: '98.2%', lastService: '2026-08-14' },
    { name: 'miho EC-Cam', type: 'Label Inspection', status: 'WARN' as const, uptime: '91.7%', lastService: '2026-07-22', fault: 'EAN Read Error' },
    { name: 'miho Gauss 2U', type: 'Metal Detection', status: 'OK' as const, uptime: '99.1%', lastService: '2026-09-01' },
    { name: 'miho TOP-Cam', type: 'Closure Inspection', status: 'OK' as const, uptime: '97.8%', lastService: '2026-08-28' },
  ]
  const services = [
    { title: 'Annual Overhaul', machine: 'miho Gauss 2U', date: 'Oct 12, 2026', type: 'Annual Overhaul', priority: 'Scheduled' },
    { title: 'Calibration Service', machine: 'miho David 2', date: 'Oct 20, 2026', type: 'Routine Maintenance', priority: 'Scheduled' },
    { title: 'Software Update', machine: 'miho EC-Cam', date: 'Sep 30, 2026', type: 'Validations', priority: 'Urgent' },
  ]

  const submitEmergency = () => {
    if (!newTicketDesc) { addToast('Please describe the fault', 'error'); return }
    onCreateTicket({ machine: newTicketMachine, desc: newTicketDesc, priority: newTicketPriority })
    addToast('Emergency ticket created — team notified', 'success')
    setEmergencyOpen(false)
    setNewTicketMachine('miho EC-Cam')
    setNewTicketDesc('')
    setNewTicketPriority('Critical')
    onNav('tickets')
  }

  const latestTicketId = tickets[0]?.id ?? 'T-0091'

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#003366', letterSpacing: '-0.02em' }}>NBC Lagos Plant</h1>
          <p style={{ fontSize: 13, color: '#5a7184', marginTop: 2 }}>Nigerian Bottling Company · Plant ID: NBC-LAG-001 · Line 3 & Line 5</p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div className="card" style={{ padding: '7px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981', display: 'inline-block' }}></span>
            <span style={{ fontSize: 12.5, fontWeight: 600, color: '#065f46' }}>4 Online</span>
            <span style={{ fontSize: 12, color: '#5a7184' }}>| 1 Warning</span>
          </div>
          <button className="btn-danger" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', fontSize: 13 }} onClick={() => setEmergencyOpen(true)}>
            <span>⚠</span> Emergency Intervention
          </button>
        </div>
      </div>

      {/* Machine Cards */}
      <section>
        <h2 style={{ fontSize: 13.5, fontWeight: 700, color: '#003366', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Active Machine Status</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
          {machines.map(m => (
            <div key={m.name} className="card" style={{ padding: '14px 16px', cursor: 'pointer', transition: 'box-shadow 0.15s' }}
              onMouseOver={e => (e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,51,102,0.12)')}
              onMouseOut={e => (e.currentTarget.style.boxShadow = '')}
              onClick={() => { addToast(`Review ${m.name} in Service Tickets`, 'info'); onNav('tickets') }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13.5, color: '#003366' }}>{m.name}</div>
                  <div style={{ fontSize: 12, color: '#5a7184', marginTop: 1 }}>{m.type}</div>
                </div>
                <span className={m.status === 'OK' ? 'status-ok' : 'status-warn'} style={{ fontSize: 11, padding: '2px 8px', borderRadius: 3, fontWeight: 700 }}>{m.status}</span>
              </div>
              {(m as {fault?: string}).fault && (
                <div style={{ background: '#fef3c7', border: '1px solid #fcd34d', borderRadius: 3, padding: '4px 8px', marginBottom: 8, fontSize: 11.5, color: '#92400e', fontWeight: 600 }}>
                  ⚠ Fault: {(m as {fault?: string}).fault}
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
                <div>
                  <div style={{ fontSize: 10.5, color: '#8fa3b3', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Uptime</div>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 17, fontWeight: 700, color: m.status === 'WARN' ? '#d97706' : '#003366' }}>{m.uptime}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 10.5, color: '#8fa3b3', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Last Service</div>
                  <div style={{ fontSize: 12.5, fontWeight: 500, color: '#4a6278' }}>{m.lastService}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16 }}>
        {/* Services Table */}
        <section className="card">
          <div style={{ padding: '12px 18px', borderBottom: '1px solid #eef1f5', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ fontSize: 13.5, fontWeight: 700, color: '#003366' }}>Upcoming Services</h2>
            <button className="btn-ghost" style={{ fontSize: 12 }} onClick={() => onNav('calendar')}>View Calendar</button>
          </div>
          <table className="data-table w-full">
            <thead><tr><th>Service</th><th>Machine</th><th>Date</th><th>Priority</th></tr></thead>
            <tbody>
              {services.map((s, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600, color: '#003366' }}>{s.title}</td>
                  <td style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#0055A4' }}>{s.machine}</td>
                  <td style={{ color: '#4a6278', fontSize: 12.5 }}>📅 {s.date}</td>
                  <td><span style={{ fontSize: 11.5, padding: '2px 8px', borderRadius: 3, fontWeight: 600, background: s.priority === 'Urgent' ? '#fee2e2' : '#f0fdf4', color: s.priority === 'Urgent' ? '#991b1b' : '#166534' }}>{s.priority}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Quick Actions */}
        <section className="card" style={{ padding: '14px 18px' }}>
          <h2 style={{ fontSize: 13.5, fontWeight: 700, color: '#003366', marginBottom: 14 }}>Quick Actions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            <button className="btn-danger w-full" style={{ padding: '11px 16px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }} onClick={() => setEmergencyOpen(true)}>
              <span>🚨</span> Raise Emergency Ticket
            </button>
            <button className="btn-primary w-full" style={{ padding: '11px 16px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }} onClick={() => onNav('catalog')}>
              <span>⚙</span> Request Spare Parts
            </button>
            <button className="btn-ghost w-full" style={{ padding: '11px 16px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }} onClick={() => onNav('calendar')}>
              <span>📅</span> View Maintenance Calendar
            </button>
          </div>
          <div style={{ marginTop: 16, borderTop: '1px solid #eef1f5', paddingTop: 14 }}>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: '#5a7184', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Recent Activity</div>
            {[
              { action: `${latestTicketId} opened`, time: '14 min ago', color: '#EF4444' },
              { action: 'Parts order PO-2341 shipped', time: '2 hr ago', color: '#10B981' },
              { action: 'miho EC-Cam fault logged', time: '3 hr ago', color: '#F59E0B' },
            ].map((a, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: a.color, marginTop: 5, flexShrink: 0 }}></span>
                <div>
                  <div style={{ fontSize: 12.5, color: '#2c3e50' }}>{a.action}</div>
                  <div style={{ fontSize: 11, color: '#8fa3b3' }}>{a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Emergency Modal */}
      {emergencyOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }} onClick={() => setEmergencyOpen(false)}>
          <div className="card" style={{ width: 440, padding: 28 }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <div style={{ background: '#fee2e2', borderRadius: 8, padding: 8, fontSize: 20 }}>🚨</div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 16, color: '#991b1b' }}>Emergency Intervention</div>
                  <div style={{ fontSize: 12, color: '#5a7184' }}>NBC Lagos Plant · Line-Down Protocol</div>
                </div>
              </div>
              <button onClick={() => setEmergencyOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8fa3b3', fontSize: 18 }}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#4a6278', display: 'block', marginBottom: 4 }}>Affected Machine <span style={{ color: '#EF4444' }}>*</span></label>
                <select className="form-input" value={newTicketMachine} onChange={e => setNewTicketMachine(e.target.value)}>
                  {['miho EC-Cam (Label Insp.) — WARN', 'miho David 2 (Empty Bottle)', 'miho Gauss 2U (Metal Detection)', 'miho TOP-Cam (Closure Insp.)'].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#4a6278', display: 'block', marginBottom: 4 }}>Fault Description <span style={{ color: '#EF4444' }}>*</span></label>
                <textarea className="form-input" rows={3} placeholder="Describe the fault and production impact..." value={newTicketDesc} onChange={e => setNewTicketDesc(e.target.value)} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#4a6278', display: 'block', marginBottom: 4 }}>Priority</label>
                  <select className="form-input" value={newTicketPriority} onChange={e => setNewTicketPriority(e.target.value as Ticket['priority'])}>
                    <option value="Critical">Critical — Line Down</option>
                    <option value="High">High — Degraded Performance</option>
                    <option value="Normal">Normal — Planned</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
              <button className="btn-danger" style={{ flex: 1 }} onClick={submitEmergency}>Submit Emergency Ticket</button>
              <button className="btn-ghost" onClick={() => setEmergencyOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── CATALOG ──────────────────────────────────────────────────────────────
function Catalog({
  addToast,
  catalogItems,
  rfqItems,
  onToggleRfqItem,
  onNav,
}: {
  addToast: (m: string, t?: 'success' | 'error' | 'info') => void
  catalogItems: CatalogItem[]
  rfqItems: RfqLineItem[]
  onToggleRfqItem: (item: CatalogItem) => void
  onNav: (screen: Screen) => void
}) {
  const [search, setSearch] = useState('')
  const [activeFilters, setActiveFilters] = useState<string[]>([])

  const chips = ['Filler', 'Labeler', 'Inspector', 'In Stock', 'Backordered']
  const toggleFilter = (f: string) => setActiveFilters(p => p.includes(f) ? p.filter(x => x !== f) : [...p, f])
  const toggleRfq = (id: string, name: string) => {
    const item = catalogItems.find(part => part.id === id)
    if (!item) return
    const isIn = rfqItems.some(part => part.id === id)
    onToggleRfqItem(item)
    addToast(isIn ? `Removed from RFQ` : `${name.split('—')[0].trim()} added to RFQ`, isIn ? 'info' : 'success')
  }

  const filtered = catalogItems.filter(p => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase())
    const matchFilter = activeFilters.length === 0 || activeFilters.some(f => p.category === f || p.stock === f)
    return matchSearch && matchFilter
  })

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#003366', letterSpacing: '-0.02em' }}>Spare Parts Catalog</h1>
          <p style={{ fontSize: 13, color: '#5a7184', marginTop: 2 }}>OEM parts for miho inspection and filling systems</p>
        </div>
        {rfqItems.length > 0 && (
          <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 6 }} onClick={() => onNav('rfq-cart')}>
            🛒 RFQ Cart ({rfqItems.length})
          </button>
        )}
      </div>

      <div className="card" style={{ padding: '14px 18px' }}>
        <div style={{ position: 'relative', marginBottom: 12 }}>
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#8fa3b3' }}>🔍</span>
          <input className="form-input" style={{ paddingLeft: 34, fontSize: 14 }} placeholder="Search OEM Part No. or Keyword..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: '#5a7184' }}>Filter:</span>
          {chips.map(c => (
            <button key={c} onClick={() => toggleFilter(c)} className={`filter-chip ${activeFilters.includes(c) ? 'active' : ''}`}>{c}</button>
          ))}
          {activeFilters.length > 0 && <button onClick={() => setActiveFilters([])} style={{ fontSize: 12, color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Clear</button>}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#8fa3b3' }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>🔍</div>
          <div style={{ fontSize: 14, fontWeight: 600 }}>No parts found matching "{search}"</div>
          <div style={{ fontSize: 13, marginTop: 4 }}>Try different keywords or clear the filters</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: 16 }}>
          {filtered.map(part => (
            <div key={part.id} className="card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <div style={{ height: 170, background: '#f0f4f8', overflow: 'hidden', position: 'relative' }}>
                <img src={part.img} alt={part.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', top: 8, right: 8 }}>
                  <span className={part.stock === 'In Stock' ? 'status-instock' : 'status-backorder'} style={{ fontSize: 11, padding: '2px 8px', borderRadius: 3, fontWeight: 700 }}>{part.stock}</span>
                </div>
              </div>
              <div style={{ padding: '14px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: '#003366', lineHeight: 1.3 }}>{part.name}</div>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11.5, color: '#0055A4', marginTop: 2 }}>PN: {part.id}</div>
                </div>
                <p style={{ fontSize: 12.5, color: '#4a6278', lineHeight: 1.5, flex: 1 }}>{part.desc}</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 10, borderTop: '1px solid #eef1f5' }}>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 17, fontWeight: 800, color: '#003366' }}>{part.price}</div>
                  <button onClick={() => toggleRfq(part.id, part.name)} className={rfqItems.some(item => item.id === part.id) ? 'btn-ghost' : 'btn-primary'} style={{ fontSize: 12.5, padding: '7px 14px' }}>
                    {rfqItems.some(item => item.id === part.id) ? '✓ In RFQ' : 'Add to RFQ'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── TICKETS ─────────────────────────────────────────────────────────────
function Tickets({
  addToast,
  tickets,
  onTicketDetail,
  onCreateTicket,
}: {
  addToast: (m: string, t?: 'success' | 'error' | 'info') => void
  tickets: Ticket[]
  onTicketDetail: (t: Ticket) => void
  onCreateTicket: (input: { machine: string; desc: string; priority: Ticket['priority'] }) => void
}) {
  const [showNew, setShowNew] = useState(false)
  const [filter, setFilter] = useState('All')
  const [form, setForm] = useState({ machine: 'miho EC-Cam', desc: '', priority: 'Critical' })

  const filtered = tickets.filter(t => filter === 'All' || t.status === filter)

  const submitNew = () => {
    if (!form.desc) { addToast('Please describe the fault', 'error'); return }
    onCreateTicket({ machine: form.machine, desc: form.desc, priority: form.priority as Ticket['priority'] })
    addToast('Emergency ticket created — field team notified', 'success')
    setShowNew(false)
    setForm({ machine: 'miho EC-Cam', desc: '', priority: 'Critical' })
  }

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#003366', letterSpacing: '-0.02em' }}>Service Tickets</h1>
          <p style={{ fontSize: 13, color: '#5a7184', marginTop: 2 }}>NBC Lagos Plant — all service requests</p>
        </div>
        <button className="btn-danger" style={{ display: 'flex', alignItems: 'center', gap: 6 }} onClick={() => setShowNew(true)}>+ Raise Emergency Ticket</button>
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        {['All', 'Open', 'In Progress', 'Closed'].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`filter-chip ${filter === f ? 'active' : ''}`}>{f}</button>
        ))}
      </div>

      <div className="card">
        <table className="data-table w-full">
          <thead><tr><th>Ticket ID</th><th>Machine</th><th>Type</th><th>Status</th><th>Priority</th><th>Date</th><th>Description</th></tr></thead>
          <tbody>
            {filtered.map(t => (
              <tr key={t.id} onClick={() => onTicketDetail(t)} style={{ cursor: 'pointer' }}>
                <td><span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#0055A4', fontWeight: 700, fontSize: 12.5 }}>{t.id}</span></td>
                <td style={{ fontWeight: 600, color: '#003366' }}>{t.machine}</td>
                <td><span style={{ fontSize: 12, background: '#eff6ff', color: '#1d4ed8', padding: '2px 8px', borderRadius: 3 }}>{t.type}</span></td>
                <td><span style={{ fontSize: 12, padding: '3px 9px', borderRadius: 3, fontWeight: 600, background: t.status === 'Open' ? '#fee2e2' : t.status === 'In Progress' ? '#fef3c7' : '#f0fdf4', color: t.status === 'Open' ? '#991b1b' : t.status === 'In Progress' ? '#92400e' : '#166534' }}>{t.status}</span></td>
                <td><span style={{ fontSize: 11.5, padding: '2px 8px', borderRadius: 3, fontWeight: 600, background: t.priority === 'Critical' ? '#FF6600' : '#e2e8f0', color: t.priority === 'Critical' ? '#fff' : '#4a6278' }}>{t.priority}</span></td>
                <td style={{ color: '#5a7184', fontSize: 12.5 }}>{t.date}</td>
                <td style={{ color: '#4a6278', fontSize: 12.5, maxWidth: 260 }}>{t.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showNew && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }} onClick={() => setShowNew(false)}>
          <div className="card" style={{ width: 440, padding: 26 }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <div style={{ fontWeight: 800, fontSize: 16, color: '#991b1b' }}>🚨 Raise Emergency Ticket</div>
              <button onClick={() => setShowNew(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8fa3b3', fontSize: 18 }}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#4a6278', display: 'block', marginBottom: 4 }}>Affected Machine <span style={{ color: '#EF4444' }}>*</span></label>
                <select className="form-input" value={form.machine} onChange={e => setForm(p => ({ ...p, machine: e.target.value }))}>
                  {['miho EC-Cam', 'miho David 2', 'miho Gauss 2U', 'miho TOP-Cam', 'miho Newton X2P'].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#4a6278', display: 'block', marginBottom: 4 }}>Fault Description <span style={{ color: '#EF4444' }}>*</span></label>
                <textarea className="form-input" rows={3} placeholder="Describe fault and production impact..." value={form.desc} onChange={e => setForm(p => ({ ...p, desc: e.target.value }))} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#4a6278', display: 'block', marginBottom: 4 }}>Priority</label>
                <select className="form-input" value={form.priority} onChange={e => setForm(p => ({ ...p, priority: e.target.value }))}>
                  <option value="Critical">Critical — Line Down</option>
                  <option value="High">High — Degraded Performance</option>
                  <option value="Normal">Normal — Planned</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 18 }}>
              <button className="btn-danger" style={{ flex: 1 }} onClick={submitNew}>Submit Ticket</button>
              <button className="btn-ghost" onClick={() => setShowNew(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── TICKET DETAIL ────────────────────────────────────────────────────────
function TicketDetail({
  ticket,
  onBack,
  addToast,
  onUpdateTicket,
  onAddComment,
}: {
  ticket: Ticket
  onBack: () => void
  addToast: (m: string, t?: 'success' | 'error' | 'info') => void
  onUpdateTicket: (id: string, updates: Partial<Ticket>) => void
  onAddComment: (id: string, text: string, user: string, time: string) => void
}) {
  const [comment, setComment] = useState('')
  const comments = ticket.comments || []

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
      <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#0055A4', fontSize: 13.5, fontWeight: 600, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 4 }}>
        ← Back to Tickets
      </button>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card" style={{ padding: '20px 24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 13, color: '#0055A4', fontWeight: 700, marginBottom: 4 }}>{ticket.id}</div>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: '#003366', marginBottom: 4 }}>{ticket.type}</h2>
                <div style={{ fontSize: 13, color: '#5a7184' }}>{ticket.machine} · {ticket.date}</div>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={{ fontSize: 12, padding: '3px 10px', borderRadius: 3, fontWeight: 700, background: ticket.priority === 'Critical' ? '#FF6600' : '#e2e8f0', color: ticket.priority === 'Critical' ? '#fff' : '#4a6278' }}>{ticket.priority}</span>
                <select className="form-input" style={{ fontSize: 12.5, padding: '5px 10px', width: 'auto' }} value={ticket.status} onChange={e => { onUpdateTicket(ticket.id, { status: e.target.value as Ticket['status'] }); addToast(`Status updated to ${e.target.value}`, 'success') }}>
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
            </div>
            <div style={{ background: '#f8fafc', borderRadius: 4, padding: '12px 16px', fontSize: 13.5, color: '#2c3e50', lineHeight: 1.6 }}>{ticket.desc}</div>
          </div>

          {/* Timeline */}
          <div className="card" style={{ padding: '18px 22px' }}>
            <div style={{ fontWeight: 700, fontSize: 13.5, color: '#003366', marginBottom: 14 }}>Activity Timeline</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {(ticket.timeline || []).map((e, i) => (
                <div key={i} style={{ display: 'flex', gap: 14, paddingBottom: 16 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#0055A4', flexShrink: 0, marginTop: 4 }}></div>
                    {i < (ticket.timeline || []).length - 1 && <div style={{ width: 2, flex: 1, background: '#eef1f5', marginTop: 4 }}></div>}
                  </div>
                  <div style={{ flex: 1, paddingBottom: 8 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#2c3e50' }}>{e.event}</div>
                    <div style={{ fontSize: 11.5, color: '#8fa3b3', marginTop: 2 }}>{e.user} · {e.time}</div>
                  </div>
                </div>
              ))}
              {comments.map((c, i) => (
                <div key={`c-${i}`} style={{ display: 'flex', gap: 14, paddingBottom: 16 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10B981', flexShrink: 0, marginTop: 4 }}></div>
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#2c3e50' }}>Comment added</div>
                    <div style={{ fontSize: 12.5, color: '#4a6278', marginTop: 2 }}>{c.text}</div>
                    <div style={{ fontSize: 11.5, color: '#8fa3b3', marginTop: 2 }}>{c.user} · {c.time}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ borderTop: '1px solid #eef1f5', paddingTop: 14, marginTop: 4 }}>
              <textarea className="form-input" rows={2} placeholder="Add a comment or update..." value={comment} onChange={e => setComment(e.target.value)} />
              <button className="btn-primary mt-2" style={{ fontSize: 12.5 }} onClick={() => {
                if (!comment) return
                onAddComment(ticket.id, comment, 'You', new Date().toTimeString().slice(0, 5))
                addToast('Comment added', 'success')
                setComment('')
              }}>Add Comment</button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="card" style={{ padding: '16px 18px' }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: '#003366', marginBottom: 12 }}>Ticket Details</div>
            {[
              { label: 'Machine', value: ticket.machine },
              { label: 'Type', value: ticket.type },
              { label: 'Priority', value: ticket.priority },
              { label: 'Date Created', value: ticket.date },
              { label: 'Assignee', value: ticket.assignee || 'Tunde Akinola' },
            ].map(d => (
              <div key={d.label} style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 11, color: '#8fa3b3', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>{d.label}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#2c3e50' }}>{d.value}</div>
              </div>
            ))}
          </div>
          <div className="card" style={{ padding: '16px 18px' }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: '#003366', marginBottom: 12 }}>Actions</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button className="btn-primary w-full" style={{ fontSize: 12.5 }} onClick={() => addToast('Engineer assigned', 'success')}>Assign Engineer</button>
              <button className="btn-ghost w-full" style={{ fontSize: 12.5 }} onClick={() => addToast('Spare parts request created', 'success')}>Order Spare Parts</button>
              <button className="btn-ghost w-full" style={{ fontSize: 12.5 }} onClick={() => addToast('PDF ticket exported', 'info')}>📄 Export PDF</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── ORDERS ───────────────────────────────────────────────────────────────
function Orders({ addToast, orders }: { addToast: (m: string, t?: 'success' | 'error' | 'info') => void; orders: Order[] }) {
  const [filter, setFilter] = useState('All')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const filtered = orders.filter(o => filter === 'All' || o.status === filter)
  const formatStatus = (status: Order['status']) => {
    if (status === 'Pending Approval') return { background: '#fef3c7', color: '#92400e' }
    if (status === 'Shipped') return { background: '#eff6ff', color: '#1d4ed8' }
    if (status === 'Processing') return { background: '#fef3c7', color: '#92400e' }
    return { background: '#f0fdf4', color: '#166534' }
  }
  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h1 style={{ fontSize: 22, fontWeight: 800, color: '#003366', letterSpacing: '-0.02em' }}>Orders</h1>
      <div style={{ display: 'flex', gap: 8 }}>
        {['All', 'Pending Approval', 'Shipped', 'Processing', 'Delivered'].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`filter-chip ${filter === f ? 'active' : ''}`}>{f}</button>
        ))}
      </div>
      <div className="card">
        <table className="data-table w-full">
          <thead><tr><th>Order ID</th><th>Client</th><th>Items</th><th>Status</th><th>Order Date</th><th>Actions</th></tr></thead>
          <tbody>
            {filtered.map(o => (
              <tr key={o.id}>
                <td><span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#0055A4', fontWeight: 700 }}>{o.id}</span></td>
                <td style={{ color: '#4a6278' }}>{o.client}</td>
                <td style={{ color: '#4a6278' }}>{o.items.length} lines</td>
                <td><span style={{ fontSize: 12, padding: '3px 9px', borderRadius: 3, fontWeight: 600, background: formatStatus(o.status).background, color: formatStatus(o.status).color }}>{o.status}</span></td>
                <td style={{ color: '#5a7184' }}>{o.createdAt}</td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn-ghost" style={{ fontSize: 11.5, padding: '4px 10px' }} onClick={() => setSelectedOrder(o)}>View</button>
                    <button className="btn-ghost" style={{ fontSize: 11.5, padding: '4px 10px' }} onClick={() => addToast(`Downloading PDF for ${o.id}...`, 'info')}>📄 PDF</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!selectedOrder && filtered.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '52px 20px', color: '#8fa3b3' }}>
          <div style={{ fontSize: 36, marginBottom: 10 }}>📦</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#5a7184' }}>No orders match this filter.</div>
          <div style={{ marginTop: 4, fontSize: 13 }}>Create an RFQ or admin order to populate this view.</div>
        </div>
      )}

      {selectedOrder && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 60 }} onClick={() => setSelectedOrder(null)}>
          <div className="card" style={{ width: 'min(720px, calc(100vw - 32px))', padding: 24 }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
              <div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 13, color: '#0055A4', fontWeight: 700 }}>{selectedOrder.id}</div>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: '#003366', marginTop: 2 }}>{selectedOrder.client}</h2>
                <div style={{ fontSize: 13, color: '#5a7184' }}>{selectedOrder.contact} · {selectedOrder.createdAt}</div>
              </div>
              <button onClick={() => setSelectedOrder(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8fa3b3', fontSize: 18 }}>✕</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.9fr', gap: 20 }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#5a7184', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Line Items</div>
                <div className="card" style={{ overflow: 'hidden' }}>
                  <table className="data-table w-full">
                    <thead><tr><th>Item</th><th>Qty</th><th>Price</th></tr></thead>
                    <tbody>
                      {selectedOrder.items.map(item => (
                        <tr key={item.id}>
                          <td style={{ color: '#003366', fontWeight: 600 }}>{item.name}</td>
                          <td>{item.qty}</td>
                          <td className="mono">{item.price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="card" style={{ padding: 16, background: '#fafbfc' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#5a7184', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Summary</div>
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 11, color: '#8fa3b3', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Status</div>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: '#003366' }}>{selectedOrder.status}</div>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 11, color: '#8fa3b3', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Delivery Address</div>
                  <div style={{ fontSize: 13, color: '#2c3e50' }}>{selectedOrder.deliveryAddress || '—'}</div>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 11, color: '#8fa3b3', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Tracking</div>
                  <div style={{ fontSize: 13, color: '#2c3e50' }}>{selectedOrder.trackingInfo || 'Not assigned'}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: '#8fa3b3', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Notes</div>
                  <div style={{ fontSize: 13, color: '#2c3e50', lineHeight: 1.5 }}>{selectedOrder.notes}</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 8, marginTop: 16 }}>
                  <button className="btn-primary w-full" style={{ fontSize: 12.5 }} onClick={() => addToast(`Order ${selectedOrder.id} marked for follow-up`, 'success')}>Mark for Follow-up</button>
                  <button className="btn-ghost w-full" style={{ fontSize: 12.5 }} onClick={() => addToast(`Tracking refresh requested for ${selectedOrder.id}`, 'info')}>Refresh Tracking</button>
                  <button className="btn-ghost w-full" style={{ fontSize: 12.5 }} onClick={() => addToast(`Copying ${selectedOrder.id}...`, 'info')}>Copy Order ID</button>
                  <button className="btn-ghost w-full" style={{ fontSize: 12.5 }} onClick={() => addToast(`Escalation note opened for ${selectedOrder.id}`, 'info')}>Escalate Issue</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── CALENDAR ─────────────────────────────────────────────────────────────
function Calendar({ onBack }: { onBack: () => void }) {
  const [month] = useState(new Date(2026, 9, 1))
  const events: Record<number, { label: string; type: string; color: string }[]> = {
    12: [{ label: 'Annual Overhaul: miho Gauss 2U', type: 'overhaul', color: '#FF6600' }],
    20: [{ label: 'Calibration: miho David 2', type: 'maintenance', color: '#3b82f6' }],
    30: [{ label: 'SW Update: miho EC-Cam', type: 'validation', color: '#8b5cf6' }],
    5:  [{ label: 'PM Check: miho TOP-Cam', type: 'maintenance', color: '#3b82f6' }],
  }
  const days = Array.from({ length: 31 }, (_, i) => i + 1)
  const startDay = new Date(2026, 9, 1).getDay()

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
      <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#0055A4', fontSize: 13.5, fontWeight: 600, marginBottom: 16 }}>← Back</button>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#003366' }}>Maintenance Calendar — October 2026</h1>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: 12, flexWrap: 'wrap' }}>
          {[{ color: '#EF4444', label: 'Emergency' }, { color: '#3b82f6', label: 'Maintenance' }, { color: '#FF6600', label: 'Overhaul' }, { color: '#8b5cf6', label: 'Validation' }].map(l => (
            <div key={l.label} style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: l.color, flexShrink: 0 }}></span>
              <span style={{ color: '#5a7184' }}>{l.label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="card" style={{ padding: 20 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, marginBottom: 4 }}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} style={{ textAlign: 'center', fontSize: 11, fontWeight: 700, color: '#8fa3b3', padding: '6px 0', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{d}</div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 3 }}>
          {Array.from({ length: startDay }, (_, i) => <div key={`e-${i}`} />)}
          {days.map(d => (
            <div key={d} style={{ minHeight: 80, border: '1px solid #eef1f5', borderRadius: 4, padding: '6px 8px', background: events[d] ? '#fffbf5' : '#fafbfc' }}>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: '#003366', marginBottom: 4 }}>{d}</div>
              {(events[d] || []).map((e, i) => (
                <div key={i} style={{ fontSize: 10.5, background: e.color, color: '#fff', borderRadius: 2, padding: '2px 5px', marginBottom: 2, lineHeight: 1.3, fontWeight: 600 }}>{e.label}</div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── PROFILE / SETTINGS ───────────────────────────────────────────────────
function Profile({ user, addToast }: { user: AuthUser; addToast: (m: string, t?: 'success' | 'error' | 'info') => void }) {
  const [profileTab, setProfileTab] = useState<'profile' | 'security' | 'notifications' | 'preferences'>('profile')
  const [name, setName] = useState(user.name)
  const [phone, setPhone] = useState(user.phone)
  const [twoFA, setTwoFA] = useState(false)
  const [notifs, setNotifs] = useState({ emailAlerts: true, smsAlerts: false, ticketUpdates: true, orderUpdates: true })
  const nameInputRef = useRef<HTMLInputElement | null>(null)
  const initials = user.name.split(' ').map(n => n[0]).join('').slice(0, 2)

  const tabs = ['profile', 'security', 'notifications', 'preferences'] as const

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
      <h1 style={{ fontSize: 22, fontWeight: 800, color: '#003366', letterSpacing: '-0.02em', marginBottom: 20 }}>Profile & Settings</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 20 }}>
        {/* Left card */}
        <div>
          <div className="card" style={{ padding: '24px 20px', textAlign: 'center', marginBottom: 12 }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#003366', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 22, fontWeight: 800, margin: '0 auto 12px' }}>{initials}</div>
            <div style={{ fontWeight: 700, fontSize: 14, color: '#003366' }}>{user.name}</div>
            <div style={{ fontSize: 12, color: '#5a7184', marginTop: 2 }}>{user.email}</div>
            <div style={{ fontSize: 11.5, padding: '3px 10px', borderRadius: 20, background: '#eff6ff', color: '#1d4ed8', fontWeight: 600, marginTop: 10, display: 'inline-block' }}>{user.role}</div>
            <button className="btn-ghost w-full mt-4" style={{ fontSize: 12 }} onClick={() => { setProfileTab('profile'); nameInputRef.current?.focus(); addToast('Profile name field focused', 'info') }}>Edit Profile Details</button>
          </div>
          <div className="card" style={{ overflow: 'hidden' }}>
            {tabs.map(t => (
              <button key={t} onClick={() => setProfileTab(t)}
                style={{ display: 'block', width: '100%', padding: '11px 18px', textAlign: 'left', fontSize: 13, fontWeight: 600, background: profileTab === t ? '#eff6ff' : 'none', border: 'none', borderLeft: profileTab === t ? '3px solid #0055A4' : '3px solid transparent', cursor: 'pointer', color: profileTab === t ? '#0055A4' : '#4a6278', textTransform: 'capitalize' }}>
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Right content */}
        <div>
          {profileTab === 'profile' && (
            <div className="card" style={{ padding: '22px 24px' }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: '#003366', marginBottom: 18 }}>Personal Information</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#4a6278', display: 'block', marginBottom: 4 }}>Full Name</label>
                  <input ref={nameInputRef} className="form-input" value={name} onChange={e => setName(e.target.value)} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#4a6278', display: 'block', marginBottom: 4 }}>Email</label>
                  <input className="form-input" value={user.email} readOnly style={{ background: '#f8fafc', color: '#8fa3b3' }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#4a6278', display: 'block', marginBottom: 4 }}>Phone</label>
                  <input className="form-input" value={phone} onChange={e => setPhone(e.target.value)} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#4a6278', display: 'block', marginBottom: 4 }}>Plant Assignment</label>
                  <input className="form-input" value={user.plant} readOnly style={{ background: '#f8fafc', color: '#8fa3b3' }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#4a6278', display: 'block', marginBottom: 4 }}>Role (read-only)</label>
                  <input className="form-input" value={user.role} readOnly style={{ background: '#f8fafc', color: '#8fa3b3' }} />
                </div>
              </div>
              <button className="btn-primary mt-5" onClick={() => addToast('Profile updated', 'success')}>Save Changes</button>
            </div>
          )}

          {profileTab === 'security' && (
            <div className="card" style={{ padding: '22px 24px' }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: '#003366', marginBottom: 18 }}>Security</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[{ label: 'Current Password', ph: '••••••••', type: 'password' }, { label: 'New Password', ph: 'Min. 8 characters', type: 'password' }, { label: 'Confirm New Password', ph: '', type: 'password' }].map(f => (
                  <div key={f.label}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: '#4a6278', display: 'block', marginBottom: 4 }}>{f.label}</label>
                    <input className="form-input" type={f.type} placeholder={f.ph} style={{ maxWidth: 340 }} />
                  </div>
                ))}
                <button className="btn-primary" style={{ maxWidth: 180 }} onClick={() => addToast('Password updated', 'success')}>Change Password</button>
                <div style={{ borderTop: '1px solid #eef1f5', paddingTop: 16 }}>
                  <div style={{ fontWeight: 700, fontSize: 13.5, color: '#003366', marginBottom: 12 }}>Two-Factor Authentication</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <button onClick={() => { setTwoFA(v => !v); addToast(twoFA ? '2FA disabled' : '2FA enabled', 'success') }}
                      style={{ width: 44, height: 24, borderRadius: 12, background: twoFA ? '#0055A4' : '#D1D9E0', border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.2s' }}>
                      <span style={{ width: 18, height: 18, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: twoFA ? 23 : 3, transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }}></span>
                    </button>
                    <span style={{ fontSize: 13.5, color: '#2c3e50', fontWeight: 500 }}>{twoFA ? 'Enabled' : 'Disabled'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {profileTab === 'notifications' && (
            <div className="card" style={{ padding: '22px 24px' }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: '#003366', marginBottom: 18 }}>Notification Preferences</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {([
                  { key: 'emailAlerts', label: 'Email Alerts', desc: 'Receive all notifications via email' },
                  { key: 'smsAlerts', label: 'SMS Alerts', desc: 'Critical ticket alerts via SMS' },
                  { key: 'ticketUpdates', label: 'Ticket Updates', desc: 'Status changes on your tickets' },
                  { key: 'orderUpdates', label: 'Order Updates', desc: 'Shipping and delivery notifications' },
                ] as const).map(n => (
                  <div key={n.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid #eef1f5' }}>
                    <div>
                      <div style={{ fontSize: 13.5, fontWeight: 600, color: '#2c3e50' }}>{n.label}</div>
                      <div style={{ fontSize: 12, color: '#8fa3b3', marginTop: 2 }}>{n.desc}</div>
                    </div>
                    <button onClick={() => { setNotifs(p => ({ ...p, [n.key]: !p[n.key] })); addToast(`${n.label} ${notifs[n.key] ? 'disabled' : 'enabled'}`, 'success') }}
                      style={{ width: 44, height: 24, borderRadius: 12, background: notifs[n.key] ? '#0055A4' : '#D1D9E0', border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
                      <span style={{ width: 18, height: 18, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: notifs[n.key] ? 23 : 3, transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }}></span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {profileTab === 'preferences' && (
            <div className="card" style={{ padding: '22px 24px' }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: '#003366', marginBottom: 18 }}>Regional Preferences</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                {[
                  { label: 'Language', options: ['English (en-NG)', 'French (fr)', 'German (de)'] },
                  { label: 'Currency', options: ['NGN (₦)', 'USD ($)', 'EUR (€)'] },
                  { label: 'Date Format', options: ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'] },
                  { label: 'Timezone', options: ['Africa/Lagos (WAT)', 'Europe/Berlin (CET)', 'UTC'] },
                ].map(f => (
                  <div key={f.label}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: '#4a6278', display: 'block', marginBottom: 4 }}>{f.label}</label>
                    <select className="form-input"><option>{f.options[0]}</option>{f.options.slice(1).map(o => <option key={o}>{o}</option>)}</select>
                  </div>
                ))}
              </div>
              <button className="btn-primary mt-5" onClick={() => addToast('Preferences saved', 'success')}>Save Preferences</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────
export default function App() {
  const { state, createTicket, updateTicket, addTicketComment, toggleRfqItem, removeRfqItem, updateRfqQty, clearRfqCart, createOrder, updateUsers, updateMachines, updatePricing, updateSlas, updateSystemSettings, resetAppState } = useAppState()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [screen, setScreen] = useState<Screen>('dashboard')
  const [toasts, setToasts] = useState<Toast[]>([])
  const [activeTicketId, setActiveTicketId] = useState<string | null>(null)
  const [prevScreen, setPrevScreen] = useState<Screen>('tickets')

  const addToast = useCallback((message: string, type: Toast['type'] = 'success') => {
    const id = String(Date.now())
    setToasts(p => [...p, { id, message, type }])
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3200)
  }, [])

  const dismissToast = useCallback((id: string) => setToasts(p => p.filter(t => t.id !== id)), [])

  const navigate = (s: Screen) => {
    setScreen(s)
    if (s !== 'ticket-detail') setActiveTicketId(null)
  }

  const handleTicketDetail = (t: Ticket) => {
    setActiveTicketId(t.id)
    setPrevScreen(screen)
    setScreen('ticket-detail')
  }

  const handleLogout = () => {
    setUser(null)
    setScreen('dashboard')
    setActiveTicketId(null)
    resetAppState()
  }

  const handleSubmitRfq = (notes: string, deliveryAddress: string) => {
    if (!user) return
    createOrder({
      client: user.plant,
      contact: user.name,
      items: state.rfqCart.map(item => ({ id: item.id, type: 'part', name: item.name, qty: item.qty, price: item.price })),
      notes,
      source: 'RFQ',
      status: 'Pending Approval',
      deliveryAddress,
    })
    clearRfqCart()
    addToast('RFQ submitted successfully', 'success')
    setScreen('orders')
  }

  const activeTicket = activeTicketId ? state.tickets.find(ticket => ticket.id === activeTicketId) || null : null

  // Keyboard nav
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && screen === 'ticket-detail') navigate(prevScreen)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [screen, prevScreen])

  if (!user) return (
    <>
      <Login onLogin={(role, name, email, plant, phone) => setUser({ role, name, email, plant, phone })} />
      <ToastContainer toasts={toasts} dismiss={dismissToast} />
    </>
  )

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#F4F6F8' }}>
      <Sidebar user={user} active={screen} onNav={navigate} onLogout={handleLogout} />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {screen === 'dashboard'     && <Dashboard user={user} addToast={addToast} onNav={navigate} tickets={state.tickets} onCreateTicket={createTicket} />}
        {screen === 'catalog'       && <Catalog addToast={addToast} catalogItems={state.catalogItems} rfqItems={state.rfqCart} onToggleRfqItem={toggleRfqItem} onNav={navigate} />}
        {screen === 'rfq-cart'      && <RfqCart user={user} addToast={addToast} items={state.rfqCart} onUpdateQty={updateRfqQty} onRemoveItem={removeRfqItem} onSubmit={handleSubmitRfq} onBack={() => navigate('catalog')} />}
        {screen === 'tickets'       && <Tickets addToast={addToast} tickets={state.tickets} onTicketDetail={handleTicketDetail} onCreateTicket={createTicket} />}
        {screen === 'ticket-detail' && activeTicket && <TicketDetail ticket={activeTicket} onBack={() => navigate(prevScreen)} addToast={addToast} onUpdateTicket={updateTicket} onAddComment={addTicketComment} />}
        {screen === 'orders'        && <Orders addToast={addToast} orders={state.orders} />}
        {screen === 'admin'         && <AdminPanel user={user} addToast={addToast} onCreateOrder={createOrder} adminState={state} onUpdateUsers={updateUsers} onUpdateMachines={updateMachines} onUpdatePricing={updatePricing} onUpdateSlas={updateSlas} onUpdateSystemSettings={updateSystemSettings} />}
        {screen === 'profile'       && <Profile user={user} addToast={addToast} />}
        {screen === 'calendar'      && <Calendar onBack={() => navigate('dashboard')} />}
      </main>
      <ToastContainer toasts={toasts} dismiss={dismissToast} />
    </div>
  )
}

function RfqCart({
  user,
  addToast,
  items,
  onUpdateQty,
  onRemoveItem,
  onSubmit,
  onBack,
}: {
  user: AuthUser
  addToast: (m: string, t?: 'success' | 'error' | 'info') => void
  items: RfqLineItem[]
  onUpdateQty: (id: string, qty: number) => void
  onRemoveItem: (id: string) => void
  onSubmit: (notes: string, deliveryAddress: string) => void
  onBack: () => void
}) {
  const [notes, setNotes] = useState('')
  const [deliveryAddress, setDeliveryAddress] = useState(user.plant)

  const estimatedTotal = items.reduce((sum, item) => {
    const numericPrice = Number.parseInt(item.price.replace(/[^\d]/g, ''), 10)
    return sum + (Number.isFinite(numericPrice) ? numericPrice * item.qty : 0)
  }, 0)

  const formatMoney = (value: number) => `₦${value.toLocaleString('en-NG')}`

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#0055A4', fontSize: 13.5, fontWeight: 600 }}>← Back to Catalog</button>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#003366', letterSpacing: '-0.02em' }}>RFQ Cart</h1>
          <p style={{ fontSize: 13, color: '#5a7184', marginTop: 2 }}>Review selected items before submitting to Miho for approval</p>
        </div>
        <div className="card" style={{ padding: '8px 14px', fontSize: 12.5, fontWeight: 600, color: '#003366' }}>
          {items.length} items selected
        </div>
      </div>

      {items.length === 0 ? (
        <div className="card" style={{ padding: 32, textAlign: 'center' }}>
          <div style={{ fontSize: 38, marginBottom: 10 }}>🧾</div>
          <div style={{ fontSize: 17, fontWeight: 700, color: '#003366' }}>Your RFQ cart is empty.</div>
          <div style={{ color: '#5a7184', marginTop: 6 }}>Browse the catalog to add spare parts for quoting.</div>
          <div style={{ marginTop: 18, display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
            <button className="btn-primary" onClick={onBack}>Browse Catalog</button>
            <button className="btn-ghost" onClick={() => addToast('No items to submit yet', 'info')}>Review RFQ Checklist</button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 0.7fr', gap: 16, alignItems: 'start' }}>
          <div className="card">
            <table className="data-table w-full">
              <thead><tr><th>Item</th><th>Qty</th><th>Unit Price</th><th>Subtotal</th><th></th></tr></thead>
              <tbody>
                {items.map(item => {
                  const numericPrice = Number.parseInt(item.price.replace(/[^\d]/g, ''), 10)
                  const lineTotal = Number.isFinite(numericPrice) ? numericPrice * item.qty : 0
                  return (
                    <tr key={item.id}>
                      <td>
                        <div style={{ fontWeight: 600, color: '#003366' }}>{item.name}</div>
                        <div style={{ fontSize: 11.5, color: '#8fa3b3' }}>{item.category}</div>
                      </td>
                      <td style={{ width: 88 }}>
                        <input
                          type="number"
                          min={1}
                          className="form-input"
                          value={item.qty}
                          onChange={e => onUpdateQty(item.id, Number(e.target.value))}
                          style={{ width: 72, padding: '6px 8px' }}
                        />
                      </td>
                      <td className="mono">{item.price}</td>
                      <td className="mono" style={{ color: '#003366', fontWeight: 700 }}>
                        <div>{formatMoney(lineTotal)}</div>
                        <div style={{ fontSize: 11, color: '#8fa3b3', fontWeight: 500 }}>{item.qty} × {item.price}</div>
                      </td>
                      <td>
                        <button className="btn-ghost" style={{ fontSize: 11.5, padding: '4px 10px' }} onClick={() => onRemoveItem(item.id)}>Remove</button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="card" style={{ padding: 16, position: 'sticky', top: 0 }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: '#003366', marginBottom: 14, borderBottom: '1px solid #eef1f5', paddingBottom: 10 }}>RFQ Summary</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ background: '#f8fafc', borderRadius: 6, padding: 12, border: '1px solid #eef1f5' }}>
                <div style={{ fontSize: 11.5, fontWeight: 700, color: '#5a7184', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Quote Breakdown</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ color: '#5a7184' }}>Line items</span>
                  <span style={{ color: '#003366', fontWeight: 700 }}>{items.length}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ color: '#5a7184' }}>Units requested</span>
                  <span style={{ color: '#003366', fontWeight: 700 }}>{items.reduce((sum, item) => sum + item.qty, 0)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#5a7184' }}>Estimated total</span>
                  <span className="mono" style={{ color: '#003366', fontWeight: 800 }}>{formatMoney(estimatedTotal)}</span>
                </div>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#4a6278', display: 'block', marginBottom: 4 }}>Delivery Address</label>
                <textarea className="form-input" rows={3} value={deliveryAddress} onChange={e => setDeliveryAddress(e.target.value)} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#4a6278', display: 'block', marginBottom: 4 }}>Special Instructions</label>
                <textarea className="form-input" rows={3} placeholder="Add delivery notes or instructions..." value={notes} onChange={e => setNotes(e.target.value)} />
              </div>
              <div style={{ borderTop: '1px solid #eef1f5', paddingTop: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ color: '#5a7184', fontWeight: 600 }}>Estimated Total</span>
                  <span className="mono" style={{ color: '#003366', fontWeight: 800 }}>{formatMoney(estimatedTotal)}</span>
                </div>
                <div style={{ fontSize: 11.5, color: '#8fa3b3' }}>RFQs are submitted as pending approval orders.</div>
                <div style={{ fontSize: 11.5, color: '#8fa3b3', marginTop: 4 }}>Each line is quoted at the selected quantity so procurement can review the full basket.</div>
              </div>
              <button className="btn-primary w-full" onClick={() => onSubmit(notes, deliveryAddress)}>Submit RFQ</button>
              <button className="btn-ghost w-full" onClick={() => addToast('RFQ cart kept for later review', 'info')}>Save for Later</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
