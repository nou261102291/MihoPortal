import { useCallback, useReducer } from 'react'
import type { AdminUser, AppState, CatalogItem, MachineRecord, Order, OrderLineItem, PricingRecord, RfqLineItem, SlaRecord, SystemSettings, Ticket } from './types'

type CreateTicketInput = {
  machine: string
  desc: string
  priority: Ticket['priority']
}

type CreateOrderInput = {
  client: string
  contact: string
  items: OrderLineItem[]
  notes: string
  source: Order['source']
  status?: Order['status']
  deliveryAddress?: string
  trackingInfo?: string
}

type AppAction =
  | { type: 'CREATE_TICKET'; payload: CreateTicketInput }
  | { type: 'UPDATE_TICKET'; payload: { id: string; updates: Partial<Ticket> } }
  | { type: 'ADD_TICKET_COMMENT'; payload: { id: string; text: string; user: string; time: string } }
  | { type: 'TOGGLE_RFQ_ITEM'; payload: CatalogItem }
  | { type: 'REMOVE_RFQ_ITEM'; payload: { id: string } }
  | { type: 'UPDATE_RFQ_QTY'; payload: { id: string; qty: number } }
  | { type: 'CLEAR_RFQ' }
  | { type: 'CREATE_ORDER'; payload: CreateOrderInput }
  | { type: 'UPDATE_USERS'; payload: AdminUser[] }
  | { type: 'UPDATE_MACHINES'; payload: MachineRecord[] }
  | { type: 'UPDATE_PRICING'; payload: PricingRecord[] }
  | { type: 'UPDATE_SLAS'; payload: SlaRecord[] }
  | { type: 'UPDATE_SYSTEM_SETTINGS'; payload: SystemSettings }
  | { type: 'RESET' }

