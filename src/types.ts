export type UserRole = 'Miho Admin' | 'Field Engineer' | 'Procurement Manager' | 'Brewery Engineer'

export interface AuthUser {
  name: string
  email: string
  role: UserRole
  plant: string
  phone: string
}

export type Screen = 'dashboard' | 'catalog' | 'tickets' | 'orders' | 'admin' | 'profile' | 'ticket-detail' | 'machine-detail' | 'calendar' | 'rfq-cart'

export interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
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
}
