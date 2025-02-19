export interface Session {
  id: string
  showId: string
  name: string
  startTime: string
  endTime: string
  status: 'not_started' | 'on_sale' | 'sold_out' | 'ended'
}