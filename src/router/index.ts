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
    },
    {
      path: '/performances/create',
      name: 'performance-create',
      component: () => import('@/views/PerformanceEdit.vue'),
    },
    {
      path: '/performances/:id/edit',
      name: 'performance-edit',
      component: () => import('@/views/PerformanceEdit.vue'),
    },
  ],
})

export default router
