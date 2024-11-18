import { createApp } from 'vue'
import ArcoVue from '@arco-design/web-vue'
// 额外引入图标库
import ArcoVueIcon from '@arco-design/web-vue/es/icon'
import '@arco-design/web-vue/dist/arco.css'
import './style.css'
import App from './App.vue'
import router from './router'
import store from './store'
/* ES6 module in Node.js environment */
import '@toast-ui/calendar/dist/toastui-calendar.min.css' // Stylesheet for calendar
import 'tui-date-picker/dist/tui-date-picker.css'
import 'tui-time-picker/dist/tui-time-picker.css'

const app = createApp(App)

/**
 *  to: Route， 即将要进入的目标 路由对象；
    from: Route，当前导航正要离开的路由；
    next(): 进行管道中的下一个钩子。如果全部钩子执行完了，则导航的状态就是 confirmed (确认的)。
    next(false): 中断当前的导航。如果浏览器的 URL 改变了 (可能是用户手动或者浏览器后退按钮)，那么 URL 地址会重置到 from 路由对应的地址。
    next('/') 或者 next({ path: '/' }): 跳转到一个不同的地址。当前的导航被中断，然后进行一个新的导航。
 */
router.beforeEach((to, from, next) => {
  // console.log('beforeEach', to, from)
  next()
})

app.use(ArcoVue)
app.use(ArcoVueIcon)
app.use(router)
app.use(store)

app.mount('#app')
