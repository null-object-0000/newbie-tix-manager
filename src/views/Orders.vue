<template>
    <div class="container">
        <a-typography-title :heading="3" style="margin-top: 0px; margin-bottom: 24px">订单管理</a-typography-title>

        <!-- 筛选表单 -->
        <a-form :model="filterForm" class="filter-form" layout="inline">
            <a-form-item field="orderNo" label="订单编号">
                <a-input v-model="filterForm.orderNo" placeholder="请输入订单编号" allow-clear />
            </a-form-item>
            <a-form-item field="status" label="订单状态">
                <a-select v-model="filterForm.status" placeholder="请选择订单状态" allow-clear>
                    <a-option v-for="option in statusOptions" :key="option.value" :value="option.value">
                        {{ option.label }}
                    </a-option>
                </a-select>
            </a-form-item>
            <a-form-item field="time" label="下单时间">
                <a-range-picker v-model="filterForm.time" style="width: 260px" allow-clear />
            </a-form-item>
            <a-form-item>
                <a-space>
                    <a-button type="primary" @click="handleSearch">搜索</a-button>
                    <a-button @click="handleReset">重置</a-button>
                </a-space>
            </a-form-item>
        </a-form>

        <!-- 订单列表 -->
        <a-table :loading="loading" :data="tableData" :columns="columns" :pagination="{
            total: tableData.length,
            pageSize: 10,
            showTotal: true,
            showPageSize: true
        }" class="mt-4">
            <!-- 演出信息 -->
            <template #performance="{ record }">
                <div>{{ getPerformanceTitle(record.performanceId) }}</div>
                <div class="text-gray-500 text-sm">
                    {{ getSessionTitle(record.performanceId, record.sessionId) }}
                </div>
            </template>

            <!-- 票档信息 -->
            <template #ticket="{ record }">
                <div>{{ getTicketTitle(record.performanceId, record.sessionId, record.ticketId) }}</div>
                <div class="text-gray-500 text-sm">¥{{ record.price }} × {{ record.quantity }}</div>
            </template>

            <!-- 订单金额 -->
            <template #amount="{ record }">
                <div>票面总价：¥{{ record.totalAmount }}</div>
                <div class="text-gray-500 text-sm">实付金额：¥{{ record.finalAmount }}</div>
            </template>

            <!-- 订单状态 -->
            <template #status="{ record }">
                <a-tag :color="getStatusColor(record.status)">
                    {{ getStatusText(record.status) }}
                </a-tag>
            </template>

            <!-- 操作按钮 -->
            <template #actions="{ record }">
                <a-space>
                    <a-button type="text" size="small" @click="handleViewOrder(record)">
                        查看
                    </a-button>
                    <a-button v-if="record.status === 'pending'" type="text" size="small" status="success"
                        @click="handlePayOrder(record)">
                        支付
                    </a-button>
                    <a-button v-if="record.status === 'pending'" type="text" size="small" status="danger"
                        @click="handleCancelOrder(record)">
                        取消
                    </a-button>
                </a-space>
            </template>
        </a-table>

        <!-- 订单详情抽屉 -->
        <a-drawer v-model:visible="drawerVisible" :width="600" title="订单详情">
            <template v-if="currentOrder">
                <a-descriptions :data="orderInfo" layout="inline-vertical" bordered />
            </template>
        </a-drawer>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { Message, Modal } from '@arco-design/web-vue'
import type { Order } from '@/types'
import { filterOrders, updateOrder, getPerformance, getPerformanceSession, getPerformanceTickets } from '@/services/localStorage'

