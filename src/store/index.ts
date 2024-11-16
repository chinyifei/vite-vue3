import { createPinia, PiniaPluginContext } from 'pinia'
import { getStorage, setStorage } from '@/utils'
import { toRaw } from 'vue'

interface PiniaOptions {
  key?: string
}

const __piniaKey: string = 'yifei'

//编写pinia插件
const piniaPlugin = (options: PiniaOptions) => {
  return (ctx: PiniaPluginContext) => {
    // console.log('ctx:', ctx)
    const { store } = ctx
    const data = getStorage(`${options.key ?? __piniaKey}-${store.$id}`)
    store.$subscribe(() => {
      setStorage(`${options.key ?? __piniaKey}-${store.$id}`, toRaw(store.$state))
    })
    return {
      ...data,
    }
  }
}

const store = createPinia()

store.use(
  piniaPlugin({
    key: 'pinia',
  })
)

export default store
