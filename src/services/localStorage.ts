import type { Performance, PerformanceSession, PerformanceStatus, PerformanceTicket, Order } from '@/types'

/** 本地存储键名 */
const STORAGE_KEY = 'newbie-tix-performances'
const SESSIONS_KEY = 'newbie-tix-sessions'
const ORDERS_KEY = 'newbie-tix-orders'

/** 生成唯一ID */
const generateId = () => Math.floor(Math.random() * 1000000)

/** 生成订单编号 */
const generateOrderNo = () => {
    const timestamp = Date.now()
    const random = Math.floor(Math.random() * 1000)
    return `${timestamp}${random}`
}

/** 获取所有演出数据 */
export const getPerformances = () => {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) as Performance[] : []
}

/** 保存所有演出数据 */
const savePerformances = (performances: Performance[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(performances))
}

/** 根据条件筛选演出 */
export const filterPerformances = (params: {
    title?: string
    venue?: string
    status?: PerformanceStatus | ''
}) => {
    const performances = getPerformances()
    return performances.filter(item => {
        if (params.title && !item.title.includes(params.title)) return false
        if (params.venue && !item.venue.includes(params.venue)) return false
        if (params.status && item.status !== params.status) return false
        return true
    })
}

/** 获取单个演出详情 */
export const getPerformance = (id: number) => {
    const performances = getPerformances()
    return performances.find(item => item.id === id)
}

/** 创建演出 */
export const createPerformance = (performance: Omit<Performance, 'id'>) => {
    const performances = getPerformances()
    const newPerformance = {
        ...performance,
        id: generateId(),
        status: 'coming_soon' as const
    }
    performances.push(newPerformance)
    savePerformances(performances)
    return newPerformance
}

/** 更新演出 */
export const updatePerformance = (id: number, performance: Partial<Performance>) => {
    const performances = getPerformances()
    const index = performances.findIndex(item => item.id === id)
    if (index === -1) return null

    const updatedPerformance = {
        ...performances[index],
        ...performance
    }
    performances[index] = updatedPerformance
    savePerformances(performances)
    return updatedPerformance
}

/** 删除演出 */
export const deletePerformance = (id: number) => {
    const performances = getPerformances()
    const index = performances.findIndex(item => item.id === id)
    if (index === -1) return false

    performances.splice(index, 1)
    savePerformances(performances)
    return true
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

/** 保存演出场次列表 */
const savePerformanceSessions = (performanceId: number, sessions: PerformanceSession[]) => {
    const data = localStorage.getItem(SESSIONS_KEY)
    const allSessions = data ? JSON.parse(data) : {}
    allSessions[performanceId] = sessions
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(allSessions))
}

/** 创建场次 */
export const createSession = (performanceId: number, session: Omit<PerformanceSession, 'id'>) => {
    const sessions = getPerformanceSessions(performanceId)
    const newSession = {
        ...session,
        id: generateId()
    }
    sessions.push(newSession)
    savePerformanceSessions(performanceId, sessions)
    return newSession
}

/** 更新场次 */
export const updateSession = (performanceId: number, sessionId: number, session: Partial<PerformanceSession>) => {
    const sessions = getPerformanceSessions(performanceId)
    const index = sessions.findIndex(item => item.id === sessionId)
    if (index === -1) return null

    const updatedSession = {
        ...sessions[index],
        ...session
    }
    sessions[index] = updatedSession
    savePerformanceSessions(performanceId, sessions)
    return updatedSession
}

/** 删除场次 */
export const deleteSession = (performanceId: number, sessionId: number) => {
    const sessions = getPerformanceSessions(performanceId)
    const index = sessions.findIndex(item => item.id === sessionId)
    if (index === -1) return false

    sessions.splice(index, 1)
    savePerformanceSessions(performanceId, sessions)
    return true
}

/** 票档存储键名 */
const TICKETS_KEY = 'newbie-tix-tickets'

