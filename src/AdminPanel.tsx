import { useState } from 'react'
import type { AdminUser, AppState, AuthUser, MachineRecord, OrderLineItem, PricingRecord, SlaRecord, SystemSettings } from './types'

type AdminTab = 'obof' | 'users' | 'machines' | 'pricing' | 'sla' | 'system'

interface Props {
  user: AuthUser
  addToast: (msg: string, type?: 'success' | 'error' | 'info') => void
  adminState: AppState
  onCreateOrder: (input: {
    client: string
    contact: string
    items: OrderLineItem[]
    notes: string
    source: 'RFQ' | 'Admin OBOF'
    status?: 'Pending Approval' | 'Processing' | 'Shipped' | 'Delivered'
    deliveryAddress?: string
    trackingInfo?: string
  }) => void
  onUpdateUsers: (users: AdminUser[]) => void
  onUpdateMachines: (machines: MachineRecord[]) => void
  onUpdatePricing: (pricing: PricingRecord[]) => void
  onUpdateSlas: (slas: SlaRecord[]) => void
  onUpdateSystemSettings: (settings: SystemSettings) => void
}

const PARTS_LIST = [
  'miho David 2 — Proximity Sensor M12',
  'miho Newton X2P — X-Ray Line Detector',
  'miho TOP-Cam — UV LED Lighting Kit',
  'miho Gauss 2U — Detection Coil Assy',
  'miho EC-Cam — Strobe Lamp Module',
  'miho Filler — Valve Seal Set (24-head)',
]
const SERVICES_LIST = ['Emergency Intervention', 'Routine Maintenance', 'Annual Overhaul', 'Validations', 'Commissioning', 'Remote Diagnostics']
const CLIENTS = [
  { name: 'NBC - Nigerian Bottling Co.', contact: 'Emeka Okonkwo', phone: '+234 802 345 6789', site: 'Lagos Plant, Line 3 & 5' },
  { name: 'CHI Limited', contact: 'Funmi Adeyemi', phone: '+234 803 765 4321', site: 'Ikeja Factory' },
  { name: 'Seven-Up Bottling Co.', contact: 'Kabiru Hassan', phone: '+234 809 123 4567', site: 'Abuja Facility' },
  { name: 'Coca-Cola HBC Nigeria', contact: 'Grace Nwosu', phone: '+234 806 987 6543', site: 'Ikeja & Aba Plants' },
]

