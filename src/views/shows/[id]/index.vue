<template>
    <div class="show-detail">
        <a-page-header :title="show.name" @back="router.back()">
            <template #extra>
                <a-button @click="router.push(`/shows/${id}/edit`)">
                    <template #icon>
                        <icon-edit />
                    </template>
                    编辑
                </a-button>
            </template>
        </a-page-header>

        <a-card class="detail-card">
            <a-descriptions :data="descriptionData" layout="inline-horizontal" bordered />
        </a-card>

        <a-card class="sessions-card">
            <template #title>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span>演出场次</span>
                    <a-button type="primary" @click="handleCreateSession">
                        <template #icon>
                            <icon-plus />
                        </template>
                        新增场次
                    </a-button>
                </div>
            </template>
            <a-table :data="sessions" :loading="loading" :pagination="false">
                <template #columns>
                    <a-table-column title="场次名称" data-index="name" />
                    <a-table-column title="开始时间" data-index="startTime">
                        <template #cell="{ record }">
                            {{ formatDateTime(record.startTime) }}
                        </template>
                    </a-table-column>
                    <a-table-column title="结束时间" data-index="endTime">
                        <template #cell="{ record }">
                            {{ formatDateTime(record.endTime) }}
                        </template>
                    </a-table-column>
                    <a-table-column title="操作" fixed="right" :width="180">
                        <template #cell="{ record }">
                            <a-space>
                                <a-button type="text" size="small" @click="handleEditSession(record)">编辑</a-button>
                                <a-button type="text" size="small" @click="router.push(`/shows/${id}/sessions/${record.id}`)">票档管理</a-button>
                            </a-space>
                        </template>
                    </a-table-column>
                </template>
            </a-table>
        </a-card>

        <session-dialog v-model:visible="dialogVisible" :mode="dialogMode" :session-data="currentSession"
            @submit="handleDialogSubmit" />

        <ticket-tier-dialog v-model:visible="ticketTierDialogVisible" :mode="ticketTierDialogMode"
            :ticket-tier-data="currentTicketTier" @submit="handleTicketTierSubmit" />
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Message } from '@arco-design/web-vue'
import type { TableData } from '@arco-design/web-vue/es/table/interface'
import SessionDialog from './components/SessionDialog.vue'
import TicketTierDialog from './components/TicketTierDialog.vue'
import type { TicketTier } from '@/types/ticketTier'

interface Show {
    id: string
    name: string
    description: string
    startTime: string
    endTime: string
    venue: string
    priceRange: string
    status: 'upcoming' | 'ongoing' | 'ended'
    organizer: string
    contact: string
}

interface Session extends TableData {
    id: string
    showId: string
    name: string
    startTime: string
    endTime: string
}

const router = useRouter()
const route = useRoute()
const id = route.params.id as string

const dialogVisible = ref(false)
const dialogMode = ref<'create' | 'edit' | 'view'>('create')
const currentSession = ref<Partial<Session>>({})
const ticketTiers = ref<TicketTier[]>([])
const ticketTierDialogVisible = ref(false)
const ticketTierDialogMode = ref<'create' | 'edit' | 'view'>('create')
const currentTicketTier = ref<Partial<TicketTier>>({})

// 处理新增场次
const handleCreateSession = () => {
    dialogMode.value = 'create'
    currentSession.value = {}
    dialogVisible.value = true
}

// 处理编辑场次
const handleEditSession = (session: Session) => {
    dialogMode.value = 'edit'
    currentSession.value = { ...session }
    dialogVisible.value = true
}

// 处理弹窗提交
const handleDialogSubmit = async (sessionData: Partial<Session>) => {
    try {
        if (dialogMode.value === 'create') {
            // TODO: 调用创建场次API
            Message.success('创建场次成功')
        } else {
            // TODO: 调用更新场次API
            Message.success('更新场次成功')
        }
        dialogVisible.value = false
        // 重新加载场次列表
        await fetchSessions()
    } catch (error) {
        Message.error('操作失败')
    }
}

const show = ref<Show>({
    id: '1',
    name: '2024年春节音乐会',
    description: '一场充满节日气氛的音乐盛宴',
    startTime: '2024-02-10 19:30:00',
    endTime: '2024-02-10 21:30:00',
    venue: '国家大剧院音乐厅',
    priceRange: '180-580元',
    status: 'upcoming',
    organizer: '国家大剧院',
    contact: '010-12345678'
})

const sessions = ref<Session[]>([])
const loading = ref(false)

const descriptionData = computed(() => [
    {
        label: '演出时间',
        value: `${formatDateTime(show.value.startTime)} - ${formatDateTime(show.value.endTime)}`
    },
    {
        label: '演出地点',
        value: show.value.venue
    },
    {
        label: '票价范围',
        value: show.value.priceRange
    },
    {
        label: '演出状态',
        value: getStatusText(show.value.status)
    },
    {
        label: '主办方',
        value: show.value.organizer
    },
    {
        label: '联系方式',
        value: show.value.contact
    },
    {
        label: '演出介绍',
        value: show.value.description
    }
])

// 获取演出详情
const fetchShowDetail = async () => {
    try {
        // TODO: 调用后端 API 获取演出详情
    } catch (error) {
        Message.error('获取演出详情失败')
    }
}

// 获取场次列表
const fetchSessions = async () => {
    loading.value = true
    try {
        // TODO: 调用后端 API 获取场次列表
        sessions.value = [
            {
                id: '1',
                showId: id,
                startTime: '2024-02-10 19:30:00',
                status: 'not_started'
            }
        ]
    } catch (error) {
        Message.error('获取场次列表失败')
    } finally {
        loading.value = false
    }
}

// 格式化日期时间
const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('zh-CN')
}

// 获取演出状态文本
const getStatusText = (status: Show['status']) => {
    const textMap = {
        upcoming: '即将开始',
        ongoing: '进行中',
        ended: '已结束'
    }
    return textMap[status]
}

// 获取场次状态颜色
const getSessionStatusColor = (status: Session['status']) => {
    const colorMap = {
        not_started: 'blue',
        on_sale: 'green',
        sold_out: 'red',
        ended: 'gray'
    }
    return colorMap[status]
}

// 获取场次状态文本
const getSessionStatusText = (status: Session['status']) => {
    const textMap = {
        not_started: '未开始',
        on_sale: '售票中',
        sold_out: '已售罄',
        ended: '已结束'
    }
    return textMap[status]
}

// 处理票档管理
const handleTicketTiers = async (session: Session) => {
    try {
        // TODO: 调用后端 API 获取票档列表
        ticketTiers.value = []
        // 显示票档列表弹窗
        ticketTierDialogMode.value = 'create'
        currentTicketTier.value = { sessionId: session.id }
        ticketTierDialogVisible.value = true
    } catch (error) {
        console.error(error)
        Message.error('获取票档列表失败')
    }
}

// 处理票档提交
const handleTicketTierSubmit = async (data: Partial<TicketTier>) => {
    try {
        // TODO: 调用后端 API 保存票档数据
        Message.success('保存成功')
        ticketTierDialogVisible.value = false
        // 重新加载票档列表
        await handleTicketTiers({ id: data.sessionId } as Session)
    } catch (error) {
        Message.error('保存失败')
    }
}

onMounted(() => {
    fetchShowDetail()
    fetchSessions()
})
</script>

<style scoped>
.show-detail {
    padding: 20px;
}

.detail-card {
    margin: 16px 0;
}

.sessions-card {
    margin-top: 16px;
}
</style>