<template>
    <div class="performances">
        <a-typography-title :heading="3" style="margin-top: 0px; margin-bottom: 24px">演出管理</a-typography-title>

        <!-- 筛选栏 -->
        <a-card style="margin-bottom: 16px">
            <a-form :model="filterForm" layout="inline">
                <a-form-item field="title" label="演出标题">
                    <a-input v-model="filterForm.title" placeholder="请输入演出标题" allow-clear />
                </a-form-item>
                <a-form-item field="venue" label="演出场馆">
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
            <a-table :columns="columns" :data="tableData" :pagination="{ pageSize: 10 }" :loading="loading">
                <template #status="{ record }: { record: Performance }">
                    <a-tag
                        :color="{ 'ON_SALE': 'green', 'COMING_SOON': 'blue', 'SOLD_OUT': 'red', 'OFFLINE': 'orange' }[record.status]">
                        {{ statusOptions.find(option => option.value === record.status)?.label }}
                    </a-tag>
                </template>
                <template #actions="{ record }: { record: Performance }">
                    <a-space>
                        <a-button type="text" size="small"
                            @click="router.push(`/performances/${record.id}/edit`)">编辑</a-button>
                        <a-button type="text" size="small"
                            @click="router.push(`/performances/${record.id}/sessions`)">场次管理</a-button>
                        <a-popconfirm :content="`确认${record.status === 'OFFLINE' ? '上架' : '下架'}该演出吗？`"
                            @ok="handleStatusChange(record)">
                            <a-button type="text" size="small" status="warning" :loading="record.id === updatingId">
                                {{ record.status === 'OFFLINE' ? '上架' : '下架' }}
                            </a-button>
                        </a-popconfirm>
                    </a-space>
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
import { filterPerformances, takeOffline, takeOnline } from '@/services/api'
import { Modal } from '@arco-design/web-vue'

const router = useRouter()

// 表格数据
const tableData = ref<Performance[]>([])
const loading = ref(false)
const updatingId = ref<number | null>(null)

// 筛选条件
const filterForm = reactive({
    title: '',
    venue: '',
    status: '' as PerformanceStatus | ''
})

// 表格列定义
const columns = [
    { title: '演出ID', dataIndex: 'id', width: 100 },
    { title: '演出标题', dataIndex: 'title' },
    { title: '演出场馆', dataIndex: 'venue' },
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
const loadData = async () => {
    loading.value = true
    try {
        tableData.value = await filterPerformances(filterForm)
    } catch (error) {
        console.error('加载演出数据失败:', error)
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
    filterForm.title = ''
    filterForm.venue = ''
    filterForm.status = ''
    loadData()
}

// 处理上下架状态变更
const handleStatusChange = async (performance: Performance) => {
    if (!performance.id) return
    updatingId.value = performance.id
    try {
        if (performance.status === 'OFFLINE') {
            await takeOnline(performance.id)
        } else {
            await takeOffline(performance.id)
        }
        await loadData()
    } catch (error) {
        console.error('更新演出状态失败:', error)
    } finally {
        updatingId.value = null
    }
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