function createInitialState(): AppState {
  return {
    tickets: [
      {
        id: 'T-0091',
        machine: 'miho EC-Cam',
        type: 'Emergency Intervention',
        status: 'Open',
        priority: 'Critical',
        date: '2026-09-23',
        desc: 'EAN barcode read error on Line 5, production halted.',
        timeline: [
          { time: '08:14', event: 'Ticket created', user: 'Emeka Okonkwo' },
          { time: '08:22', event: 'Assigned to Tunde Akinola', user: 'System' },
        ],
        comments: [],
      },
      {
        id: 'T-0087',
        machine: 'miho David 2',
        type: 'Routine Maintenance',
        status: 'In Progress',
        priority: 'Normal',
        date: '2026-09-18',
        desc: 'Scheduled quarterly PM inspection and cleaning.',
        timeline: [
          { time: '09:00', event: 'Ticket created', user: 'Klaus Weber' },
          { time: '10:30', event: 'Engineer on-site', user: 'Tunde Akinola' },
        ],
        comments: [],
      },
      {
        id: 'T-0081',
        machine: 'miho Gauss 2U',
        type: 'Validations',
        status: 'Closed',
        priority: 'Normal',
        date: '2026-09-10',
        desc: 'Annual IQ/OQ/PQ validation for metal detection.',
        timeline: [
          { time: '08:00', event: 'Ticket created', user: 'Klaus Weber' },
          { time: '14:00', event: 'Validation complete', user: 'Tunde Akinola' },
        ],
        comments: [],
      },
      {
        id: 'T-0075',
        machine: 'miho TOP-Cam',
        type: 'Annual Overhaul',
        status: 'Closed',
        priority: 'Scheduled',
        date: '2026-08-28',
        desc: 'Annual overhaul completed. UV lamp replaced.',
        timeline: [
          { time: '07:30', event: 'Ticket created', user: 'Klaus Weber' },
          { time: '16:00', event: 'Overhaul complete', user: 'Amara Osei' },
        ],
        comments: [],
      },
    ],
    catalogItems: [
      {
        id: 'MIHO-NX2P-DET-01',
        name: 'miho Newton X2P — X-Ray Line Detector',
        category: 'Inspector',
        price: '₦450,000',
        stock: 'In Stock',
        desc: 'High-sensitivity X-ray line detector for PET and glass bottles at up to 72,000 bph. Detects glass, metal, and dense contaminants.',
        img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=220&fit=crop&auto=format',
      },
      {
        id: 'MIHO-TC-UV-04',
        name: 'miho TOP-Cam — UV LED Lighting Kit',
        category: 'Inspector',
        price: '₦120,000',
        stock: 'Backordered',
        desc: 'UV-A 365nm LED illumination kit for closure inspection. IP67-rated, field-serviceable. Restock est. Oct 28, 2026.',
        img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=220&fit=crop&auto=format',
      },
      {
        id: 'MIHO-GAU-COIL-07',
        name: 'miho Gauss 2U — Detection Coil Assy',
        category: 'Inspector',
        price: '₦290,000',
        stock: 'In Stock',
        desc: 'Electromagnetic coil assembly for 38mm and 45mm conveyor widths. Includes calibration test pieces.',
        img: 'https://images.unsplash.com/photo-1565514020179-026b92b84bb6?w=400&h=220&fit=crop&auto=format',
      },
      {
        id: 'MIHO-DV2-SENS-12',
        name: 'miho David 2 — Proximity Sensor M12',
        category: 'Inspector',
        price: '₦18,500',
        stock: 'In Stock',
        desc: 'M12 inductive proximity sensor, NPN NO, 4mm range, 10–30V DC. High-vibration rated for beverage lines.',
        img: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=400&h=220&fit=crop&auto=format',
      },
      {
        id: 'MIHO-EC-LAMP-03',
        name: 'miho EC-Cam — Strobe Lamp Module',
        category: 'Labeler',
        price: '₦76,000',
        stock: 'In Stock',
        desc: '200,000 lux strobe lamp for EAN barcode inspection. Encoder-synchronised. Compatible with firmware v3.2+.',
        img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=220&fit=crop&auto=format',
      },
      {
        id: 'MIHO-FIL-SEAL-09',
        name: 'miho Filler — Valve Seal Set (24-head)',
        category: 'Filler',
        price: '₦55,000',
        stock: 'In Stock',
        desc: 'FDA-compliant EPDM seal set for 24-head rotary fillers. Annual replacement recommended. Includes O-rings and gaskets.',
        img: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=400&h=220&fit=crop&auto=format',
      },
    ],
    rfqCart: [],
    orders: [
      {
        id: 'PO-2341',
        client: 'NBC - Nigerian Bottling Co.',
        contact: 'Emeka Okonkwo',
        items: [
          { id: 'MIHO-DV2-SENS-12', type: 'part', name: 'miho David 2 — Proximity Sensor M12', qty: 4, price: '₦18,500' },
          { id: 'MIHO-EC-LAMP-03', type: 'part', name: 'miho EC-Cam — Strobe Lamp Module', qty: 2, price: '₦76,000' },
        ],
        notes: 'Ship to Lagos Plant. Standard delivery.',
        createdAt: '2026-09-20',
        status: 'Shipped',
        source: 'Admin OBOF',
        deliveryAddress: 'NBC Lagos Plant, Line 3 & 5',
        trackingInfo: 'DHL NG-883120',
      },
      {
        id: 'PO-2335',
        client: 'CHI Limited',
        contact: 'Funmi Adeyemi',
        items: [
          { id: 'MIHO-GAU-COIL-07', type: 'part', name: 'miho Gauss 2U — Detection Coil Assy', qty: 1, price: '₦290,000' },
        ],
        notes: 'Emergency replacement pending approval.',
        createdAt: '2026-09-15',
        status: 'Processing',
        source: 'RFQ',
        deliveryAddress: 'CHI Ikeja Factory',
        trackingInfo: 'Awaiting dispatch',
      },
      {
        id: 'PO-2318',
        client: 'Seven-Up Bottling Co.',
        contact: 'Kabiru Hassan',
        items: [
          { id: 'MIHO-FIL-SEAL-09', type: 'part', name: 'miho Filler — Valve Seal Set (24-head)', qty: 3, price: '₦55,000' },
        ],
        notes: 'Completed under annual maintenance.',
        createdAt: '2026-09-01',
        status: 'Delivered',
        source: 'Admin OBOF',
        deliveryAddress: 'Abuja Facility',
        trackingInfo: 'Delivered 2026-09-05',
      },
      {
        id: 'PO-2301',
        client: 'Coca-Cola HBC Nigeria',
        contact: 'Grace Nwosu',
        items: [
          { id: 'MIHO-NX2P-DET-01', type: 'part', name: 'miho Newton X2P — X-Ray Line Detector', qty: 1, price: '₦450,000' },
        ],
        notes: 'Closed and archived.',
        createdAt: '2026-08-18',
        status: 'Delivered',
        source: 'RFQ',
        deliveryAddress: 'Ikeja & Aba Plants',
        trackingInfo: 'Delivered 2026-08-22',
      },
    ],
    users: [
      { id: 'USR-001', name: 'Klaus Weber', email: 'admin@miho.de', role: 'Miho Admin', plant: 'HQ Frankfurt', status: 'Active', lastLogin: '2026-09-23 08:14' },
      { id: 'USR-002', name: 'Tunde Akinola', email: 'field@miho.de', role: 'Field Engineer', plant: 'NBC Lagos', status: 'Active', lastLogin: '2026-09-23 06:52' },
      { id: 'USR-003', name: 'Chidinma Eze', email: 'procurement@nbc.ng', role: 'Procurement Manager', plant: 'NBC Lagos', status: 'Active', lastLogin: '2026-09-22 15:30' },
      { id: 'USR-004', name: 'Emeka Okonkwo', email: 'engineer@nbc.ng', role: 'Brewery Engineer', plant: 'NBC Lagos', status: 'Active', lastLogin: '2026-09-22 11:05' },
      { id: 'USR-005', name: 'Amara Osei', email: 'a.osei@miho.de', role: 'Field Engineer', plant: 'CHI Ikeja', status: 'Inactive', lastLogin: '2026-09-10 09:22' },
    ],
    machines: [
      { id: 'MCH-001', model: 'miho David 2', type: 'Empty Bottle Inspector', plant: 'NBC Lagos', line: 'Line 3', installed: '2021-03-15', warranty: 'Active', serial: 'DV2-LAG-2103' },
      { id: 'MCH-002', model: 'miho EC-Cam', type: 'Label Inspection', plant: 'NBC Lagos', line: 'Line 5', installed: '2020-07-22', warranty: 'Expired', serial: 'ECC-LAG-2007' },
      { id: 'MCH-003', model: 'miho Gauss 2U', type: 'Metal Detection', plant: 'NBC Lagos', line: 'Line 3', installed: '2022-01-10', warranty: 'Active', serial: 'G2U-LAG-2201' },
      { id: 'MCH-004', model: 'miho TOP-Cam', type: 'Closure Inspection', plant: 'NBC Lagos', line: 'Line 5', installed: '2021-11-08', warranty: 'Active', serial: 'TPC-LAG-2111' },
      { id: 'MCH-005', model: 'miho Newton X2P', type: 'X-Ray Inspector', plant: 'CHI Ikeja', line: 'Line 1', installed: '2023-05-20', warranty: 'Active', serial: 'NX2-CHI-2305' },
    ],
    pricing: [
      { id: 'MIHO-NX2P-DET-01', name: 'miho Newton X2P — X-Ray Line Detector', price: 450000, stock: 12, category: 'Inspector', threshold: 3 },
      { id: 'MIHO-TC-UV-04', name: 'miho TOP-Cam — UV LED Lighting Kit', price: 120000, stock: 0, category: 'Inspector', threshold: 2 },
      { id: 'MIHO-GAU-COIL-07', name: 'miho Gauss 2U — Detection Coil Assy', price: 290000, stock: 5, category: 'Inspector', threshold: 2 },
      { id: 'MIHO-DV2-SENS-12', name: 'miho David 2 — Proximity Sensor M12', price: 18500, stock: 48, category: 'Inspector', threshold: 10 },
      { id: 'MIHO-EC-LAMP-03', name: 'miho EC-Cam — Strobe Lamp Module', price: 76000, stock: 8, category: 'Labeler', threshold: 3 },
      { id: 'MIHO-FIL-SEAL-09', name: 'miho Filler — Valve Seal Set (24-head)', price: 55000, stock: 22, category: 'Filler', threshold: 5 },
    ],
    slas: [
      { type: 'Emergency Intervention', color: '#EF4444', response: '2', resolution: '8', unit: 'hours', escalation: 'Klaus Weber' },
      { type: 'Routine Maintenance', color: '#3b82f6', response: '5', resolution: '1', unit: 'business days', escalation: 'Tunde Akinola' },
      { type: 'Annual Overhaul', color: '#FF6600', response: '30', resolution: '5', unit: 'calendar days', escalation: 'Klaus Weber' },
      { type: 'Validations', color: '#8b5cf6', response: '3', resolution: '3', unit: 'business days', escalation: 'Amara Osei' },
      { type: 'Commissioning', color: '#0055A4', response: '14', resolution: '3', unit: 'calendar days', escalation: 'Tunde Akinola' },
    ],
    systemSettings: {
      companyName: 'Miho Inspection Systems Ltd Nigeria',
      supportEmail: 'support@miho-nigeria.com',
      supportPhone: '+234 1 234 5678',
      timezone: 'Africa/Lagos (WAT, UTC+1)',
      currency: 'NGN (₦)',
      dateFormat: 'DD/MM/YYYY',
      language: 'English (en-NG)',
      backupSchedule: 'Daily at 02:00 WAT',
    },
  }
}

