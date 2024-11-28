<template>
  <div class="random-color-container">
    <h3>原始算法生成的颜色</h3>
    <div class="color-grid">
      <div v-for="(color, index) in colorBlocks" :key="index" class="color-block" :style="{ backgroundColor: color }">
        <span class="color-value">{{ color }}</span>
      </div>
    </div>
    <button @click="generateNewOriginalColors">重新生成颜色</button>
  </div>

  <!-- chroma-js效果对比 -->
  <div class="chroma-container">
    <h3>Chroma.js 生成的颜色</h3>
    <div class="color-grid">
      <div v-for="(color, index) in chromaColors" :key="index" class="color-block" :style="{ backgroundColor: color }">
        <span class="color-value">{{ color }}</span>
      </div>
    </div>
    <button @click="generateNewChromaColors">重新生成颜色</button>
  </div>

  <!-- 新增 chroma scale 颜色展示 -->
  <div class="chroma-container">
    <h3>Chroma.js Scale 颜色渐变</h3>
    <div class="color-grid">
      <div v-for="(color, index) in scaleColors" :key="index" class="color-block" :style="{ backgroundColor: color }">
        <span class="color-value">{{ color }}</span>
      </div>
    </div>
    <button @click="generateNewScaleColors">重新生成渐变色</button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { colorPalette, chromaRandomColor } from '@/utils'
import chroma from 'chroma-js'

const colorBlocks = ref<string[]>([])
const chromaColors = ref<string[]>([])
const scaleColors = ref<string[]>([])
const count = 40
const pastelRainbow = [
  '#ffadad', // 柔和的红色
  '#ffd6a5', // 柔和的橙色
  '#fdffb6', // 柔和的黄色
  '#caffbf', // 柔和的绿色
  '#9bf6ff', // 柔和的青色
  '#a0c4ff', // 柔和的蓝色
  '#bdb2ff', // 柔和的靛色
  '#ffc6ff', // 柔和的紫色
  '#77dd77', // 柔和的绿色
  '#43b0f1', // 柔和的蓝色
  '#2ecc71', // 柔和的绿色
  '#69ebfc', // 柔和的青色
  '#a898f3', // 柔和的紫色
]
const generateOriginalColors = () => {
  colorBlocks.value = colorPalette(count)
}

const generateChromaColors = () => {
  chromaColors.value = chromaRandomColor(count)
}

// 生成随机数据
// const generateRandomValues = (count: number) => {
//   return Array.from({ length: count }, () => Math.random() * 100)
// }

// 生成渐变色
const generateScaleColors = () => {
  const colorScale = chroma.scale(pastelRainbow).mode('lch').padding(0.1)

  scaleColors.value = colorScale.colors(count).map((color) =>
    chroma(color)
      .luminance(0.7) // 控制亮度，范围0-1，值越大越亮
      .saturate(0.8) // 控制饱和度
      .hex()
  )
}

const generateNewOriginalColors = () => {
  generateOriginalColors()
}

const generateNewChromaColors = () => {
  generateChromaColors()
}

const generateNewScaleColors = () => {
  generateScaleColors()
}

onMounted(() => {
  generateOriginalColors()
  generateChromaColors()
  generateScaleColors()
})
</script>

<style scoped>
.random-color-container,
.chroma-container {
  padding: 20px;
  margin-bottom: 40px;
}

h3 {
  margin-bottom: 20px;
  color: #333;
  font-size: 18px;
}

.color-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}

.color-block {
  width: 150px;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
  transition: transform 0.2s;
}

.color-block:hover {
  transform: scale(1.05);
}

.color-value {
  background: rgba(15, 15, 15, 0.9);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 14px;
  position: absolute;
  bottom: 10px;
}

button {
  padding: 8px 16px;
  background: #4834df;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;
}

button:hover {
  background: #3a2ab8;
}
</style>