// 日期格式化函数
const formatDateTime = (dateStr: string) => {
    if (!dateStr) return '-'
    const date = new Date(dateStr)
    return new Intl.DateTimeFormat('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    }).format(date)
}

// 表格数据
const loading = ref(false)
const tableData = ref<Order[]>([])

// 筛选条件
const filterForm = reactive({
    orderNo: '',
    status: '',
    time: [] as string[]
})

// 状态选项
const statusOptions = [
    { label: '待支付', value: 'pending' },
    { label: '已支付', value: 'paid' },
    { label: '已取消', value: 'cancelled' }
]

// 表格列定义
const columns = [
    { title: '订单编号', dataIndex: 'orderNo', width: 180 },
    { title: '演出信息', slotName: 'performance' },
    { title: '票档信息', slotName: 'ticket' },
    { title: '订单金额', slotName: 'amount', width: 160 },
    { title: '下单时间', dataIndex: 'createTime', width: 180, render: (_: any, record: Order) => formatDateTime(record.createTime) },
    { title: '状态', slotName: 'status', width: 100 },
    { title: '操作', slotName: 'actions', width: 160 }
]

// 获取演出标题
const getPerformanceTitle = (performanceId: number) => {
    const performance = getPerformance(performanceId)
    return performance?.title || '-'
}

// 获取场次标题
const getSessionTitle = (performanceId: number, sessionId: number) => {
    const session = getPerformanceSession(performanceId, sessionId)
    return session?.title || formatDateTime(session?.startShowTime || '')
}

// 获取票档标题
const getTicketTitle = (performanceId: number, sessionId: number, ticketId: number) => {
    const tickets = getPerformanceTickets(performanceId, sessionId)
    const ticket = tickets.find(item => item.id === ticketId)
    return ticket?.title || '-'
}

// 获取状态颜色
const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
        pending: 'orange',
        paid: 'green',
        cancelled: 'red'
    }
    return colorMap[status] || 'default'
}

// 获取状态文本
const getStatusText = (status: string) => {
    const textMap: Record<string, string> = {
        pending: '待支付',
        paid: '已支付',
        cancelled: '已取消'
    }
    return textMap[status] || status
}

// 加载数据
const loadData = () => {
    loading.value = true
    try {
        tableData.value = filterOrders({
            orderNo: filterForm.orderNo,
            status: filterForm.status,
            startTime: filterForm.time?.[0],
            endTime: filterForm.time?.[1]
        })
    } finally {
        loading.value = false
    }
}

// 搜索
const handleSearch = () => {
    loadData()
}

// 重置
const handleReset = () => {
    filterForm.orderNo = ''
    filterForm.status = ''
    filterForm.time = []
    loadData()
}

// 订单详情
const drawerVisible = ref(false)
const currentOrder = ref<Order | null>(null)

// 订单详情信息
const orderInfo = computed(() => {
    if (!currentOrder.value) return []

    const order = currentOrder.value
    const performance = getPerformance(order.performanceId)
    const session = getPerformanceSession(order.performanceId, order.sessionId)
    const tickets = getPerformanceTickets(order.performanceId, order.sessionId)
    const ticket = tickets.find(item => item.id === order.ticketId)

    return [
        { label: '订单编号', value: order.orderNo },
        { label: '下单时间', value: formatDateTime(order.createTime) },
        { label: '支付时间', value: order.payTime ? formatDateTime(order.payTime) : '-' },
        { label: '订单状态', value: getStatusText(order.status) },
        { label: '演出标题', value: performance?.title || '-' },
        { label: '场次信息', value: session?.title || formatDateTime(session?.startShowTime || '') },
        { label: '票档信息', value: ticket?.title || '-' },
        { label: '票价', value: `¥${order.price}` },
        { label: '数量', value: order.quantity },
        { label: '票面总价', value: `¥${order.totalAmount}` },
        { label: '实付金额', value: `¥${order.finalAmount}` }
    ]
})

// 查看订单
const handleViewOrder = (order: Order) => {
    currentOrder.value = order
    drawerVisible.value = true
}

// 支付订单
const handlePayOrder = (order: Order) => {
    Modal.confirm({
        title: '确认支付',
        content: `确认支付订单 ${order.orderNo} 吗？`,
        onOk: () => {
            const updated = updateOrder(order.orderNo, {
                status: 'paid',
                payTime: new Date().toISOString()
            })
            if (updated) {
                Message.success('支付成功')
                loadData()
            }
        }
    })
}

// 取消订单
const handleCancelOrder = (order: Order) => {
    Modal.confirm({
        title: '确认取消',
        content: `确认取消订单 ${order.orderNo} 吗？`,
        onOk: () => {
            const updated = updateOrder(order.orderNo, {
                status: 'cancelled'
            })
            if (updated) {
                Message.success('订单已取消')
                loadData()
            }
        }
    })
}

// 初始化
loadData()
</script>

<style scoped>
.container {
    padding: 20px;
}

.filter-form {
    background-color: var(--color-bg-2);
    padding: 20px;
    border-radius: 4px;
    margin-bottom: 16px;
}

.mt-4 {
    margin-top: 16px;
}

.text-gray-500 {
    color: var(--color-text-3);
}

.text-sm {
    font-size: 12px;
}
</style>