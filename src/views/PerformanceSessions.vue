<template>
    <div class="performance-sessions">
        <a-typography-title :heading="3" style="margin-top: 0px; margin-bottom: 24px">场次管理</a-typography-title>

        <!-- 演出基本信息 -->
        <a-card class="performance-info" style="margin-bottom: 16px">
            <template #title>基本信息</template>
            <div class="performance-info-content">
                <div class="performance-cover">
                    <img :src="performance?.coverUrl" alt="演出封面" />
                </div>
                <div class="performance-details">
                    <a-descriptions :data="performanceInfo" layout="inline-horizontal" :column="1" />
                </div>
            </div>
        </a-card>

        <!-- 场次列表 -->
        <a-card>
            <template #title>
                <a-space>
                    <a-button type="primary" @click="handleAddSession">
                        <template #icon><icon-plus /></template>
                        添加场次
                    </a-button>
                </a-space>
            </template>

            <!-- 场次表格 -->
            <a-table :data="sessions" :loading="loading" :pagination="false" :bordered="false">
                <template #columns>
                    <a-table-column title="场次ID" data-index="id" :width="100" />
                    <a-table-column title="场次标题" data-index="title" :width="150" />
                    <a-table-column title="售卖时间" :width="300">
                        <template #cell="{ record }: { record: PerformanceSession }">
                            {{ formatDateTime(record.startSaleTime) }} - <br> {{ formatDateTime(record.endSaleTime) }}
                        </template>
                    </a-table-column>
                    <a-table-column title="演出时间" :width="250">
                        <template #cell="{ record }: { record: PerformanceSession }">
                            {{ formatDateTime(record.startShowTime) }} - <br> {{ formatDateTime(record.endShowTime) }}
                        </template>
                    </a-table-column>
                    <a-table-column title="总票数" :width="120">
                        <template #cell="{ record }: { record: PerformanceSession }">
                            0
                        </template>
                    </a-table-column>
                    <a-table-column title="状态" data-index="status" :width="100">
                        <template #cell="{ record }: { record: PerformanceSession }">
                            <a-tag
                                :color="{ 'ON_SALE': 'green', 'COMING_SOON': 'blue', 'SOLD_OUT': 'red', 'OFFLINE': 'orange' }[record.status]">
                                {{ PERFORMANCE_STATUS_MAP[record.status] }}
                            </a-tag>
                        </template>
                    </a-table-column>
                    <a-table-column title="操作" align="center" :width="150">
                        <template #cell="{ record }: { record: PerformanceSession }">
                            <a-space>
                                <a-button type="text" size="small" @click="handleEditSession(record)">
                                    编辑
                                </a-button>
                                <a-button type="text" size="small"
                                    @click="router.push(`/performances/${record.performanceId}/sessions/${record.id}/tickets`)">
                                    票档管理
                                </a-button>
                                <a-button type="text" status="danger" size="small" @click="handleDeleteSession(record)">
                                    删除
                                </a-button>
                            </a-space>
                        </template>
                    </a-table-column>
                </template>
            </a-table>
        </a-card>

        <!-- 场次编辑对话框 -->
        <a-modal v-model:visible="sessionModalVisible" :title="currentSession ? '编辑场次' : '新增场次'"
            :on-before-ok="handleSessionSubmit" @cancel="handleSessionCancel">
            <a-form ref="sessionFormRef" :model="sessionForm" :rules="sessionRules" auto-label-width>
                <a-form-item field="title" label="场次标题">
                    <a-input v-model="sessionForm.title" placeholder="请输入场次标题（可选）" allow-clear />
                </a-form-item>
                <a-form-item field="saleTimeRange" label="售卖时间" :rules="[{ required: true, message: '请选择售卖时间范围' }]">
                    <a-range-picker v-model="sessionForm.saleTimeRange" show-time :placeholder="['开始时间', '结束时间']"
                        value-format="YYYY-MM-DD HH:mm:ss" style="width: 100%" />
                </a-form-item>
                <a-form-item field="showTimeRange" label="演出时间" :rules="[{ required: true, message: '请选择演出时间范围' }]">
                    <a-range-picker v-model="sessionForm.showTimeRange" show-time :placeholder="['开始时间', '结束时间']"
                        value-format="YYYY-MM-DD HH:mm:ss" style="width: 100%" />
                </a-form-item>
            </a-form>
        </a-modal>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Message, Modal } from '@arco-design/web-vue'
