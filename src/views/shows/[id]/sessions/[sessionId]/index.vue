<template>
    <div class="session-detail">
        <a-page-header :title="session.name" @back="router.back()">
            <template #extra>
                <a-button @click="handleCreateTicketTier">
                    <template #icon>
                        <icon-plus />
                    </template>
                    新增票档
                </a-button>
            </template>
        </a-page-header>

        <a-card class="detail-card">
            <a-descriptions :data="descriptionData" layout="inline-horizontal" bordered />
        </a-card>

        <a-card class="ticket-tiers-card">
            <template #title>票档列表</template>
            <a-table :data="ticketTiers" :loading="loading" :pagination="false">
                <template #columns>
                    <a-table-column title="票档名称" data-index="name" />
                    <a-table-column title="票价" data-index="price">
                        <template #cell="{ record }">
                            {{ record.price }}元
                        </template>
                    </a-table-column>
                    <a-table-column title="库存数量" data-index="stock" />
                    <a-table-column title="已售数量" data-index="sold" />
                    <a-table-column title="操作" fixed="right" :width="180">
                        <template #cell="{ record }">
                            <a-space>
                                <a-button type="text" size="small" @click="handleEditTicketTier(record)">编辑</a-button>
                                <a-popconfirm content="确定要删除该票档吗？" @ok="handleDeleteTicketTier(record)">
                                    <a-button type="text" size="small" status="danger">删除</a-button>
                                </a-popconfirm>
                            </a-space>
                        </template>
                    </a-table-column>
                </template>
            </a-table>
        </a-card>

        <ticket-tier-dialog v-model:visible="dialogVisible" :mode="dialogMode" :ticket-tier-data="currentTicketTier"
            @submit="handleDialogSubmit" />
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Message } from '@arco-design/web-vue'
import type { TableData } from '@arco-design/web-vue/es/table/interface'
import TicketTierDialog from './components/TicketTierDialog.vue'
import type { TicketTier } from '@/types/ticketTier'

interface Session {
    id: string
    showId: string
    name: string
    startTime: string
    endTime: string
}

const router = useRouter()
const route = useRoute()
const showId = route.params.id as string
const sessionId = route.params.sessionId as string

const session = ref<Session>({
    id: '',
    showId: '',
    name: '',
    startTime: '',
    endTime: ''
})

const ticketTiers = ref<TicketTier[]>([])
const loading = ref(false)
const dialogVisible = ref(false)
const dialogMode = ref<'create' | 'edit'>('create')
const currentTicketTier = ref<Partial<TicketTier>>({})

const descriptionData = computed(() => [
    {
        label: '场次名称',
        value: session.value.name
    },
    {
        label: '开始时间',
        value: formatDateTime(session.value.startTime)
    },
    {
        label: '结束时间',
        value: formatDateTime(session.value.endTime)
    }
])

// 获取场次详情
const fetchSessionDetail = async () => {
    try {
        // TODO: 调用后端 API 获取场次详情
        session.value = {
            id: sessionId,
            showId,
            name: '场次1',
            startTime: '2024-02-10 19:30:00',
            endTime: '2024-02-10 21:30:00'
        }
    } catch (error) {
        Message.error('获取场次详情失败')
    }
}

// 获取票档列表
const fetchTicketTiers = async () => {
    loading.value = true
    try {
        // TODO: 调用后端 API 获取票档列表
        ticketTiers.value = [
            {
                id: '1',
                sessionId,
                name: 'VIP票',
                price: 580,
                stock: 100,
                sold: 50,
                status: 'available'
            }
        ]
    } catch (error) {
        Message.error('获取票档列表失败')
    } finally {
        loading.value = false
    }
}

// 处理新增票档
const handleCreateTicketTier = () => {
    dialogMode.value = 'create'
    currentTicketTier.value = { sessionId }
    dialogVisible.value = true
}

// 处理编辑票档
const handleEditTicketTier = (ticketTier: TicketTier) => {
    dialogMode.value = 'edit'
    currentTicketTier.value = { ...ticketTier }
    dialogVisible.value = true
}

// 处理删除票档
const handleDeleteTicketTier = async (ticketTier: TicketTier) => {
    try {
        // TODO: 调用后端 API 删除票档
        Message.success('删除成功')
        await fetchTicketTiers()
    } catch (error) {
        Message.error('删除失败')
    }
}

// 处理弹窗提交
const handleDialogSubmit = async (ticketTierData: Partial<TicketTier>) => {
    try {
        if (dialogMode.value === 'create') {
            // TODO: 调用创建票档API
            Message.success('创建票档成功')
        } else {
            // TODO: 调用更新票档API
            Message.success('更新票档成功')
        }
        dialogVisible.value = false
        await fetchTicketTiers()
    } catch (error) {
        Message.error('操作失败')
    }
}

// 格式化日期时间
const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('zh-CN')
}

onMounted(() => {
    fetchSessionDetail()
    fetchTicketTiers()
})
</script>

<style scoped>
.session-detail {
    padding: 20px;
}

.detail-card {
    margin: 16px 0;
}

.ticket-tiers-card {
    margin-top: 16px;
}
</style>