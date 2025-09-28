import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/:type/:id', component: () => import('./views/Preview.vue') },
    { path: '/:type', component: () => import('./views/Preview.vue') },
    { path: '/', component: () => import('./views/Preview.vue') },
  ],
})

export default router