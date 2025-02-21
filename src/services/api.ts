import type { Performance, PerformanceStatus, PerformanceSession, PerformanceTicket, Order } from '@/types'
import axios from 'axios'

const PROD_API_BASE_URL = 'https://newbie-tix-agclrqqnvz.cn-shanghai.fcapp.run/manager/api'
const DEV_API_BASE_URL = '/manager/api'

const API_BASE_URL = import.meta.env.PROD ? PROD_API_BASE_URL : DEV_API_BASE_URL

const api = axios.create({
    baseURL: API_BASE_URL
})

/** 获取所有演出数据 */
export const getPerformances = async () => {
    const response = await api.get<Performance[]>('/performances')
    return response.data
}

/** 根据条件筛选演出 */
export const filterPerformances = async (params: {
    title?: string
    venue?: string
    status?: PerformanceStatus | ''
}) => {
    const queryParams = new URLSearchParams()
    if (params.title) queryParams.append('title', params.title)
    if (params.venue) queryParams.append('venue', params.venue)
    if (params.status) queryParams.append('status', params.status)

    const response = await api.get<Performance[]>(`/performances?${queryParams.toString()}`)
    return response.data
}

/** 获取单个演出详情 */
export const getPerformance = async (id: number) => {
    const response = await api.get(`/performances/${id}`)
    if (response && response.data) {
        response.data.images = JSON.parse(response.data.images)
        response.data.notices = JSON.parse(response.data.notices)
    }
    return response.data as Performance
}

/** 创建演出 */
export const createPerformance = async (performance: Omit<Performance, 'id'>) => {

    const response = await api.post<Performance>('/performances', {
        ...performance,
        images: JSON.stringify(performance.images),
        notices: JSON.stringify(performance.notices)
    })
    return response.data
}

/** 更新演出 */
export const updatePerformance = async (id: number, performance: Partial<Performance>) => {
    const response = await api.put<Performance>(`/performances/${id}`, {
        ...performance,
        images: JSON.stringify(performance.images),
        notices: JSON.stringify(performance.notices)
    })
    return response.data
}

/** 删除演出 */
export const deletePerformance = async (id: number) => {
    await api.delete(`/performances/${id}`)
    return true
}

/** 演出下架 */
export const takeOffline = async (id: number) => {
    const response = await api.put<Performance>(`/performances/${id}/offline`)
    return response.data
}

/** 演出上架 */
export const takeOnline = async (id: number) => {
    const response = await api.put<Performance>(`/performances/${id}/online`)
    return response.data
}

/** 获取演出场次列表 */
export const getPerformanceSessions = async (performanceId: number) => {
    const response = await api.get<PerformanceSession[]>(`/performances/${performanceId}/sessions`)
    return response.data
}

/** 获取单个场次详情 */
export const getPerformanceSession = async (performanceId: number, sessionId: number) => {
    const response = await api.get<PerformanceSession>(`/performances/${performanceId}/sessions/${sessionId}`)
    return response.data
}

/** 创建场次 */
export const createSession = async (performanceId: number, session: Omit<PerformanceSession, 'id'>) => {
    const response = await api.post<PerformanceSession>(`/performances/${performanceId}/sessions`, session)
    return response.data
}

/** 更新场次 */
export const updateSession = async (performanceId: number, sessionId: number, session: Partial<PerformanceSession>) => {
    const response = await api.put<PerformanceSession>(`/performances/${performanceId}/sessions/${sessionId}`, session)
    return response.data
}

/** 删除场次 */
export const deleteSession = async (performanceId: number, sessionId: number) => {
    await api.delete(`/performances/${performanceId}/sessions/${sessionId}`)
    return true
}

/** 获取所有订单 */
export const getOrders = async () => {
    const response = await api.get<Order[]>('/orders')
    return response.data
}

/** 根据条件筛选订单 */
export const filterOrders = async (params: {
    orderNo?: string
    status?: string
    startTime?: string
    endTime?: string
}) => {
    const queryParams = new URLSearchParams()
    if (params.orderNo) queryParams.append('orderNo', params.orderNo)
    if (params.status) queryParams.append('status', params.status)
    if (params.startTime) queryParams.append('startTime', params.startTime)
    if (params.endTime) queryParams.append('endTime', params.endTime)

    const response = await api.get<Order[]>(`/orders?${queryParams.toString()}`)
    return response.data
}

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

/** 上传图片 */
export const uploadImage = async (file: File) => {
    const formData = new FormData()
    formData.append('action', 'upload')
    formData.append('source', file)
    formData.append('format', 'json')

    const response = await api.post('/upload/file/image', formData)
    if (response.data.status_code === 200 && response.data.image && response.data.image.url) {
        return response.data.image.url
    }
    throw new Error(response.data.error?.message || '上传失败')
}