function nextNumericId(prefix: string, currentIds: string[], startFrom: number) {
  const numericIds = currentIds
    .map(id => Number.parseInt(id.replace(prefix, ''), 10))
    .filter(Number.isFinite)
  const nextNumber = numericIds.length > 0 ? Math.max(...numericIds) + 1 : startFrom
  return `${prefix}${String(nextNumber).padStart(4, '0')}`
}

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'CREATE_TICKET': {
      const id = nextNumericId('T-', state.tickets.map(ticket => ticket.id), 92)
      const timestamp = new Date()
      const newTicket: Ticket = {
        id,
        machine: action.payload.machine,
        type: 'Emergency Intervention',
        status: 'Open',
        priority: action.payload.priority,
        date: timestamp.toISOString().split('T')[0],
        desc: action.payload.desc,
        timeline: [{ time: timestamp.toTimeString().slice(0, 5), event: 'Ticket created', user: 'You' }],
        comments: [],
      }
      return { ...state, tickets: [newTicket, ...state.tickets] }
    }
    case 'UPDATE_TICKET': {
      return {
        ...state,
        tickets: state.tickets.map(ticket => {
          if (ticket.id !== action.payload.id) return ticket
          return { ...ticket, ...action.payload.updates }
        }),
      }
    }
    case 'ADD_TICKET_COMMENT': {
      return {
        ...state,
        tickets: state.tickets.map(ticket => {
          if (ticket.id !== action.payload.id) return ticket
          return {
            ...ticket,
            comments: [...(ticket.comments || []), { text: action.payload.text, user: action.payload.user, time: action.payload.time }],
            timeline: [...(ticket.timeline || []), { time: action.payload.time, event: 'Comment added', user: action.payload.user }],
          }
        }),
      }
    }
    case 'TOGGLE_RFQ_ITEM': {
      const exists = state.rfqCart.some(item => item.id === action.payload.id)
      const rfqCart: RfqLineItem[] = exists
        ? state.rfqCart.filter(item => item.id !== action.payload.id)
        : [...state.rfqCart, { id: action.payload.id, name: action.payload.name, category: action.payload.category, price: action.payload.price, qty: 1 }]
      return { ...state, rfqCart }
    }
    case 'REMOVE_RFQ_ITEM': {
      return { ...state, rfqCart: state.rfqCart.filter(item => item.id !== action.payload.id) }
    }
    case 'UPDATE_RFQ_QTY': {
      return {
        ...state,
        rfqCart: state.rfqCart
          .map(item => item.id === action.payload.id ? { ...item, qty: action.payload.qty } : item)
          .filter(item => item.qty > 0),
      }
    }
    case 'CLEAR_RFQ': {
      return { ...state, rfqCart: [] }
    }
    case 'CREATE_ORDER': {
      const id = nextNumericId('PO-', state.orders.map(order => order.id), 2342)
      const createdAt = new Date().toISOString().split('T')[0]
      const order: Order = {
        id,
        client: action.payload.client,
        contact: action.payload.contact,
        items: action.payload.items,
        notes: action.payload.notes,
        createdAt,
        status: action.payload.status ?? 'Pending Approval',
        source: action.payload.source,
        deliveryAddress: action.payload.deliveryAddress,
        trackingInfo: action.payload.trackingInfo,
      }
      return { ...state, orders: [order, ...state.orders] }
    }
    case 'UPDATE_USERS':
      return { ...state, users: action.payload }
    case 'UPDATE_MACHINES':
      return { ...state, machines: action.payload }
    case 'UPDATE_PRICING':
      return { ...state, pricing: action.payload }
    case 'UPDATE_SLAS':
      return { ...state, slas: action.payload }
    case 'UPDATE_SYSTEM_SETTINGS':
      return { ...state, systemSettings: action.payload }
    case 'RESET':
      return createInitialState()
    default:
      return state
  }
}

