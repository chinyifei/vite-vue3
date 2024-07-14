<template>
  <canvas id="canvas" ref="canvasRef"></canvas>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
const canvasRef = ref<HTMLCanvasElement | null>(null)
onMounted(() => {
  // const canvas = document.getElementById('canvas') as HTMLCanvasElement
  const canvas = canvasRef.value
  let context = canvas!.getContext('2d') as CanvasRenderingContext2D
  //设置字体格式
  context.font = '38pt Arial'
  //fillStyle设置或返回填充canvas的颜色、渐变、模式，其中CornflowerBlue 矢车菊蓝
  context.fillStyle = 'cornflowerblue'
  //strokeStyle用于设置或返回笔触的颜色、渐变、模式
  context.strokeStyle = 'blue'
  //设置文字的内容和位置
  context.fillText('Hello Canvas', canvas!.width / 2 - 150, canvas!.height / 2 + 15)
  context.strokeText('Hello Canvas', canvas!.width / 2 - 150, canvas!.height / 2 + 15)

  console.log(canvasRef, document.getElementById('canvas'))
  console.log('是否相等:', canvasRef.value === document.getElementById('canvas'))
})
</script>
<style lang="scss" scoped></style>
