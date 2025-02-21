<template>
    <div class="performance-tickets">
        <a-typography-title :heading="3" style="margin-top: 0px; margin-bottom: 24px">票档管理</a-typography-title>


        <!-- 基本信息 -->
        <a-card class="info-card" style="margin-bottom: 16px">
            <template #title>基本信息</template>
            <div class="info-content">
                <div class="performance-info">
                    <div class="performance-cover">
                        <img :src="performance?.coverUrl" alt="演出封面" />
                    </div>
                    <div class="performance-details">
                        <a-descriptions :data="performanceInfo" layout="inline-horizontal" :column="1" />
                    </div>
                </div>
                <div class="session-info">
                    <a-descriptions :data="sessionInfo" layout="inline-horizontal" :column="1" />
                </div>
            </div>
        </a-card>

        <!-- 票档列表 -->
        <a-card>
            <template #title>
                <a-space>
                    <a-button type="primary" @click="handleAddTicket">
                        <template #icon><icon-plus /></template>
                        添加票档
                    </a-button>
                </a-space>
            </template>

            <!-- 票档表格 -->
            <a-table :data="tickets" :loading="loading" :pagination="false" :bordered="false">
                <template #columns>
                    <a-table-column title="票档ID" data-index="id" :width="85" />
                    <a-table-column title="票档标题" data-index="title" :width="150" />
                    <a-table-column title="票档价格" :width="120">
                        <template #cell="{ record }">
                            ¥{{ record.price }}
                        </template>
                    </a-table-column>
                    <a-table-column title="总票数" data-index="totalQuantity" :width="150" />
                    <a-table-column title="操作" :width="150">
                        <template #cell="{ record }">
                            <a-button type="text" size="small" @click="handleEditTicket(record)">
                                编辑
                            </a-button>
                            <a-button type="text" status="danger" size="small" @click="handleDeleteTicket(record)">
                                删除
                            </a-button>
                        </template>
                    </a-table-column>
                </template>
            </a-table>
        </a-card>

        <!-- 票档编辑对话框 -->
        <a-modal v-model:visible="ticketModalVisible" :title="currentTicket ? '编辑票档' : '新增票档'"
            :on-before-ok="handleTicketSubmit" @cancel="handleTicketCancel">
            <a-form ref="ticketFormRef" :model="ticketForm" :rules="ticketRules" auto-label-width>
                <a-form-item field="title" label="票档标题" :rules="[{ required: true, message: '请输入票档标题' }]">
                    <a-input v-model="ticketForm.title" placeholder="请输入票档标题" allow-clear />
                </a-form-item>
                <a-form-item field="price" label="票档价格" :rules="[{ required: true, message: '请输入票档价格' }]">
                    <a-input-number v-model="ticketForm.price" :min="0" :precision="2" placeholder="请输入票档价格" />
                </a-form-item>
                <a-form-item field="totalQuantity" label="总票数" :rules="[{ required: true, message: '请输入总票数' }]">
                    <a-input-number v-model="ticketForm.totalQuantity" :min="1" :precision="0" placeholder="请输入总票数" />
                </a-form-item>
            </a-form>
        </a-modal>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onBeforeMount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Message, Modal } from '@arco-design/web-vue'
import type { Performance, PerformanceSession, PerformanceStatus, PerformanceTicket } from '@/types'
import { getPerformance, getPerformanceSession, getSessionTickets, createTicket, updateTicket, deleteTicket } from '@/services/api'
import { PERFORMANCE_STATUS_MAP } from '@/types/constants'

const route = useRoute()
const router = useRouter()

// 演出和场次信息
const performance = ref<Performance | null>(null)
const session = ref<PerformanceSession | null>(null)

// 演出基本信息
const performanceInfo = computed(() => {
    if (!performance.value) return []
    return [
        { label: '演出标题', value: performance.value.title },
        { label: '演出场馆', value: performance.value.venue },
        { label: '演出状态', value: PERFORMANCE_STATUS_MAP[performance.value.status] }
    ]
})

// 场次信息
const sessionInfo = computed(() => {
    if (!performance.value || !session.value) return []
    return [
        { label: '场次标题', value: session.value.title || '无' },
        { label: '售卖时间', value: `${formatDateTime(session.value.startSaleTime)} - ${formatDateTime(session.value.endSaleTime)}` },
        { label: '演出时间', value: `${formatDateTime(session.value.startShowTime)} - ${formatDateTime(session.value.endShowTime)}` }
    ]
})

// 票档列表
const loading = ref(false)
const tickets = ref<any[]>([])