export function useAppState() {
  const [state, dispatch] = useReducer(appReducer, undefined, createInitialState)

  const createTicket = useCallback((payload: CreateTicketInput) => {
    dispatch({ type: 'CREATE_TICKET', payload })
  }, [])

  const updateTicket = useCallback((id: string, updates: Partial<Ticket>) => {
    dispatch({ type: 'UPDATE_TICKET', payload: { id, updates } })
  }, [])

  const addTicketComment = useCallback((id: string, text: string, user: string, time: string) => {
    dispatch({ type: 'ADD_TICKET_COMMENT', payload: { id, text, user, time } })
  }, [])

  const toggleRfqItem = useCallback((item: CatalogItem) => {
    dispatch({ type: 'TOGGLE_RFQ_ITEM', payload: item })
  }, [])

  const removeRfqItem = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_RFQ_ITEM', payload: { id } })
  }, [])

  const updateRfqQty = useCallback((id: string, qty: number) => {
    dispatch({ type: 'UPDATE_RFQ_QTY', payload: { id, qty } })
  }, [])

  const clearRfqCart = useCallback(() => {
    dispatch({ type: 'CLEAR_RFQ' })
  }, [])

  const createOrder = useCallback((payload: CreateOrderInput) => {
    dispatch({ type: 'CREATE_ORDER', payload })
  }, [])

  const updateUsers = useCallback((payload: AdminUser[]) => {
    dispatch({ type: 'UPDATE_USERS', payload })
  }, [])

  const updateMachines = useCallback((payload: MachineRecord[]) => {
    dispatch({ type: 'UPDATE_MACHINES', payload })
  }, [])

  const updatePricing = useCallback((payload: PricingRecord[]) => {
    dispatch({ type: 'UPDATE_PRICING', payload })
  }, [])

  const updateSlas = useCallback((payload: SlaRecord[]) => {
    dispatch({ type: 'UPDATE_SLAS', payload })
  }, [])

  const updateSystemSettings = useCallback((payload: SystemSettings) => {
    dispatch({ type: 'UPDATE_SYSTEM_SETTINGS', payload })
  }, [])

  const resetAppState = useCallback(() => {
    dispatch({ type: 'RESET' })
  }, [])

  return {
    state,
    createTicket,
    updateTicket,
    addTicketComment,
    toggleRfqItem,
    removeRfqItem,
    updateRfqQty,
    clearRfqCart,
    createOrder,
    updateUsers,
    updateMachines,
    updatePricing,
    updateSlas,
    updateSystemSettings,
    resetAppState,
  }
}