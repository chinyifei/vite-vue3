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
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { colorPalette, chromaRandomColor } from '@/utils'

const colorBlocks = ref<string[]>([])
const chromaColors = ref<string[]>([])
const count = 40

const generateOriginalColors = () => {
  colorBlocks.value = colorPalette(count)
}

const generateChromaColors = () => {
  console.log(chromaRandomColor())
  chromaColors.value = chromaRandomColor(count)
}

const generateNewOriginalColors = () => {
  generateOriginalColors()
}

const generateNewChromaColors = () => {
  generateChromaColors()
}

onMounted(() => {
  generateOriginalColors()
  generateChromaColors()
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
