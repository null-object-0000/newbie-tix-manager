<template>
  <div class="order-list">
    <a-card class="general-card" title="订单管理">
      <!-- 搜索和筛选区域 -->
      <div class="search-area">
        <a-row :gutter="16">
          <a-col :span="8">
            <a-input-search
              v-model="searchKeyword"
              placeholder="搜索订单号/用户名/演出名称"
              allow-clear
              @search="handleSearch"
            />
          </a-col>
          <a-col :span="4">
            <a-select
              v-model="statusFilter"
              placeholder="订单状态"
              allow-clear
              style="width: 100%"
              @change="handleStatusChange"
            >
              <a-option value="pending">待支付</a-option>
              <a-option value="paid">已支付</a-option>
              <a-option value="cancelled">已取消</a-option>
              <a-option value="refunded">已退款</a-option>
            </a-select>
          </a-col>
          <a-col :span="4">
            <a-range-picker
              v-model="dateRange"
              style="width: 100%"
              @change="handleDateChange"
            />
          </a-col>
        </a-row>
      </div>

      <!-- 订单列表 -->
      <a-table
        :data="orderList"
        :loading="loading"
        :pagination="pagination"
        @page-change="onPageChange"
      >
        <template #columns>
          <a-table-column title="订单号" data-index="id" />
          <a-table-column title="用户信息" align="center">
            <template #cell="{ record }">
              <div>{{ record.user?.name }}</div>
              <div class="text-secondary">{{ record.user?.phone }}</div>
            </template>
          </a-table-column>
          <a-table-column title="演出信息" align="center">
            <template #cell="{ record }">
              <div>{{ record.show?.name }}</div>
              <div class="text-secondary">{{ record.show?.venue }}</div>
              <div class="text-secondary">{{ formatDate(record.session?.startTime) }}</div>
            </template>
          </a-table-column>
          <a-table-column title="票档信息" align="center">
            <template #cell="{ record }">
              <div>{{ record.ticketTier?.name }}</div>
              <div>¥{{ record.ticketTier?.price }} × {{ record.quantity }}</div>
            </template>
          </a-table-column>
          <a-table-column title="总金额" align="center">
            <template #cell="{ record }">
              <span class="text-red">¥{{ record.totalAmount }}</span>
            </template>
          </a-table-column>
          <a-table-column title="订单状态" align="center">
            <template #cell="{ record }">
              <a-tag :color="getStatusColor(record.status)">
                {{ getStatusText(record.status) }}
              </a-tag>
            </template>
          </a-table-column>
          <a-table-column title="创建时间" align="center">
            <template #cell="{ record }">
              {{ formatDate(record.createdAt) }}
            </template>
          </a-table-column>
          <a-table-column title="操作" align="center">
            <template #cell="{ record }">
              <a-space>
                <a-button type="text" size="small" @click="viewOrderDetail(record)">
                  查看
                </a-button>
                <a-button
                  v-if="record.status === 'pending'"
                  type="text"
                  size="small"
                  @click="cancelOrder(record)"
                >
                  取消
                </a-button>
                <a-button
                  v-if="record.status === 'paid'"
                  type="text"
                  status="danger"
                  size="small"
                  @click="refundOrder(record)"
                >
                  退款
                </a-button>
              </a-space>
            </template>
          </a-table-column>
        </template>
      </a-table>
    </a-card>

    <!-- 订单详情抽屉 -->
    <a-drawer
      v-model:visible="drawerVisible"
      title="订单详情"
      width="600px"
    >
      <template v-if="selectedOrder">
        <a-descriptions :column="1" bordered>
          <a-descriptions-item label="订单号">{{ selectedOrder.id }}</a-descriptions-item>
          <a-descriptions-item label="订单状态">
            <a-tag :color="getStatusColor(selectedOrder.status)">
              {{ getStatusText(selectedOrder.status) }}
            </a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="用户信息">
            {{ selectedOrder.user?.name }} ({{ selectedOrder.user?.phone }})
          </a-descriptions-item>
          <a-descriptions-item label="演出信息">
            <div>{{ selectedOrder.show?.name }}</div>
            <div>{{ selectedOrder.show?.venue }}</div>
            <div>{{ formatDate(selectedOrder.session?.startTime) }}</div>
          </a-descriptions-item>
          <a-descriptions-item label="票档信息">
            {{ selectedOrder.ticketTier?.name }} (¥{{ selectedOrder.ticketTier?.price }})
          </a-descriptions-item>
          <a-descriptions-item label="购买数量">{{ selectedOrder.quantity }}</a-descriptions-item>
          <a-descriptions-item label="总金额">¥{{ selectedOrder.totalAmount }}</a-descriptions-item>
          <a-descriptions-item label="创建时间">{{ formatDate(selectedOrder.createdAt) }}</a-descriptions-item>
          <a-descriptions-item label="更新时间">{{ formatDate(selectedOrder.updatedAt) }}</a-descriptions-item>
        </a-descriptions>
      </template>
    </a-drawer>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import type { Order } from '@/types/order'
