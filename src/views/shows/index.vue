<template>
    <div class="shows-container">
        <div class="header">
            <a-page-header title="演出管理" />
            <a-button type="primary" @click="handleAdd">
                <template #icon>
                    <icon-plus />
                </template>
                新增演出
            </a-button>
        </div>

        <a-table :data="shows" :loading="loading" :pagination="pagination" @page-change="onPageChange">
            <template #columns>
                <a-table-column title="演出名称" data-index="name" />
                <a-table-column title="演出时间" data-index="startTime">
                    <template #cell="{ record }">
                        {{ formatDateTime(record.startTime) }}
                    </template>
                </a-table-column>
                <a-table-column title="演出地点" data-index="venue" />
                <a-table-column title="票价范围" data-index="priceRange" />
                <a-table-column title="状态" data-index="status">
                    <template #cell="{ record }">
                        <a-tag :color="getStatusColor(record.status)">
                            {{ getStatusText(record.status) }}
                        </a-tag>
                    </template>
                </a-table-column>
                <a-table-column title="操作" fixed="right" :width="180">
                    <template #cell="{ record }">
                        <a-space>
                            <a-button type="text" size="small" @click="handleEdit(record)">编辑</a-button>
                            <a-button type="text" size="small" @click="handleView(record)">场次管理</a-button>
                            <a-popconfirm content="确定要删除该演出吗？" @ok="handleDelete(record)">
                                <a-button type="text" size="small" status="danger">删除</a-button>
                            </a-popconfirm>
                        </a-space>
                    </template>
                </a-table-column>
            </template>
        </a-table>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Message } from '@arco-design/web-vue'
import type { TableData } from '@arco-design/web-vue/es/table/interface'

interface Show extends TableData {
    id: string
    name: string
    startTime: string
    venue: string
    priceRange: string
    status: 'upcoming' | 'ongoing' | 'ended'
}

const router = useRouter()
const shows = ref<Show[]>([])
const loading = ref(false)
const pagination = ref({
    total: 0,
    current: 1,
    pageSize: 10
})

// 获取演出列表数据
const fetchShows = async (page = 1) => {
    loading.value = true
    try {
        // TODO: 调用后端 API 获取数据
        shows.value = [
            {
                id: '1',
                name: '2024年春节音乐会',
                startTime: '2024-02-10 19:30:00',
                venue: '国家大剧院音乐厅',
                priceRange: '180-580元',
                status: 'upcoming'
            }
        ]
        pagination.value.total = 100 // TODO: 设置实际的总数
    } catch (error) {
        Message.error('获取演出列表失败')
    } finally {
        loading.value = false
    }
}

// 格式化日期时间
const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('zh-CN')
}

// 获取状态标签颜色
const getStatusColor = (status: Show['status']) => {
    const colorMap = {
        upcoming: 'blue',
        ongoing: 'green',
        ended: 'gray'
    }
    return colorMap[status]
}

// 获取状态文本
const getStatusText = (status: Show['status']) => {
    const textMap = {
        upcoming: '即将开始',
        ongoing: '进行中',
        ended: '已结束'
    }
    return textMap[status]
}

// 分页变化
const onPageChange = (page: number) => {
    pagination.value.current = page
    fetchShows(page)
}

// 新增演出
const handleAdd = () => {
    router.push('/shows/create')
}

// 查看演出详情
const handleView = (show: Show) => {
    router.push(`/shows/${show.id}`)
}

// 编辑演出
const handleEdit = (show: Show) => {
    router.push(`/shows/${show.id}/edit`)
}

// 删除演出
const handleDelete = async (show: Show) => {
    try {
        // TODO: 调用后端 API 删除数据
        Message.success('删除成功')
        fetchShows(pagination.value.current)
    } catch (error) {
        Message.error('删除失败')
    }
}

onMounted(() => {
    fetchShows()
})
</script>

<style scoped>
.shows-container {
    padding: 20px;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
}
</style>