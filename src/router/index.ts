import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue'),
    },
    {
      path: '/shows',
      name: 'shows',
      component: () => import('../views/shows/index.vue'),
    },
    {
      path: '/shows/create',
      name: 'shows-create',
      component: () => import('../views/shows/create.vue'),
    },
    {
      path: '/shows/:id',
      name: 'shows-detail',
      component: () => import('../views/shows/[id]/index.vue'),
    },
    {
      path: '/shows/:id/edit',
      name: 'shows-edit',
      component: () => import('../views/shows/[id]/edit.vue'),
    },
    {
      path: '/shows/:id/sessions/:sessionId',
      name: 'shows-session-detail',
      component: () => import('../views/shows/[id]/sessions/[sessionId]/index.vue'),
    },
    {
      path: '/orders',
      name: 'orders',
      component: () => import('../views/orders/index.vue'),
    }
  ],
})

export default router
