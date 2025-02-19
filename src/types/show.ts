export interface Show {
  id: string
  name: string
  description: string
  startTime: string
  endTime: string
  venue: string
  organizer: string
  contact: string
  status: 'upcoming' | 'ongoing' | 'ended'
}