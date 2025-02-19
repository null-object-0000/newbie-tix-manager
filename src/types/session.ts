export interface Session {
  id: string
  showId: string
  startTime: string
  status: 'not_started' | 'on_sale' | 'sold_out' | 'ended'
}