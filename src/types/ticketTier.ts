export interface TicketTier {
  id: string
  sessionId: string
  name: string
  price: number
  stock: number
  sold: number
  status: 'available' | 'sold_out'
}