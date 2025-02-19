<template>
    <div class="dashboard">
        <a-row :gutter="16">
            <a-col :span="8">
                <a-card class="dashboard-card">
                    <template #title>
                        <icon-calendar /> 最近演出
                    </template>
                    <div class="card-value">{{ recentShowsCount }}</div>
                    <div class="card-label">场演出</div>
                </a-card>
            </a-col>
            <a-col :span="8">
                <a-card class="dashboard-card">
                    <template #title>
                        <icon-ticket /> 总票数
                    </template>
                    <div class="card-value">{{ totalTickets }}</div>
                    <div class="card-label">张</div>
                </a-card>
            </a-col>
            <a-col :span="8">
                <a-card class="dashboard-card">
                    <template #title>
                        <icon-check-circle /> 已售票数
                    </template>
                    <div class="card-value">{{ soldTickets }}</div>
                    <div class="card-label">张</div>
                </a-card>
            </a-col>
        </a-row>

        <a-card class="recent-shows" title="近期演出">
            <a-table :data="recentShows" :loading="loading" :pagination="false">
                <template #columns>
                    <a-table-column title="演出名称" data-index="name" />
                    <a-table-column title="演出时间" data-index="startTime">
                        <template #cell="{ record }">
                            {{ formatDateTime(record.startTime) }}
                        </template>
                    </a-table-column>
                    <a-table-column title="演出地点" data-index="venue" />
                    <a-table-column title="状态" data-index="status">
                        <template #cell="{ record }">
                            <a-tag :color="getStatusColor(record.status)">
                                {{ getStatusText(record.status) }}
                            </a-tag>
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

const router = useRouter()
const loading = ref(false)

// 统计数据
const recentShowsCount = ref(0)
const totalTickets = ref(0)
const soldTickets = ref(0)

// 近期演出列表
const recentShows = ref<Array<{
    id: string
    name: string
    startTime: string
    venue: string
    status: string
}>>([]);

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

// 获取状态文本
const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
        not_started: '未开始',
        on_sale: '售票中',
        sold_out: '已售罄',
        ended: '已结束'
    }
    return statusMap[status] || status
}

// 获取状态颜色
const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
        not_started: 'blue',
        on_sale: 'green',
        sold_out: 'red',
        ended: 'gray'
    }
    return colorMap[status] || 'default'
}

// 获取仪表盘数据
const fetchDashboardData = async () => {
    try {
        loading.value = true
        // TODO: 调用后端 API 获取仪表盘数据
        // 模拟数据
        recentShowsCount.value = 5
        totalTickets.value = 1000
        soldTickets.value = 750
        recentShows.value = [
            {
                id: '1',
                name: '2024年新年音乐会',
                startTime: '2024-01-01T19:30:00',
                venue: '市音乐厅',
                status: 'on_sale'
            },
            {
                id: '2',
                name: '春节戏曲晚会',
                startTime: '2024-02-10T19:00:00',
                venue: '大剧院',
                status: 'not_started'
            }
        ]
    } catch (error) {
        Message.error('获取数据失败')
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    fetchDashboardData()
})
</script>

<style scoped>
.dashboard {
    padding: 20px;
}

.dashboard-card {
    text-align: center;
    margin-bottom: 16px;
}

.card-value {
    font-size: 36px;
    font-weight: bold;
    color: var(--color-text-1);
    line-height: 1.5;
}

.card-label {
    font-size: 14px;
    color: var(--color-text-3);
}

.recent-shows {
    margin-top: 16px;
}
</style>