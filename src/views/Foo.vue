<template>
  <div>
    <!-- tag：插槽演示 -->
    Foo:
    <slot :default-value="defaultValue"> this is default slot </slot>
    <slot :list="list" name="foo"></slot>
    <slot :footer="lineType" name="footer"></slot>
    <!-- <slot :footer="footer" name="footer"></slot> -->
    <canvas id="canvas">此浏览器不支持canvas</canvas>
  </div>
</template>

<script setup lang="ts">
import { LineType } from '@/types'
import { ref, reactive, onMounted } from 'vue'
// import { ImhdChannel } from 'imhd-channelization'

const lineType = ref<LineType>(LineType.greenBelt)
const defaultValue = ref('default')
const list = reactive([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
const footer = ref('footers')

onMounted(() => {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement
  // const imhd = new ImhdChannel(canvas)
  // imhd.init()
  // console.log(imhd)
})
</script>
<style lang="scss" scoped></style>
