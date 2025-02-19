export interface Order {
  id: string
  userId: string
  showId: string
  sessionId: string
  ticketTierId: string
  quantity: number
  totalAmount: number
  status: 'pending' | 'paid' | 'cancelled' | 'refunded'
  createdAt: string
  updatedAt: string
  // 关联信息
  show?: {
    name: string
    venue: string
    startTime: string
  }
  session?: {
    startTime: string
  }
  ticketTier?: {
    name: string
    price: number
  }
  user?: {
    name: string
    phone: string
  }
}