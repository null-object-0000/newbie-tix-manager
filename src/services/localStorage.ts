import type { Performance, PerformanceSession, PerformanceStatus } from '@/types'

/** 本地存储键名 */
const STORAGE_KEY = 'newbie-tix-performances'
const SESSIONS_KEY = 'newbie-tix-sessions'

/** 生成唯一ID */
const generateId = () => Math.floor(Math.random() * 1000000)

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
    return sessions[performanceId] || []
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