// 票档表单
const ticketModalVisible = ref(false)
const ticketFormRef = ref()
const currentTicket = ref<any | null>(null)
const ticketForm = reactive({
    title: '',
    price: 0,
    totalQuantity: 0,
    status: 'ON_SALE' as PerformanceStatus
})

const ticketRules = {
    title: [{ required: true, message: '请输入票档标题' }],
    price: [{ required: true, message: '请输入票档价格' }],
    totalQuantity: [{ required: true, message: '请输入总票数' }]
}

// 初始化加载数据
onBeforeMount(async () => {
    const performanceId = Number(route.params.performanceId)
    const sessionId = Number(route.params.sessionId)
    if (performanceId && sessionId) {
        const performanceData = await getPerformance(performanceId)
        const sessionData = await getPerformanceSession(performanceId, sessionId)
        if (performanceData && sessionData) {
            performance.value = performanceData
            session.value = sessionData

            // 加载票档数据
            await refreshTickets()
        } else {
            Message.error('场次不存在')
            router.push(`/performances/${performanceId}/sessions`)
        }
    }
})

const refreshTickets = async () => {
    const performanceId = Number(route.params.performanceId)
    const sessionId = Number(route.params.sessionId)
    if (performanceId && sessionId) {
        loading.value = true
        tickets.value = await getSessionTickets(performanceId, sessionId)
        loading.value = false
    }
}

// 处理添加票档
const handleAddTicket = () => {
    currentTicket.value = null
    ticketForm.title = ''
    ticketForm.price = 0
    ticketForm.totalQuantity = 0
    ticketForm.status = 'ON_SALE'
    ticketModalVisible.value = true
}

// 处理编辑票档
const handleEditTicket = (ticket: PerformanceTicket) => {
    currentTicket.value = ticket
    ticketForm.title = ticket.title
    ticketForm.price = ticket.price
    ticketForm.totalQuantity = ticket.totalQuantity
    ticketForm.status = ticket.status
    ticketModalVisible.value = true
}

// 处理票档表单提交
const handleTicketSubmit = async (done: (closed: boolean) => void) => {
    if (!ticketFormRef.value) return

    try {
        // 等待表单验证完成
        const errors = await ticketFormRef.value.validate()
        if (errors) {
            console.error('表单验证失败:', errors)
            return done(false)
        }

        const performanceId = Number(route.params.performanceId)
        const sessionId = Number(route.params.sessionId)
        const ticketData = {
            performanceId: performanceId,
            sessionId: sessionId,
            title: ticketForm.title,
            price: ticketForm.price,
            totalQuantity: ticketForm.totalQuantity,
            status: ticketForm.status
        } as PerformanceTicket

        if (currentTicket.value) {
            // 更新票档
            const result = await updateTicket(performanceId, sessionId, currentTicket.value.id, ticketData)
            if (result) {
                const index = tickets.value.findIndex(item => item.id === currentTicket.value?.id)
                if (index !== -1) {
                    tickets.value[index] = result
                }
                Message.success('更新成功')
                refreshTickets()
                return done(true)
            }
        } else {
            // 创建票档
            const result = await createTicket(performanceId, sessionId, ticketData)
            tickets.value.push(result)
            Message.success('创建成功')
            refreshTickets()
            return done(true)
        }

        Message.error('操作失败')
        return done(false)
    } catch (error) {
        console.error('表单验证失败:', error)
        Message.error('请填写必填项')
        return done(false)
    }
}

// 处理删除票档
const handleDeleteTicket = async (ticket: any) => {
    Modal.warning({
        title: '确认删除',
        content: '确定要删除该票档吗？',
        hideCancel: false,
        onOk: async () => {
            const performanceId = Number(route.params.performanceId)
            const sessionId = Number(route.params.sessionId)
            if (await deleteTicket(performanceId, sessionId, ticket.id)) {
                tickets.value = tickets.value.filter(item => item.id !== ticket.id)
                Message.success('删除成功')
            } else {
                Message.error('删除失败')
            }
        }
    })
}

// 处理票档表单取消
const handleTicketCancel = () => {
    ticketModalVisible.value = false
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
</script>

<style scoped>
.performance-tickets {
    padding: 24px;
}

.info-content {
    display: flex;
    gap: 24px;
}

.performance-info {
    flex: 1;
    display: flex;
    gap: 24px;
}

.performance-cover {
    width: 100px;
    height: calc(100px * 4 / 3);
    overflow: hidden;
    border-radius: 4px;
}

.performance-cover img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.performance-details {
    flex: 1;
    padding: 8px 0;
}

.session-info {
    flex: 1;
    padding-left: 24px;
    border-left: 1px solid var(--color-neutral-3);
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