import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  { path: '/', redirect: '/home' },

  { path: '/home', name: 'Home', component: () => import('@/views/Home.vue') },
  {
    path: '/demo/:id?',
    name: 'Demo',
    component: () => import('@/views/Demo.vue'),
    props: true,
  },
  { path: '/test', name: 'Test', component: () => import('@/views/Test.vue') },
  {
    path: '/canvas',
    name: 'Canvas',
    component: () => import('@/views/Canvas/Index.vue'),
    children: [{ path: '1', name: 'Canvas1', component: () => import('@/views/Canvas/Canvas.vue') }],
  },
  { path: '/calendar', name: 'calendar', component: () => import('@/views/calendar/index.vue') },
  { path: '/map', name: 'map', component: () => import('@/views/map/index.vue') },
  { path: '/echarts', name: 'echarts', component: () => import('@/views/echarts/pie.vue') },
  { path: '/randomColor', name: 'randomColor', component: () => import('@/views/color/random-color.vue') },
]

const router = createRouter({
  // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
  history: createWebHistory(import.meta.env.BASE_URL),
  routes, // `routes: routes` 的缩写
})

export default router
