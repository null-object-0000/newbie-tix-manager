<template>
    <div class="performances">
        <a-typography-title :heading="3" style="margin-top: 0px; margin-bottom: 24px">演出管理</a-typography-title>

        <!-- 筛选栏 -->
        <a-card style="margin-bottom: 16px">
            <a-form :model="filterForm" layout="inline">
                <a-form-item field="title" label="演出标题">
                    <a-input v-model="filterForm.title" placeholder="请输入演出标题" allow-clear />
                </a-form-item>
                <a-form-item field="venue" label="场馆">
                    <a-input v-model="filterForm.venue" placeholder="请输入场馆名称" allow-clear />
                </a-form-item>
                <a-form-item field="status" label="状态">
                    <a-select v-model="filterForm.status" :options="statusOptions" placeholder="请选择状态" allow-clear />
                </a-form-item>
                <a-form-item>
                    <a-space>
                        <a-button type="primary" @click="handleSearch">搜索</a-button>
                        <a-button @click="handleReset">重置</a-button>
                    </a-space>
                </a-form-item>
            </a-form>
        </a-card>

        <!-- 表格 -->
        <a-card>
            <template #title>
                <a-space>
                    <a-button type="primary" @click="router.push('/performances/create')">
                        <template #icon><icon-plus /></template>
                        新建演出
                    </a-button>
                </a-space>
            </template>
            <a-table :columns="columns" :data="tableData" :pagination="{ pageSize: 10 }">
                <template #totalTickets="{ record }: { record: Performance }">
                    {{ calculateTotalTickets(record.id) }}
                </template>
                <template #status="{ record }: { record: Performance }">
                    <a-tag :color="{ 'on_sale': 'green', 'coming_soon': 'blue', 'sold_out': 'red' }[record.status]">
                        {{statusOptions.find(option => option.value === record.status)?.label}}
                    </a-tag>
                </template>
                <template #actions="{ record }: { record: Performance }">
                    <a-button type="text" size="small"
                        @click="router.push(`/performances/${record.id}/edit`)">编辑</a-button>
                    <a-button type="text" size="small"
                        @click="router.push(`/performances/${record.id}/sessions`)">场次管理</a-button>
                </template>
            </a-table>
        </a-card>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { Performance, PerformanceStatus } from '@/types'
import { PERFORMANCE_STATUS_FILTER_OPTIONS } from '@/types/constants'
import { filterPerformances, getPerformanceSessions, getPerformanceTickets } from '@/services/localStorage'

const router = useRouter()

// 表格数据
const tableData = ref<Performance[]>([])

// 筛选条件
const filterForm = reactive({
    title: '',
    venue: '',
    status: '' as PerformanceStatus | ''
})

// 计算演出总票数
const calculateTotalTickets = (performanceId: number | undefined) => {
    if (!performanceId) return 0

    const sessions = getPerformanceSessions(performanceId)
    let total = 0
    sessions.forEach(session => {
        const tickets = getPerformanceTickets(performanceId, session.id)
        tickets.forEach(ticket => {
            total += ticket.totalQuantity || 0
        })
    })
    return total
}

// 表格列定义
const columns = [
    { title: '演出ID', dataIndex: 'id', width: 100 },
    { title: '演出标题', dataIndex: 'title' },
    { title: '场馆', dataIndex: 'venue' },
    {
        title: '总票数',
        width: 100,
        slotName: 'totalTickets'
    },
    {
        title: '状态',
        dataIndex: 'status',
        slotName: 'status'
    },
    {
        title: '操作',
        slotName: 'actions'
    }
]

// 状态选项
const statusOptions = PERFORMANCE_STATUS_FILTER_OPTIONS

// 加载数据
const loadData = () => {
    tableData.value = filterPerformances(filterForm)
}

// 搜索
const handleSearch = () => {
    loadData()
}

// 重置
const handleReset = () => {
    filterForm.title = ''
    filterForm.venue = ''
    filterForm.status = ''
    loadData()
}

// 初始化加载数据
onMounted(() => {
    loadData()
})
</script>


<style scoped>
.performances {
    padding: 24px;
}
</style>