import type { Performance, PerformanceSession, PerformanceStatus } from '@/types'
import { PERFORMANCE_STATUS_MAP, PERFORMANCE_STATUS_OPTIONS } from '@/types/constants'
import { getPerformance, getPerformanceSessions, createSession, updateSession, deleteSession, getSessionTickets } from '@/services/api'

const route = useRoute()
const router = useRouter()

// 演出信息
const performance = ref<Performance | null>(null)
const performanceInfo = computed(() => {
    if (!performance.value) return []
    return [
        { label: '演出标题', value: performance.value.title },
        { label: '演出场馆', value: performance.value.venue },
        { label: '演出状态', value: PERFORMANCE_STATUS_MAP[performance.value.status] }
    ]
})

// 场次列表
const loading = ref(false)
const sessions = ref<PerformanceSession[]>([])

// 场次表单
const sessionModalVisible = ref(false)
const sessionFormRef = ref()
const currentSession = ref<PerformanceSession | null>(null)
const sessionForm = reactive({
    title: '',
    performanceId: Number(route.params.id),
    saleTimeRange: [] as string[],
    showTimeRange: [] as string[],
    status: 'COMING_SOON' as PerformanceStatus
})

const sessionRules = {
    saleTimeRange: [{ required: true, message: '请选择售卖时间范围' }],
    showTimeRange: [{ required: true, message: '请选择演出时间范围' }],
    status: [{ required: true, message: '请选择状态' }]
}

// 初始化加载数据
onMounted(async () => {
    const id = Number(route.params.id)
    if (id) {
        try {
            loading.value = true
            const data = await getPerformance(id)
            if (data) {
                performance.value = data
                // 加载场次数据
                const sessionsData = await getPerformanceSessions(id)
                sessions.value = sessionsData
            } else {
                Message.error('演出不存在')
                router.push('/performances')
            }
        } catch (error) {
            console.error('加载数据失败:', error)
            Message.error('加载数据失败')
        } finally {
            loading.value = false
        }
    }
})

// 处理添加场次
const handleAddSession = () => {
    currentSession.value = null
    sessionForm.title = ''
    sessionForm.saleTimeRange = []
    sessionForm.showTimeRange = []
    sessionForm.status = 'COMING_SOON'
    sessionModalVisible.value = true
}

// 处理编辑场次
const handleEditSession = (session: PerformanceSession) => {
    currentSession.value = session
    sessionForm.title = session.title || ''
    sessionForm.saleTimeRange = [session.startSaleTime, session.endSaleTime]
    sessionForm.showTimeRange = [session.startShowTime, session.endShowTime]
    sessionForm.status = session.status
    sessionModalVisible.value = true
}