/** 获取场次票档列表 */
export const getPerformanceTickets = (performanceId: number, sessionId: number) => {
    const data = localStorage.getItem(TICKETS_KEY)
    const tickets = data ? JSON.parse(data) : {}
    const key = `${performanceId}-${sessionId}`
    return (tickets[key] || []).map(ticket => ({
        ...ticket,
        status: ticket.remainingQuantity > 0 ? 'on_sale' : 'sold_out'
    })) as PerformanceTicket[]
}

/** 保存场次票档列表 */
const savePerformanceTickets = (performanceId: number, sessionId: number, tickets: any[]) => {
    const data = localStorage.getItem(TICKETS_KEY)
    const allTickets = data ? JSON.parse(data) : {}
    const key = `${performanceId}-${sessionId}`
    allTickets[key] = tickets
    localStorage.setItem(TICKETS_KEY, JSON.stringify(allTickets))
}

/** 创建票档 */
export const createTicket = (performanceId: number, sessionId: number, ticket: any) => {
    const tickets = getPerformanceTickets(performanceId, sessionId)
    const newTicket = {
        ...ticket,
        id: generateId(),
        performanceId,
        sessionId
    }
    tickets.push(newTicket)
    savePerformanceTickets(performanceId, sessionId, tickets)
    return newTicket
}

/** 更新票档 */
export const updateTicket = (performanceId: number, sessionId: number, ticketId: number, ticket: any) => {
    const tickets = getPerformanceTickets(performanceId, sessionId)
    const index = tickets.findIndex(item => item.id === ticketId)
    if (index === -1) return null

    const updatedTicket = {
        ...tickets[index],
        ...ticket
    }
    tickets[index] = updatedTicket
    savePerformanceTickets(performanceId, sessionId, tickets)
    return updatedTicket
}

/** 删除票档 */
export const deleteTicket = (performanceId: number, sessionId: number, ticketId: number) => {
    const tickets = getPerformanceTickets(performanceId, sessionId)
    const index = tickets.findIndex(item => item.id === ticketId)
    if (index === -1) return false

    tickets.splice(index, 1)
    savePerformanceTickets(performanceId, sessionId, tickets)
    return true
}

/** 获取所有订单 */
export const getOrders = () => {
    const data = localStorage.getItem(ORDERS_KEY)
    return data ? JSON.parse(data) as Order[] : []
}

/** 保存所有订单 */
const saveOrders = (orders: Order[]) => {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders))
}

/** 根据条件筛选订单 */
export const filterOrders = (params: {
    orderNo?: string
    status?: string
    startTime?: string
    endTime?: string
}) => {
    const orders = getOrders()
    return orders.filter(item => {
        if (params.orderNo && !item.orderNo.includes(params.orderNo)) return false
        if (params.status && item.status !== params.status) return false
        if (params.startTime && item.createTime < params.startTime) return false
        if (params.endTime && item.createTime > params.endTime) return false
        return true
    })
}

/** 获取单个订单详情 */
export const getOrder = (orderNo: string) => {
    const orders = getOrders()
    return orders.find(item => item.orderNo === orderNo)
}

/** 创建订单 */
export const createOrder = (order: Omit<Order, 'orderNo' | 'createTime' | 'status'>) => {
    const orders = getOrders()
    const newOrder = {
        ...order,
        orderNo: generateOrderNo(),
        createTime: new Date().toISOString(),
        status: 'pending' as const
    }
    orders.push(newOrder)
    saveOrders(orders)
    return newOrder
}

/** 更新订单 */
export const updateOrder = (orderNo: string, order: Partial<Order>) => {
    const orders = getOrders()
    const index = orders.findIndex(item => item.orderNo === orderNo)
    if (index === -1) return null

    const updatedOrder = {
        ...orders[index],
        ...order
    }
    orders[index] = updatedOrder
    saveOrders(orders)
    return updatedOrder
}