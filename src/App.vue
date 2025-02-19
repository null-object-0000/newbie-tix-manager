<script setup lang="ts">
import { RouterView, useRoute, useRouter } from 'vue-router'
import { IconMenu, IconDashboard, IconCalendar, IconOrderedList } from '@arco-design/web-vue/es/icon'
import { computed } from 'vue'

const router = useRouter()

const route = useRoute()

const menuItems = [
  {
    key: 'dashboard',
    title: '仪表盘',
    path: '/'
  },
  {
    key: 'shows',
    title: '演出管理',
    path: '/shows'
  },
  {
    key: 'orders',
    title: '订单管理',
    path: '/orders'
  }
]

const currentTitle = computed(() => {
  return menuItems.find(item => item.path === route.path)?.title || ''
})

const breadcrumbItems = computed(() => {
  const currentItem = menuItems.find(item => item.path === route.path)
  return currentItem ? [{ title: currentItem.title }] : []
})

const handleMenuClick = (key: string) => {
  router.push(key)
}
</script>

<template>
  <a-layout class="layout">
    <a-layout-sider class="sider" breakpoint="xl" :width="220">
      <div class="logo">
        <h1>Newbie Tix</h1>
      </div>
      <a-menu :selected-keys="[route.path]" :style="{ width: '100%' }" @menu-item-click="handleMenuClick">
        <a-menu-item v-for="item in menuItems" :key="item.path">
          <template #icon>
            <icon-dashboard v-if="item.key === 'dashboard'" />
            <icon-calendar v-else-if="item.key === 'shows'" />
            <icon-ordered-list v-else-if="item.key === 'orders'" />
          </template>
          {{ item.title }}
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header class="header">
        <div class="header-left">
          <a-breadcrumb :items="breadcrumbItems" />
        </div>
        <div class="header-right">
          <a-space>
            <a-avatar>A</a-avatar>
            <a-dropdown trigger="click">
              <a-button type="text">管理员</a-button>
              <template #content>
                <a-doption>个人设置</a-doption>
                <a-doption>退出登录</a-doption>
              </template>
            </a-dropdown>
          </a-space>
        </div>
      </a-layout-header>
      <a-layout-content class="content">
        <RouterView />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<style scoped>
.layout {
  height: 100vh;
}

.sider {
  background: var(--color-bg-2);
  border-right: 1px solid var(--color-border);
}

.logo {
  display: flex;
  align-items: center;
  padding: 16px;
  height: 64px;
  border-bottom: 1px solid var(--color-border);
}

.logo img {
  width: 32px;
  height: 32px;
  margin-right: 12px;
}

.logo h1 {
  margin: 0;
  font-size: 18px;
  font-weight: 500;
  color: var(--color-text-1);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  height: 64px;
  background: var(--color-bg-2);
  border-bottom: 1px solid var(--color-border);
}

.header-left,
.header-right {
  display: flex;
  align-items: center;
}

.content {
  padding: 20px;
  background: var(--color-bg-1);
  min-height: calc(100vh - 64px);
}
</style>
