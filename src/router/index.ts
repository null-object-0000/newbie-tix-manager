import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: () => import('@/views/Dashboard.vue'),
    },
    {
      path: '/performances',
      name: 'performances',
      component: () => import('@/views/Performances.vue'),
      meta: { activeMenu: 'performances' }
    },
    {
      path: '/performances/create',
      name: 'performance-create',
      component: () => import('@/views/PerformanceEdit.vue'),
      meta: { activeMenu: 'performances' }
    },
    {
      path: '/performances/:id/edit',
      name: 'performance-edit',
      component: () => import('@/views/PerformanceEdit.vue'),
      meta: { activeMenu: 'performances' }
    },
    {
      path: '/performances/:id/sessions',
      name: 'performance-sessions',
      component: () => import('@/views/PerformanceSessions.vue'),
      meta: { activeMenu: 'performances' }
    },
  ],
})

export default router
