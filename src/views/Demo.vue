<template>
  <div :class="[zs.red, zs.border]">DEMO3</div>
  <div ref="xiaoman">
    {{ text }}
  </div>
  <div>接受传来的参数:{{ $route?.params?.age }}--{{ $route?.params?.username }}</div>
  <!-- <div>params传来的参数：{{ route?.params?.id }}--</div> -->
  <button @click="change">change div</button>
  <br />
  <!-- <RouterLink replace to="/">Go to Home</RouterLink>
  <RouterLink replace to="/test">Go to Test</RouterLink> -->
  <button @click="goPage('/')">Go to Home</button>
  <button @click="goPage('/test')">Go to Test</button>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const text = ref('小满开飞机')
const xiaoman = ref<HTMLElement>()

const change = async () => {
  text.value = '小满不开飞机'
  console.log(xiaoman.value?.innerText) //小满开飞机
  await nextTick()
  console.log(xiaoman.value?.innerText) //小满不开飞机
}

//编程式导航
const route = useRoute()

onMounted(() => {
  console.log('route', route)
  console.log(route.state) // 输出：测试传参
  console.log(route.params) // 输出：11
})

const router = useRouter()
const goPage = (path: string) => {
  router.push(path)
  //无历史记录
  // router.replace(path)
}
</script>

<style module="zs">
.red {
  color: red;
  font-size: 20px;
}

.border {
  border: 1px solid #ccc;
}
</style>