export default function AdminPanel({ user, addToast, adminState, onCreateOrder, onUpdateUsers, onUpdateMachines, onUpdatePricing, onUpdateSlas, onUpdateSystemSettings }: Props) {
  const [tab, setTab] = useState<AdminTab>('obof')
  const isAdmin = user.role === 'Miho Admin'
  const tabs: { id: AdminTab; label: string; adminOnly?: boolean }[] = [
    { id: 'obof', label: 'Order on Behalf Of' },
    { id: 'users', label: 'User Management', adminOnly: true },
    { id: 'machines', label: 'Machine Registry', adminOnly: true },
    { id: 'pricing', label: 'Pricing & Catalog', adminOnly: true },
    { id: 'sla', label: 'SLA Configuration', adminOnly: true },
    { id: 'system', label: 'System Settings', adminOnly: true },
  ]

  return (
    <div className="flex flex-col gap-0 flex-1 overflow-hidden">
      <div style={{ background: '#fff', borderBottom: '1px solid #D1D9E0', padding: '0 24px', display: 'flex', gap: 0 }}>
        <div style={{ padding: '16px 0 0', flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: '#003366', letterSpacing: '-0.02em' }}>Admin Panel</h1>
          <div style={{ display: 'flex', gap: 0, marginTop: 8, flexWrap: 'wrap' }}>
            {tabs.filter(t => !t.adminOnly || isAdmin).map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                style={{
                  padding: '8px 16px',
                  fontSize: 13, fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer',
                  color: tab === t.id ? '#003366' : '#5a7184', borderBottom: tab === t.id ? '2px solid #0055A4' : '2px solid transparent',
                  transition: 'all 0.15s', whiteSpace: 'nowrap',
                }}
              >{t.label}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
        {tab === 'obof' && <OBOF addToast={addToast} onCreateOrder={onCreateOrder} />}
        {tab === 'users' && isAdmin && <UserMgmt addToast={addToast} users={adminState.users} onUpdateUsers={onUpdateUsers} />}
        {tab === 'machines' && isAdmin && <MachineRegistry addToast={addToast} machines={adminState.machines} onUpdateMachines={onUpdateMachines} />}
        {tab === 'pricing' && isAdmin && <PricingMgmt addToast={addToast} parts={adminState.pricing} onUpdatePricing={onUpdatePricing} />}
        {tab === 'sla' && isAdmin && <SLAConfig addToast={addToast} slas={adminState.slas} onUpdateSlas={onUpdateSlas} />}
        {tab === 'system' && isAdmin && <SystemSettings addToast={addToast} settings={adminState.systemSettings} onUpdateSystemSettings={onUpdateSystemSettings} />}
      </div>
    </div>
  )
}

function OBOF({ addToast, onCreateOrder }: { addToast: Props['addToast']; onCreateOrder: Props['onCreateOrder'] }) {
  const [step, setStep] = useState(1)
  const [client, setClient] = useState(CLIENTS[0].name)
  const [notes, setNotes] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [items, setItems] = useState([{ id: '1', type: 'part' as const, name: PARTS_LIST[0], qty: 4, price: '₦18,500' }, { id: '2', type: 'service' as const, name: SERVICES_LIST[0], qty: 1, price: '—' }])
  const selectedClient = CLIENTS.find(c => c.name === client) || CLIENTS[0]

  if (submitted) {
    return (
      <div style={{ maxWidth: 500, margin: '60px auto', textAlign: 'center' }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 28 }}>✓</div>
        <h2 style={{ fontWeight: 800, fontSize: 20, color: '#003366', marginBottom: 8 }}>Quote Submitted Successfully</h2>
        <p style={{ color: '#5a7184', fontSize: 14, marginBottom: 24 }}>A PDF quote has been generated and sent to {selectedClient.contact} at {selectedClient.name}.</p>
        <div className="card" style={{ padding: 16, marginBottom: 20, textAlign: 'left' }}>
          <div style={{ fontSize: 12, color: '#8fa3b3', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Quote Reference</div>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 18, fontWeight: 800, color: '#0055A4' }}>QT-{Math.floor(Math.random() * 9000) + 1000}</div>
        </div>
        <button className="btn-primary" onClick={() => { setSubmitted(false); setStep(1) }}>Create Another Order</button>
      </div>
    )
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 20, alignItems: 'start', maxWidth: 960 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="card" style={{ padding: '16px 22px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {[1, 2, 3, 4].map((n, i) => (
              <div key={n} style={{ display: 'flex', alignItems: 'center', flex: i < 3 ? 1 : 'none' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <button onClick={() => step >= n && setStep(n)} className={`step-num ${step > n ? 'done' : step === n ? 'current' : 'pending'}`}>{step > n ? '✓' : n}</button>
                  <span style={{ fontSize: 11, fontWeight: 600, color: step >= n ? '#003366' : '#8fa3b3', whiteSpace: 'nowrap' }}>{['Client', 'Contact', 'Order', 'Review'][i]}</span>
                </div>
                {i < 3 && <div className={`step-line ${step > n ? 'done' : ''}`} style={{ marginBottom: 18 }}></div>}
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ padding: '18px 22px', opacity: step >= 1 ? 1 : 0.5 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <div className="step-num done" style={{ fontSize: 11, width: 22, height: 22 }}>1</div>
            <span style={{ fontWeight: 700, fontSize: 14, color: '#003366' }}>Select Client</span>
          </div>
          <label style={{ fontSize: 12, fontWeight: 600, color: '#4a6278', display: 'block', marginBottom: 6 }}>Client Account <span style={{ color: '#EF4444' }}>*</span></label>
          <select className="form-input" value={client} onChange={e => { setClient(e.target.value); if (step < 2) setStep(2) }} style={{ maxWidth: 380 }}>
            {CLIENTS.map(c => <option key={c.name}>{c.name}</option>)}
          </select>
        </div>

        <div className="card" style={{ padding: '18px 22px', opacity: step >= 2 ? 1 : 0.4 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <div className={`step-num ${step > 2 ? 'done' : step === 2 ? 'current' : 'pending'}`} style={{ fontSize: 11, width: 22, height: 22 }}>{step > 2 ? '✓' : 2}</div>
            <span style={{ fontWeight: 700, fontSize: 14, color: '#003366' }}>Contact Information</span>
            {step >= 2 && <span style={{ fontSize: 11.5, color: '#10B981', fontWeight: 600 }}>● Auto-filled</span>}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            {[{ label: 'Contact Name', value: selectedClient.contact }, { label: 'Phone', value: selectedClient.phone }, { label: 'Site / Plant', value: selectedClient.site }].map(f => (
              <div key={f.label}>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#4a6278', display: 'block', marginBottom: 4 }}>{f.label}</label>
                <input className="form-input" value={f.value} readOnly style={{ background: '#f8fafc', color: '#4a6278' }} />
              </div>
            ))}
          </div>
          {step === 2 && <button className="btn-primary mt-4" onClick={() => setStep(3)} style={{ fontSize: 12.5 }}>Confirm Contact →</button>}
        </div>

        <div className="card" style={{ padding: '18px 22px', opacity: step >= 3 ? 1 : 0.4 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <div className={`step-num ${step > 3 ? 'done' : step === 3 ? 'current' : 'pending'}`} style={{ fontSize: 11, width: 22, height: 22 }}>{step > 3 ? '✓' : 3}</div>
            <span style={{ fontWeight: 700, fontSize: 14, color: '#003366' }}>Order Builder</span>
          </div>
          <table className="data-table w-full mb-3">
            <thead><tr><th>Type</th><th>Item</th><th>Qty</th><th>Unit Price</th><th></th></tr></thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id}>
                  <td>
                    <select className="form-input" style={{ width: 90, padding: '5px 8px', fontSize: 12 }} value={item.type} onChange={e => setItems(p => p.map(i => i.id === item.id ? { ...i, type: e.target.value as 'part' | 'service' } : i))}>
                      <option value="part">Part</option>
                      <option value="service">Service</option>
                    </select>
                  </td>
                  <td>
                    <select className="form-input" style={{ fontSize: 12 }} value={item.name} onChange={e => setItems(p => p.map(i => i.id === item.id ? { ...i, name: e.target.value } : i))}>
                      {(item.type === 'part' ? PARTS_LIST : SERVICES_LIST).map(p => <option key={p}>{p}</option>)}
                    </select>
                  </td>
                  <td><input type="number" className="form-input" style={{ width: 64, padding: '5px 8px', fontSize: 12 }} value={item.qty} min={1} onChange={e => setItems(p => p.map(i => i.id === item.id ? { ...i, qty: Number(e.target.value) } : i))} /></td>
                  <td><input className="form-input mono" style={{ width: 120, padding: '5px 8px', fontSize: 12 }} value={item.price} onChange={e => setItems(p => p.map(i => i.id === item.id ? { ...i, price: e.target.value } : i))} /></td>
                  <td><button onClick={() => setItems(p => p.filter(i => i.id !== item.id))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444', padding: 4 }}>✕</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="btn-ghost flex items-center gap-1.5" style={{ fontSize: 12.5 }} onClick={() => setItems(p => [...p, { id: String(Date.now()), type: 'part', name: PARTS_LIST[0], qty: 1, price: '₦18,500' }])}>+ Add Line Item</button>
          {step === 3 && <button className="btn-primary mt-4" onClick={() => setStep(4)} style={{ fontSize: 12.5 }}>Proceed to Review →</button>}
        </div>

        <div className="card" style={{ padding: '18px 22px', opacity: step >= 4 ? 1 : 0.4 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <div className={`step-num ${step >= 4 ? 'current' : 'pending'}`} style={{ fontSize: 11, width: 22, height: 22 }}>4</div>
            <span style={{ fontWeight: 700, fontSize: 14, color: '#003366' }}>Internal Notes & Submission</span>
          </div>
          <label style={{ fontSize: 12, fontWeight: 600, color: '#4a6278', display: 'block', marginBottom: 6 }}>Internal Notes (not visible to client)</label>
          <textarea className="form-input" rows={4} placeholder="Add pricing rationale, special terms, escalation notes..." value={notes} onChange={e => setNotes(e.target.value)} />
          <button className="btn-primary w-full mt-5 flex items-center justify-center gap-2" style={{ padding: '13px 20px', fontSize: 14, fontWeight: 700, background: '#003366' }} onClick={() => {
            onCreateOrder({ client: selectedClient.name, contact: selectedClient.contact, items: items.map(item => ({ id: item.id, type: item.type, name: item.name, qty: item.qty, price: item.price })), notes: notes.trim() || 'OBOF quote submitted from admin panel.', source: 'Admin OBOF', status: 'Pending Approval', deliveryAddress: selectedClient.site })
            setSubmitted(true)
            addToast('Quote submitted & PDF generated!', 'success')
          }}>📄 Submit & Generate PDF Quote</button>
        </div>
      </div>

      <div className="card" style={{ padding: '16px 18px', position: 'sticky', top: 0 }}>
        <div style={{ fontWeight: 700, fontSize: 13, color: '#003366', marginBottom: 14, borderBottom: '1px solid #eef1f5', paddingBottom: 10 }}>Quote Summary</div>
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 11, color: '#8fa3b3', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>Client</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#003366' }}>{selectedClient.name}</div>
          <div style={{ fontSize: 12, color: '#5a7184' }}>{selectedClient.contact} · {selectedClient.phone}</div>
        </div>
        <div style={{ borderTop: '1px solid #eef1f5', paddingTop: 12, marginBottom: 12 }}>
          <div style={{ fontSize: 11, color: '#8fa3b3', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Line Items</div>
          {items.map(item => <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7, gap: 8 }}><div style={{ fontSize: 12, color: '#2c3e50', lineHeight: 1.3, flex: 1 }}>{item.name} ×{item.qty}</div><div className="mono" style={{ fontSize: 12, color: '#003366', fontWeight: 600, flexShrink: 0 }}>{item.price}</div></div>)}
        </div>
        <div style={{ borderTop: '2px solid #D1D9E0', paddingTop: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#4a6278' }}>Est. Total</span>
            <span className="mono" style={{ fontSize: 15, fontWeight: 800, color: '#003366' }}>RFQ</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function UserMgmt({ addToast, users, onUpdateUsers }: { addToast: Props['addToast']; users: AdminUser[]; onUpdateUsers: Props['onUpdateUsers'] }) {
  const [showModal, setShowModal] = useState(false)
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'Brewery Engineer', plant: 'NBC Lagos' })
  const toggle = (id: string) => { onUpdateUsers(users.map(u => u.id === id ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' } : u)); addToast('User status updated', 'success') }
  const submit = () => {
    if (!newUser.name || !newUser.email) { addToast('Name and email are required', 'error'); return }
    onUpdateUsers([...users, { ...newUser, id: `USR-00${users.length + 1}`, status: 'Active', lastLogin: '—' }])
    addToast('New user added successfully', 'success'); setShowModal(false); setNewUser({ name: '', email: '', role: 'Brewery Engineer', plant: 'NBC Lagos' })
  }
  return <div style={{ maxWidth: 960 }}><div className="flex items-center justify-between mb-4"><h2 style={{ fontWeight: 700, fontSize: 15, color: '#003366' }}>User Management</h2><div className="flex gap-2"><button className="btn-ghost" style={{ fontSize: 12.5 }} onClick={() => addToast('Exporting user list...', 'info')}>Export CSV</button><button className="btn-primary" onClick={() => setShowModal(true)} style={{ fontSize: 12.5 }}>+ Add New User</button></div></div><div className="card"><table className="data-table w-full"><thead><tr><th>User ID</th><th>Name</th><th>Email</th><th>Role</th><th>Plant Access</th><th>Status</th><th>Last Login</th><th>Actions</th></tr></thead><tbody>{users.map(u => <tr key={u.id}><td><span className="mono" style={{ color: '#0055A4', fontSize: 11.5 }}>{u.id}</span></td><td style={{ fontWeight: 600 }}>{u.name}</td><td style={{ color: '#5a7184', fontSize: 12 }}>{u.email}</td><td><span style={{ fontSize: 11.5, padding: '2px 8px', borderRadius: 3, background: '#eff6ff', color: '#1d4ed8', fontWeight: 500 }}>{u.role}</span></td><td style={{ color: '#4a6278', fontSize: 12.5 }}>{u.plant}</td><td><span style={{ fontSize: 12, padding: '2px 8px', borderRadius: 3, fontWeight: 600, background: u.status === 'Active' ? '#dcfce7' : '#f1f5f9', color: u.status === 'Active' ? '#065f46' : '#64748b' }}>{u.status}</span></td><td style={{ fontSize: 12, color: '#5a7184', fontFamily: 'JetBrains Mono, monospace' }}>{u.lastLogin}</td><td><div className="flex gap-1.5"><button className="btn-ghost" style={{ fontSize: 11, padding: '3px 8px' }} onClick={() => addToast('User editor not yet wired to inline edit mode', 'info')}>Edit</button><button onClick={() => toggle(u.id)} style={{ fontSize: 11, padding: '3px 8px', borderRadius: 3, border: `1px solid ${u.status === 'Active' ? '#fca5a5' : '#a7f3d0'}`, background: 'none', cursor: 'pointer', color: u.status === 'Active' ? '#EF4444' : '#10B981', fontWeight: 600 }}>{u.status === 'Active' ? 'Deactivate' : 'Activate'}</button></div></td></tr>)}</tbody></table></div>{showModal && <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }} onClick={() => setShowModal(false)}><div className="card" style={{ width: 420, padding: 26 }} onClick={e => e.stopPropagation()}><div style={{ fontWeight: 800, fontSize: 16, color: '#003366', marginBottom: 18 }}>Add New User</div><div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>{[{ label: 'Full Name', key: 'name', type: 'text', ph: 'e.g. Amara Osei' }, { label: 'Email', key: 'email', type: 'email', ph: 'user@miho.de' }, { label: 'Plant', key: 'plant', type: 'text', ph: 'e.g. NBC Lagos' }].map(f => <div key={f.key}><label style={{ fontSize: 12, fontWeight: 600, color: '#4a6278', display: 'block', marginBottom: 4 }}>{f.label} <span style={{ color: '#EF4444' }}>*</span></label><input className="form-input" type={f.type} placeholder={f.ph} value={(newUser as Record<string, string>)[f.key]} onChange={e => setNewUser(p => ({ ...p, [f.key]: e.target.value }))} /></div>)}<div><label style={{ fontSize: 12, fontWeight: 600, color: '#4a6278', display: 'block', marginBottom: 4 }}>Role</label><select className="form-input" value={newUser.role} onChange={e => setNewUser(p => ({ ...p, role: e.target.value }))}>{['Brewery Engineer', 'Procurement Manager', 'Miho Admin', 'Field Engineer'].map(r => <option key={r}>{r}</option>)}</select></div></div><div className="flex gap-2 mt-5"><button className="btn-primary flex-1" onClick={submit}>Add User</button><button className="btn-ghost" onClick={() => setShowModal(false)}>Cancel</button></div></div></div>}</div>
}

function MachineRegistry({ addToast, machines, onUpdateMachines }: { addToast: Props['addToast']; machines: MachineRecord[]; onUpdateMachines: Props['onUpdateMachines'] }) {
  const [search, setSearch] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [newMachine, setNewMachine] = useState({
    model: 'miho David 2',
    type: 'Empty Bottle Inspector',
    plant: 'NBC Lagos',
    line: 'Line 3',
    installed: '2026-09-24',
    warranty: 'Active' as MachineRecord['warranty'],
    serial: '',
  })
  const filtered = machines.filter(m => !search || m.model.toLowerCase().includes(search.toLowerCase()) || m.serial.toLowerCase().includes(search.toLowerCase()))
  const submit = () => {
    if (!newMachine.serial.trim()) { addToast('Serial number is required', 'error'); return }
    const nextId = `MCH-${String(machines.length + 1).padStart(3, '0')}`
    onUpdateMachines([...machines, { ...newMachine, id: nextId, serial: newMachine.serial.trim() }])
    addToast(`${newMachine.model} registered`, 'success')
    setShowAddModal(false)
    setNewMachine({ model: 'miho David 2', type: 'Empty Bottle Inspector', plant: 'NBC Lagos', line: 'Line 3', installed: '2026-09-24', warranty: 'Active', serial: '' })
  }

  return <div style={{ maxWidth: 980 }}><div className="flex items-center justify-between mb-4"><h2 style={{ fontWeight: 700, fontSize: 15, color: '#003366' }}>Machine Registry</h2><button className="btn-primary" style={{ fontSize: 12.5 }} onClick={() => setShowAddModal(true)}>+ Register Machine</button></div><div className="card" style={{ padding: '14px 18px', marginBottom: 16 }}><input className="form-input" placeholder="Search by Machine ID, Model, or Serial Number..." value={search} onChange={e => setSearch(e.target.value)} /></div><div className="card"><table className="data-table w-full"><thead><tr><th>Machine ID</th><th>Model</th><th>Type</th><th>Plant</th><th>Line</th><th>Installed</th><th>Warranty</th><th>Serial No.</th><th>Actions</th></tr></thead><tbody>{filtered.map(m => <tr key={m.id}><td><span className="mono" style={{ color: '#0055A4', fontSize: 11.5 }}>{m.id}</span></td><td style={{ fontWeight: 700, color: '#003366' }}>{m.model}</td><td style={{ fontSize: 12.5, color: '#4a6278' }}>{m.type}</td><td style={{ fontSize: 12.5 }}>{m.plant}</td><td><span style={{ fontSize: 12, background: '#eff6ff', color: '#1d4ed8', padding: '2px 8px', borderRadius: 3 }}>{m.line}</span></td><td style={{ fontSize: 12, color: '#5a7184' }}>{m.installed}</td><td><span style={{ fontSize: 12, padding: '2px 8px', borderRadius: 3, fontWeight: 600, background: m.warranty === 'Active' ? '#dcfce7' : '#fee2e2', color: m.warranty === 'Active' ? '#065f46' : '#991b1b' }}>{m.warranty}</span></td><td><span className="mono" style={{ fontSize: 11, color: '#5a7184' }}>{m.serial}</span></td><td><button className="btn-ghost" style={{ fontSize: 11, padding: '3px 8px' }} onClick={() => { addToast('Machine details opened', 'info') }}>View</button></td></tr>)}</tbody></table></div>{showAddModal && <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }} onClick={() => setShowAddModal(false)}><div className="card" style={{ width: 460, padding: 26 }} onClick={e => e.stopPropagation()}><div style={{ fontWeight: 800, fontSize: 16, color: '#003366', marginBottom: 18 }}>Register Machine</div><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>{[{ label: 'Model', key: 'model' }, { label: 'Type', key: 'type' }, { label: 'Plant', key: 'plant' }, { label: 'Line', key: 'line' }, { label: 'Installed', key: 'installed', type: 'date' }, { label: 'Warranty', key: 'warranty', type: 'select' }, { label: 'Serial No.', key: 'serial', span: true }].map(f => <div key={f.key} style={{ gridColumn: (f as { span?: boolean }).span ? '1 / -1' : undefined }}><label style={{ fontSize: 12, fontWeight: 600, color: '#4a6278', display: 'block', marginBottom: 4 }}>{f.label} <span style={{ color: '#EF4444' }}>*</span></label>{(f as { type?: string }).type === 'select' ? <select className="form-input" value={newMachine.warranty} onChange={e => setNewMachine(p => ({ ...p, warranty: e.target.value as MachineRecord['warranty'] }))}><option value="Active">Active</option><option value="Expired">Expired</option></select> : <input className="form-input" type={(f as { type?: string }).type || 'text'} value={(newMachine as Record<string, string>)[f.key]} onChange={e => setNewMachine(p => ({ ...p, [f.key]: e.target.value }))} />}</div>)}</div><div className="flex gap-2 mt-5"><button className="btn-primary flex-1" onClick={submit}>Save Machine</button><button className="btn-ghost" onClick={() => setShowAddModal(false)}>Cancel</button></div></div></div>}</div>
}

function PricingMgmt({ addToast, parts, onUpdatePricing }: { addToast: Props['addToast']; parts: PricingRecord[]; onUpdatePricing: Props['onUpdatePricing'] }) {
  const [bulkPct, setBulkPct] = useState('')
  const applyBulk = () => { const pct = parseFloat(bulkPct); if (isNaN(pct)) { addToast('Enter a valid percentage', 'error'); return } onUpdatePricing(parts.map(i => ({ ...i, price: Math.round(i.price * (1 + pct / 100)) }))); addToast(`Prices updated by ${pct > 0 ? '+' : ''}${pct}%`, 'success'); setBulkPct('') }
  return <div style={{ maxWidth: 960 }}><div className="flex items-center justify-between mb-4"><h2 style={{ fontWeight: 700, fontSize: 15, color: '#003366' }}>Pricing & Catalog Management</h2><div className="flex items-center gap-2"><div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#fff', border: '1px solid #D1D9E0', borderRadius: 4, padding: '6px 10px' }}><span style={{ fontSize: 12, color: '#5a7184', fontWeight: 600 }}>Bulk adjust:</span><input type="number" className="form-input" placeholder="%  e.g. +5" value={bulkPct} onChange={e => setBulkPct(e.target.value)} style={{ width: 80, padding: '4px 8px', fontSize: 12 }} /><button className="btn-primary" style={{ fontSize: 12, padding: '4px 10px' }} onClick={applyBulk}>Apply</button></div><button className="btn-ghost" style={{ fontSize: 12.5 }} onClick={() => addToast('Catalog exported', 'success')}>Export</button></div></div><div className="card"><table className="data-table w-full"><thead><tr><th>Part No.</th><th>Description</th><th>Category</th><th>Unit Price (₦)</th><th>Stock</th><th>Min. Threshold</th><th>Actions</th></tr></thead><tbody>{parts.map((p, i) => <tr key={p.id}><td><span className="mono" style={{ color: '#0055A4', fontSize: 11.5 }}>{p.id}</span></td><td style={{ fontWeight: 500, color: '#003366', maxWidth: 260 }}>{p.name}</td><td><span style={{ fontSize: 12, background: '#f0f4f8', color: '#4a6278', padding: '2px 8px', borderRadius: 3 }}>{p.category}</span></td><td><input type="number" className="form-input mono" style={{ width: 120, padding: '5px 8px', fontSize: 13 }} value={p.price} onChange={e => onUpdatePricing(parts.map((x, j) => j === i ? { ...x, price: Number(e.target.value) } : x))} /></td><td><span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, fontSize: 14, color: p.stock === 0 ? '#EF4444' : p.stock < p.threshold ? '#F59E0B' : '#10B981' }}>{p.stock}</span></td><td><input type="number" className="form-input" style={{ width: 64, padding: '5px 8px', fontSize: 12 }} value={p.threshold} onChange={e => onUpdatePricing(parts.map((x, j) => j === i ? { ...x, threshold: Number(e.target.value) } : x))} /></td><td><button className="btn-ghost" style={{ fontSize: 11, padding: '3px 8px' }} onClick={() => addToast('Price saved', 'success')}>Save</button></td></tr>)}</tbody></table></div></div>
}

function SLAConfig({ addToast, slas, onUpdateSlas }: { addToast: Props['addToast']; slas: SlaRecord[]; onUpdateSlas: Props['onUpdateSlas'] }) {
  return <div style={{ maxWidth: 800 }}><div className="flex items-center justify-between mb-4"><h2 style={{ fontWeight: 700, fontSize: 15, color: '#003366' }}>Service Level Agreements</h2><button className="btn-primary" style={{ fontSize: 12.5 }} onClick={() => addToast('SLA configuration saved', 'success')}>Save All Changes</button></div><div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>{slas.map((s, i) => <div key={s.type} className="card" style={{ padding: '16px 20px' }}><div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}><span style={{ width: 10, height: 10, borderRadius: '50%', background: s.color, flexShrink: 0 }}></span><span style={{ fontWeight: 700, fontSize: 14, color: '#003366' }}>{s.type}</span></div><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12 }}>{[{ label: 'Response Time', key: 'response' as const }, { label: 'Resolution Time', key: 'resolution' as const }, { label: 'Unit', key: 'unit' as const, isSelect: true }, { label: 'Escalation Contact', key: 'escalation' as const }].map(f => <div key={f.key}><label style={{ fontSize: 11.5, fontWeight: 600, color: '#5a7184', display: 'block', marginBottom: 4 }}>{f.label}</label>{f.isSelect ? <select className="form-input" style={{ fontSize: 12.5 }} value={s.unit} onChange={e => onUpdateSlas(slas.map((x, j) => j === i ? { ...x, unit: e.target.value } : x))}><option>hours</option><option>business days</option><option>calendar days</option></select> : <input className="form-input mono" style={{ fontSize: 13 }} value={s[f.key]} onChange={e => onUpdateSlas(slas.map((x, j) => j === i ? { ...x, [f.key]: e.target.value } : x))} />}</div>)}</div></div>)}</div></div>
}

function SystemSettings({ addToast, settings, onUpdateSystemSettings }: { addToast: Props['addToast']; settings: SystemSettings; onUpdateSystemSettings: Props['onUpdateSystemSettings'] }) {
  const set = (k: keyof SystemSettings, v: string) => onUpdateSystemSettings({ ...settings, [k]: v })
  return <div style={{ maxWidth: 700 }}><div className="flex items-center justify-between mb-4"><h2 style={{ fontWeight: 700, fontSize: 15, color: '#003366' }}>System Settings</h2><button className="btn-primary" onClick={() => addToast('Settings saved successfully', 'success')} style={{ fontSize: 12.5 }}>Save Changes</button></div><div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}><div className="card" style={{ padding: '18px 22px' }}><div style={{ fontWeight: 700, fontSize: 13.5, color: '#003366', marginBottom: 14, borderBottom: '1px solid #eef1f5', paddingBottom: 10 }}>General</div><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>{[{ label: 'Company Name', key: 'companyName' }, { label: 'Support Email', key: 'supportEmail' }, { label: 'Support Phone', key: 'supportPhone' }, { label: 'Backup Schedule', key: 'backupSchedule' }].map(f => <div key={f.key}><label style={{ fontSize: 12, fontWeight: 600, color: '#4a6278', display: 'block', marginBottom: 4 }}>{f.label}</label><input className="form-input" value={settings[f.key as keyof SystemSettings] as string} onChange={e => set(f.key as keyof SystemSettings, e.target.value)} /></div>)}</div></div><div className="card" style={{ padding: '18px 22px' }}><div style={{ fontWeight: 700, fontSize: 13.5, color: '#003366', marginBottom: 14, borderBottom: '1px solid #eef1f5', paddingBottom: 10 }}>Regional Preferences</div><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>{[{ label: 'Language', key: 'language', options: ['English (en-NG)', 'French (fr)', 'German (de)'] }, { label: 'Currency', key: 'currency', options: ['NGN (₦)', 'USD ($)', 'EUR (€)', 'GHS (₵)'] }, { label: 'Date Format', key: 'dateFormat', options: ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'] }, { label: 'Timezone', key: 'timezone', options: ['Africa/Lagos (WAT, UTC+1)', 'Europe/Berlin (CET/CEST)', 'UTC'] }].map(f => <div key={f.key}><label style={{ fontSize: 12, fontWeight: 600, color: '#4a6278', display: 'block', marginBottom: 4 }}>{f.label}</label><select className="form-input" value={settings[f.key as keyof SystemSettings] as string} onChange={e => set(f.key as keyof SystemSettings, e.target.value)}>{f.options.map(o => <option key={o}>{o}</option>)}</select></div>)}</div></div><div className="card" style={{ padding: '18px 22px' }}><div style={{ fontWeight: 700, fontSize: 13.5, color: '#003366', marginBottom: 14, borderBottom: '1px solid #eef1f5', paddingBottom: 10 }}>Data & Export</div><div className="flex gap-3"><button className="btn-ghost" onClick={() => addToast('Database backup initiated...', 'info')}>⬇ Export All Data (CSV)</button><button className="btn-ghost" onClick={() => addToast('PDF report generating...', 'info')}>📄 Export Report (PDF)</button><button className="btn-ghost" onClick={() => addToast('Backup started', 'success')}>🔄 Manual Backup</button></div></div></div></div>
}
