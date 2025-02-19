export interface TicketTier {
  id: string
  sessionId: string
  name: string
  price: number
  totalSeats: number
  availableSeats: number
  status: 'available' | 'sold_out'
}