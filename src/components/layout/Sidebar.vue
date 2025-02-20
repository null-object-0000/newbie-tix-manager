<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { IconDashboard, IconCalendar, IconOrderedList, IconSettings } from '@arco-design/web-vue/es/icon';

const router = useRouter()
const activeMenu = ref('dashboard')

const menuItems = [
  { key: 'dashboard', label: '仪表盘', icon: IconDashboard, path: '/' },
  { key: 'performances', label: '演出管理', icon: IconCalendar, path: '/performances' },
  { key: 'orders', label: '订单管理', icon: IconOrderedList, path: '/orders' },
  { key: 'settings', label: '系统设置', icon: IconSettings, path: '/settings' }
]

const handleMenuClick = (key: string) => {
  activeMenu.value = key
  const item = menuItems.find(item => item.key === key)
  if (item) {
    router.push(item.path)
  }
}
</script>

<template>
  <a-layout-sider class="app-sidebar" :collapsed="false">
    <a-menu
      :selected-keys="[activeMenu]"
      @menu-item-click="handleMenuClick"
    >
      <a-menu-item
        v-for="item in menuItems"
        :key="item.key"
      >
        <template #icon>
          <component :is="item.icon" />
        </template>
        {{ item.label }}
      </a-menu-item>
    </a-menu>
  </a-layout-sider>
</template>

<style scoped>
.app-sidebar {
  height: 100%;
  background-color: var(--color-bg-1);
  border-right: 1px solid var(--color-border);
}

:deep(.arco-layout-sider-children) {
  overflow-y: hidden;
}

:deep(.arco-menu) {
  padding: 8px;
}
</style>