<template>
    <div class="dashboard">
        <a-typography-title :heading="3" style="margin-top: 0px; margin-bottom: 24px">仪表盘</a-typography-title>

        <a-row :gutter="16" style="margin-bottom: 16px">
            <!-- 演出统计 -->
            <a-col :span="8">
                <a-card class="stats-card">
                    <template #title>演出统计</template>
                    <a-grid :cols="2" :colGap="16" :rowGap="16">
                        <a-grid-item>
                            <a-statistic title="总演出数" :value="statistics.performances.total" />
                        </a-grid-item>
                        <a-grid-item>
                            <a-statistic title="售票中" :value="statistics.performances.onSale"
                                style="color: var(--color-success)" />
                        </a-grid-item>
                        <a-grid-item>
                            <a-statistic title="待开售" :value="statistics.performances.comingSoon" />
                        </a-grid-item>
                        <a-grid-item>
                            <a-statistic title="已售罄" :value="statistics.performances.soldOut" />
                        </a-grid-item>
                    </a-grid>
                </a-card>
            </a-col>

            <!-- 订单统计 -->
            <a-col :span="8">
                <a-card class="stats-card">
                    <template #title>订单统计</template>
                    <a-grid :cols="2" :colGap="16" :rowGap="16">
                        <a-grid-item>
                            <a-statistic title="总订单数" :value="statistics.orders.total" />
                        </a-grid-item>
                        <a-grid-item>
                            <a-statistic title="今日订单" :value="statistics.orders.today"
                                style="color: var(--color-success)" />
                        </a-grid-item>
                        <a-grid-item>
                            <a-statistic title="待处理" :value="statistics.orders.pending"
                                style="color: var(--color-warning)" />
                        </a-grid-item>
                        <a-grid-item>
                            <a-statistic title="已完成" :value="statistics.orders.completed" />
                        </a-grid-item>
                    </a-grid>
                </a-card>
            </a-col>

            <!-- 收入统计 -->
            <a-col :span="8">
                <a-card class="stats-card">
                    <template #title>收入统计</template>
                    <a-grid :cols="2" :colGap="16" :rowGap="16">
                        <a-grid-item>
                            <a-statistic title="总收入" prefix="¥" :value="statistics.revenue.total" />
                        </a-grid-item>
                        <a-grid-item>
                            <a-statistic title="今日收入" prefix="¥" :value="statistics.revenue.today"
                                style="color: var(--color-success)" />
                        </a-grid-item>
                    </a-grid>
                </a-card>
            </a-col>
        </a-row>

        <!-- 快捷操作 -->
        <a-card class="quick-actions">
            <template #title>快捷操作</template>
            <a-space :size="16">
                <a-button type="primary" @click="router.push('/performances/create')">
                    <template #icon>
                        <icon-plus />
                    </template>
                    新增演出
                </a-button>
                <a-button type="primary" status="warning" @click="router.push('/orders?status=pending')">
                    <template #icon>
                        <icon-clock-circle />
                    </template>
                    待处理订单
                </a-button>
            </a-space>
        </a-card>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router';

const router = useRouter()

const statistics = ref({
    performances: {
        total: 12,
        onSale: 8,
        comingSoon: 3,
        soldOut: 1
    },
    orders: {
        total: 156,
        today: 23,
        pending: 5,
        completed: 18
    },
    revenue: {
        total: 52680,
        today: 6890
    }
})
</script>

<style scoped>
.dashboard {
    padding: 24px;
    max-width: 1200px;
    margin: 0 auto;
}

.stats-card {
    height: 100%;
    transition: all 0.3s ease;
}

.quick-actions {
    margin-top: 24px;
    transition: all 0.3s ease;
}

.hover-effect:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
}

.card-title {
    font-size: 16px;
    font-weight: 500;
    color: var(--color-text-1);
}

.fade-in {
    animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>