import type { PerformanceTicket } from '@/types'
import axios from 'axios'

const API_BASE_URL = '/api'

const api = axios.create({
    baseURL: API_BASE_URL
})

/** 获取场次票档列表 */
export const getSessionTickets = async (performanceId: number, sessionId: number) => {
    const response = await api.get<PerformanceTicket[]>(`/performances/${performanceId}/sessions/${sessionId}/tickets`)
    return response.data
}

/** 获取单个票档详情 */
export const getTicket = async (performanceId: number, sessionId: number, ticketId: number) => {
    const response = await api.get<PerformanceTicket>(`/performances/${performanceId}/sessions/${sessionId}/tickets/${ticketId}`)
    return response.data
}

/** 创建票档 */
export const createTicket = async (performanceId: number, sessionId: number, ticket: Omit<PerformanceTicket, 'id'>) => {
    const response = await api.post<PerformanceTicket>(`/performances/${performanceId}/sessions/${sessionId}/tickets`, ticket)
    return response.data
}

/** 更新票档 */
export const updateTicket = async (performanceId: number, sessionId: number, ticketId: number, ticket: Partial<PerformanceTicket>) => {
    const response = await api.put<PerformanceTicket>(`/performances/${performanceId}/sessions/${sessionId}/tickets/${ticketId}`, ticket)
    return response.data
}

/** 删除票档 */
export const deleteTicket = async (performanceId: number, sessionId: number, ticketId: number) => {
    await api.delete(`/performances/${performanceId}/sessions/${sessionId}/tickets/${ticketId}`)
    return true
}

/** 根据价格范围查询票档列表 */
export const getTicketsByPriceRange = async (performanceId: number, sessionId: number, minPrice: number, maxPrice: number) => {
    const response = await api.get<PerformanceTicket[]>(
        `/performances/${performanceId}/sessions/${sessionId}/tickets?minPrice=${minPrice}&maxPrice=${maxPrice}`
    )
    return response.data
}

/** 根据区域查询票档列表 */
export const getTicketsByArea = async (performanceId: number, sessionId: number, area: string) => {
    const response = await api.get<PerformanceTicket[]>(
        `/performances/${performanceId}/sessions/${sessionId}/tickets?area=${area}`
    )
    return response.data
}

/** 根据库存状态查询票档列表 */
export const getTicketsByStockStatus = async (performanceId: number, sessionId: number, hasStock: boolean) => {
    const response = await api.get<PerformanceTicket[]>(
        `/performances/${performanceId}/sessions/${sessionId}/tickets?hasStock=${hasStock}`
    )
    return response.data
}