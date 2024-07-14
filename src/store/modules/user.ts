import { defineStore } from 'pinia'

// 第一个参数是应用程序中 store 的唯一 id
const useUserStore = defineStore('user', {
  state: () => {
    return {
      name: 'pinia',
      count: 0,
    }
  },
  // other options...
  getters: {
    doubleCount: (state) => state.count * 2,
  },
  //methods 可以同步也可以异步,提交state
  actions: {
    increment() {
      this.count++
    },
    setCount(count: number) {
      this.count = count
    },
  },
})

export default useUserStore
