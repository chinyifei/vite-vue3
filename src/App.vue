// 使用user数据 // App.vue
<script setup lang="ts">
import useUserStore from '@/store/modules/user'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import Foo from './views/Foo.vue'
const userStore = useUserStore()

userStore.$subscribe((mutation, state) => {
  console.log(mutation, state)
})

userStore.$onAction(({ name, after, onError }) => {
  console.log('name', name)
  after(() => {
    console.log('after')
  })
  onError((e) => {
    console.log(e)
  })
})

//pinia解构不具备响应式
const { name, count } = storeToRefs(userStore)

const change = () => {
  // userStore.count++
  // userStore.increment()
  // userStore.$patch({ count: userStore.count + 1 })
  // userStore.$patch((state) => {
  //   state.count = 999
  //   state.name = 'fbb'
  // })
  // userStore.$state = {
  //   count: 999,
  //   name: 'fbb',
  // }
  userStore.setCount(++count.value)
}
const onReset = () => {
  userStore.$reset()
}

//编程式导航
const router = useRouter()
const prev = () => {
  router.go(-1)
}
const next = () => {
  router.go(1)
}
//传参到demo
const goPage = () => {
  // 传参必须使用name
  router.push({
    name: 'Demo',
    params: {
      username: '测试传参',
      // age: 11,
    },
  })
  // router.push({
  //   path: '/demo',
  //   query: {
  //     name: 'qin',
  //     age: 10,
  //   },
  // })
}
</script>

<template>
  <!-- <div>userStore.name: {{ userStore.name }}--{{ userStore.count }}</div>
  <div>解构复制:userStore: {{ name }}--{{ count }}</div>
  <button @click="change">count++</button>
  <button @click="onReset">重置</button> -->
  <RouterView />
  <!-- <div>
    <button @click="prev()">prev</button>
    <button @click="next()">next</button>
    <button @click="goPage">到demo传参</button>
  </div>

  <div>
    插槽演示:
    <Foo></Foo> -->
  <!-- 关闭eslint在这一行 -->
  <!-- eslint-disable -->
    <!-- <Foo #default="{ defaultValue }">默认插槽有内容:{{ defaultValue }}</Foo>
    <Foo>
      具名插槽:
      <template #foo="{ list }">this is slot name:foo {{ list }}</template>
    </Foo>
    <Foo>
      作用域插槽传参:
      <template #footer="{ footer }">this is slot name:footer {{ footer }}</template>
    </Foo>
  </div> -->
</template>

<style scoped>
#app {
  width: 100vw;
  height: 100vh;
}
</style>
