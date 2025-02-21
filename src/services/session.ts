import type { PerformanceSession } from '@/types'
import axios from 'axios'

const API_BASE_URL = '/api'

const api = axios.create({
    baseURL: API_BASE_URL
})

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

/** 根据状态查询场次列表 */
export const getSessionsByStatus = async (performanceId: number, status: string) => {
    const response = await api.get<PerformanceSession[]>(`/performances/${performanceId}/sessions?status=${status}`)
    return response.data
}

/** 根据时间范围查询场次列表 */
export const getSessionsByTimeRange = async (performanceId: number, startTime: string, endTime: string) => {
    const response = await api.get<PerformanceSession[]>(
        `/performances/${performanceId}/sessions?startTime=${startTime}&endTime=${endTime}`
    )
    return response.data
}