import { Message } from '@arco-design/web-vue'

// 状态和数据
const loading = ref(false)
const searchKeyword = ref('')
const statusFilter = ref('')
const dateRange = ref()
const orderList = ref<Order[]>([])
const selectedOrder = ref<Order | null>(null)
const drawerVisible = ref(false)

// 分页配置
const pagination = reactive({
  total: 0,
  current: 1,
  pageSize: 10,
})

// 获取订单列表
const fetchOrders = async () => {
  loading.value = true
  try {
    // TODO: 调用API获取订单列表
    // const response = await api.getOrders({
    //   page: pagination.current,
    //   pageSize: pagination.pageSize,
    //   keyword: searchKeyword.value,
    //   status: statusFilter.value,
    //   startTime: dateRange.value?.[0],
    //   endTime: dateRange.value?.[1],
    // })
    // orderList.value = response.data
    // pagination.total = response.total
  } catch (error) {
    Message.error('获取订单列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索和筛选处理
const handleSearch = () => {
  pagination.current = 1
  fetchOrders()
}

const handleStatusChange = () => {
  pagination.current = 1
  fetchOrders()
}

const handleDateChange = () => {
  pagination.current = 1
  fetchOrders()
}

const onPageChange = (page: number) => {
  pagination.current = page
  fetchOrders()
}

// 订单操作
const viewOrderDetail = (order: Order) => {
  selectedOrder.value = order
  drawerVisible.value = true
}

const cancelOrder = async (order: Order) => {
  try {
    // TODO: 调用API取消订单
    // await api.cancelOrder(order.id)
    Message.success('订单已取消')
    fetchOrders()
  } catch (error) {
    Message.error('取消订单失败')
  }
}

const refundOrder = async (order: Order) => {
  try {
    // TODO: 调用API退款订单
    // await api.refundOrder(order.id)
    Message.success('退款成功')
    fetchOrders()
  } catch (error) {
    Message.error('退款失败')
  }
}

// 工具函数
const formatDate = (date: string) => {
  return new Date(date).toLocaleString('zh-CN')
}

const getStatusColor = (status: Order['status']) => {
  const colorMap = {
    pending: 'orange',
    paid: 'green',
    cancelled: 'gray',
    refunded: 'red',
  }
  return colorMap[status]
}

const getStatusText = (status: Order['status']) => {
  const textMap = {
    pending: '待支付',
    paid: '已支付',
    cancelled: '已取消',
    refunded: '已退款',
  }
  return textMap[status]
}

// 初始化
fetchOrders()
</script>

<style scoped>
.order-list {
  padding: 20px;
}

.search-area {
  margin-bottom: 16px;
}

.text-secondary {
  color: var(--color-text-2);
  font-size: 12px;
}

.text-red {
  color: rgb(var(--danger-6));
}
</style>