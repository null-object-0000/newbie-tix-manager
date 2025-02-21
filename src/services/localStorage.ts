import type { Performance, PerformanceSession, PerformanceTicket, Order } from '@/types'

/** 本地存储键名 */
const STORAGE_KEY = 'newbie-tix-performances'
const SESSIONS_KEY = 'newbie-tix-sessions'
const ORDERS_KEY = 'newbie-tix-orders'

/** 获取所有演出数据 */
export const getPerformances = () => {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) as Performance[] : []
}

/** 获取单个演出详情 */
export const getPerformance = (id: number) => {
    const performances = getPerformances()
    return performances.find(item => item.id === id)
}

/** 获取演出场次列表 */
export const getPerformanceSessions = (performanceId: number) => {
    const data = localStorage.getItem(SESSIONS_KEY)
    const sessions = data ? JSON.parse(data) : {}
    return (sessions[performanceId] || []) as PerformanceSession[]
}

/** 获取单个场次详情 */
export const getPerformanceSession = (performanceId: number, sessionId: number) => {
    const sessions = getPerformanceSessions(performanceId)
    return sessions.find(item => item.id === sessionId)
}

/** 票档存储键名 */
const TICKETS_KEY = 'newbie-tix-tickets'

/** 获取场次票档列表 */
export const getPerformanceTickets = (performanceId: number, sessionId?: number) => {
    if (!sessionId) return []
    const data = localStorage.getItem(TICKETS_KEY)
    const tickets = data ? JSON.parse(data) : {}
    const key = `${performanceId}-${sessionId}`
    return (tickets[key] || []) as PerformanceTicket[]
}