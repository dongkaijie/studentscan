import { createRouter,createWebHistory } from 'vue-router'

const routes = [
  {
      path: '/',
      // redirect: '/smartone/monitor',
      component: () => import('../views/home/index.vue'),
  },
  {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('@/views/404/index.vue')
    }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})
export default router