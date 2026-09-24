export type UserRole = 'Miho Admin' | 'Field Engineer' | 'Procurement Manager' | 'Brewery Engineer'

export interface AuthUser {
  name: string
  email: string
  role: UserRole
  plant: string
  phone: string
}

export type Screen = 'dashboard' | 'catalog' | 'tickets' | 'orders' | 'admin' | 'profile' | 'ticket-detail' | 'calendar' | 'rfq-cart'

export interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
}

export interface TicketComment {
  text: string
  user: string
  time: string
}

export interface Ticket {
  id: string
  machine: string
  type: string
  status: 'Open' | 'In Progress' | 'Closed'
  priority: 'Critical' | 'High' | 'Normal' | 'Scheduled'
  date: string
  desc: string
  assignee?: string
  timeline?: { time: string; event: string; user: string }[]
  comments?: TicketComment[]
}

export interface CatalogItem {
  id: string
  name: string
  category: string
  price: string
  stock: 'In Stock' | 'Backordered'
  desc: string
  img: string
}

export interface RfqLineItem {
  id: string
  name: string
  category: string
  price: string
  qty: number
}

export interface OrderLineItem {
  id: string
  type: 'part' | 'service'
  name: string
  qty: number
  price: string
}

export interface Order {
  id: string
  client: string
  contact: string
  items: OrderLineItem[]
  notes: string
  createdAt: string
  status: 'Pending Approval' | 'Processing' | 'Shipped' | 'Delivered'
  source: 'RFQ' | 'Admin OBOF'
  deliveryAddress?: string
  trackingInfo?: string
}

export interface AdminUser {
  id: string
  name: string
  email: string
  role: UserRole
  plant: string
  status: 'Active' | 'Inactive'
  lastLogin: string
}

export interface MachineRecord {
  id: string
  model: string
  type: string
  plant: string
  line: string
  installed: string
  warranty: 'Active' | 'Expired'
  serial: string
}

export interface PricingRecord {
  id: string
  name: string
  price: number
  stock: number
  category: string
  threshold: number
}

export interface SlaRecord {
  type: string
  color: string
  response: string
  resolution: string
  unit: string
  escalation: string
}

export interface SystemSettings {
  companyName: string
  supportEmail: string
  supportPhone: string
  timezone: string
  currency: string
  dateFormat: string
  language: string
  backupSchedule: string
}

export interface AppState {
  tickets: Ticket[]
  catalogItems: CatalogItem[]
  rfqCart: RfqLineItem[]
  orders: Order[]
  users: AdminUser[]
  machines: MachineRecord[]
  pricing: PricingRecord[]
  slas: SlaRecord[]
  systemSettings: SystemSettings
}
