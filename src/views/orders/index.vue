<template>
    <div class="orders-container">
        <a-card class="orders-card">
            <template #title>
                <a-space>
                    <icon-ordered-list />
                    <span>订单列表</span>
                </a-space>
            </template>

            <a-table :data="orders" :loading="loading" :pagination="pagination" @page-change="fetchOrders">
                <template #columns>
                    <a-table-column title="订单编号" data-index="id" />
                    <a-table-column title="演出名称" data-index="showName" />
                    <a-table-column title="场次" data-index="sessionName" />
                    <a-table-column title="票档" data-index="ticketTierName" />
                    <a-table-column title="数量" data-index="quantity" />
                    <a-table-column title="总价" data-index="totalAmount">
                        <template #cell="{ record }">
                            ¥{{ record.totalAmount }}
                        </template>
                    </a-table-column>
                    <a-table-column title="状态" data-index="status">
                        <template #cell="{ record }">
                            <a-tag :color="getStatusColor(record.status)">
                                {{ getStatusText(record.status) }}
                            </a-tag>
                        </template>
                    </a-table-column>
                    <a-table-column title="下单时间" data-index="createdAt">
                        <template #cell="{ record }">
                            {{ formatDateTime(record.createdAt) }}
                        </template>
                    </a-table-column>
                    <a-table-column title="操作" fixed="right" :width="120">
                        <template #cell="{ record }">
                            <a-space>
                                <a-button type="text" size="small" @click="handleView(record)">查看</a-button>
                                <a-button v-if="record.status === 'pending'" type="text" size="small" status="success" @click="handleConfirm(record)">确认</a-button>
                                <a-button v-if="record.status === 'pending'" type="text" size="small" status="danger" @click="handleCancel(record)">取消</a-button>
                            </a-space>
                        </template>
                    </a-table-column>
                </template>
            </a-table>
        </a-card>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Message } from '@arco-design/web-vue'
import { IconOrderedList } from '@arco-design/web-vue/es/icon'
import type { TableData } from '@arco-design/web-vue/es/table/interface'

interface Order extends TableData {
    id: string
    showName: string
    sessionName: string
    ticketTierName: string
    quantity: number
    totalAmount: number
    status: 'pending' | 'confirmed' | 'cancelled'
    createdAt: string
}

const router = useRouter()
const orders = ref<Order[]>([])
const loading = ref(false)
const pagination = ref({
    total: 0,
    current: 1,
    pageSize: 10
})

// 获取订单列表数据
const fetchOrders = async (page = 1) => {
    loading.value = true
    try {
        // TODO: 调用后端 API 获取数据
        // 模拟数据
        orders.value = [
            {
                id: 'ORD20240101001',
                showName: '2024年春节音乐会',
                sessionName: '场次1',
                ticketTierName: 'VIP座',
                quantity: 2,
                totalAmount: 580,
                status: 'pending',
                createdAt: '2024-01-01 10:00:00'
            }
        ]
        pagination.value.total = 1
    } catch (error) {
        Message.error('获取订单列表失败')
    } finally {
        loading.value = false
    }
}

// 格式化日期时间
const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    })
}

// 获取状态颜色
const getStatusColor = (status: Order['status']) => {
    const colorMap = {
        pending: 'orange',
        confirmed: 'green',
        cancelled: 'red'
    }
    return colorMap[status]
}

// 获取状态文本
const getStatusText = (status: Order['status']) => {
    const textMap = {
        pending: '待确认',
        confirmed: '已确认',
        cancelled: '已取消'
    }
    return textMap[status]
}

// 查看订单详情
const handleView = (order: Order) => {
    router.push(`/orders/${order.id}`)
}

// 确认订单
const handleConfirm = async (order: Order) => {
    try {
        // TODO: 调用后端 API 确认订单
        Message.success('订单确认成功')
        await fetchOrders(pagination.value.current)
    } catch (error) {
        Message.error('订单确认失败')
    }
}

// 取消订单
const handleCancel = async (order: Order) => {
    try {
        // TODO: 调用后端 API 取消订单
        Message.success('订单取消成功')
        await fetchOrders(pagination.value.current)
    } catch (error) {
        Message.error('订单取消失败')
    }
}

onMounted(() => {
    fetchOrders()
})
</script>

<style scoped>
.orders-container {
    padding: 20px;
}

.orders-card {
    background: var(--color-bg-2);
    border-radius: 4px;
}
</style>