// 处理场次表单提交
const handleSessionSubmit = async (done: (closed: boolean) => void) => {
    if (!sessionFormRef.value) return

    try {
        // 等待表单验证完成
        const errors = await sessionFormRef.value.validate()
        if (errors) {
            console.error('表单验证失败:', errors)
            return done(false)
        }

        // 验证时间逻辑
        const [startSaleTime, endSaleTime] = sessionForm.saleTimeRange
        const [startShowTime, endShowTime] = sessionForm.showTimeRange

        if (endSaleTime <= startSaleTime) {
            Message.error('售卖结束时间必须晚于售卖开始时间')
            return done(false)
        }

        if (endShowTime <= startShowTime) {
            Message.error('演出结束时间必须晚于演出开始时间')
            return done(false)
        }

        if (startShowTime <= startSaleTime) {
            Message.error('演出开始时间必须晚于售卖开始时间')
            return done(false)
        }

        const performanceId = Number(route.params.id)
        const sessionData = {
            performanceId: performanceId,
            title: sessionForm.title,
            startSaleTime: sessionForm.saleTimeRange[0],
            endSaleTime: sessionForm.saleTimeRange[1],
            startShowTime: sessionForm.showTimeRange[0],
            endShowTime: sessionForm.showTimeRange[1],
            status: sessionForm.status
        }

        if (currentSession.value && currentSession.value.id) {
            try {
                // 更新场次
                const result = await updateSession(performanceId, currentSession.value.id, sessionData)
                if (result) {
                    const index = sessions.value.findIndex(item => item.id === currentSession.value?.id)
                    if (index !== -1) {
                        sessions.value[index] = result
                    }
                    Message.success('更新成功')
                    return done(true)
                }
            } catch (error) {
                console.error('更新场次失败:', error)
                Message.error('更新失败')
                return done(false)
            }
        } else {
            try {
                // 创建场次
                const result = await createSession(performanceId, sessionData)
                sessions.value.push(result)
                Message.success('创建成功')
                return done(true)
            } catch (error) {
                console.error('创建场次失败:', error)
                Message.error('创建失败')
                return done(false)
            }
        }

        Message.error('操作失败')
        return done(false)
    } catch (error) {
        // 表单验证失败，不关闭对话框
        console.error('表单验证失败:', error)
        Message.error('请填写必填项')
        return done(false)
    }
}

// 处理删除场次
const handleDeleteSession = (session: PerformanceSession) => {
    Modal.warning({
        title: '确认删除',
        content: '确定要删除该场次吗？',
        onOk: async () => {
            const performanceId = Number(route.params.id)
            try {
                if (!session.id) {
                    Message.error('场次ID无效')
                    return
                }
                await deleteSession(performanceId, session.id)
                sessions.value = sessions.value.filter(item => item.id !== session.id)
                Message.success('删除成功')
            } catch (error) {
                console.error('删除场次失败:', error)
                Message.error('删除失败')
            }
        }
    })
}

// 处理场次表单取消
const handleSessionCancel = () => {
    sessionModalVisible.value = false
}

// 格式化日期时间
const formatDateTime = (datetime: string) => {
    return new Intl.DateTimeFormat('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    }).format(new Date(datetime))
}

// 格式化日期
const formatDate = (date: string | Date) => {
    const dateObj = date instanceof Date ? date : new Date(date)
    return new Intl.DateTimeFormat('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).format(dateObj).replace(/\//g, '-')
}

// 获取状态文本
const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
        not_started: '未开始',
        in_progress: '进行中',
        ended: '已结束',
        COMING_SOON: '即将开售',
        ON_SALE: '售票中',
        SOLD_OUT: '已售罄'
    }
    return statusMap[status] || status
}

// 获取状态颜色
const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
        not_started: 'blue',
        in_progress: 'green',
        ended: 'gray'
    }
    return colorMap[status] || 'blue'
}
</script>

<style scoped>
.performance-sessions {
    padding: 24px;
}

.performance-info-content {
    display: flex;
    gap: 24px;
    align-items: flex-start;
}

.performance-cover {
    flex-shrink: 0;
    width: 100px;
    height: calc(100px * 4 / 3);
    border-radius: 6px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.performance-cover img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
}

.performance-cover img:hover {
    transform: scale(1.05);
}

.performance-details {
    flex: 1;
    padding: 8px 0;
}

:deep(.arco-descriptions-item) {
    padding: 8px 0;
}

:deep(.arco-descriptions-item-label) {
    color: var(--color-text-3);
    font-weight: 500;
    width: 80px;
    font-size: 14px;
}

:deep(.arco-descriptions-item-value) {
    color: var(--color-text-1);
    font-size: 14px;
}
</style>