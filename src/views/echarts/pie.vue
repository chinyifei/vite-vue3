<template>
  <div class="pie-container">
    <time-slider v-model="timePoints" />
    <div class="time-segments">
      <div v-for="(segment, index) in timeSegments" :key="index">
        {{ formatTimeRange(segment) }}
      </div>
    </div>
    <!-- <old-time-slider /> -->
    <pie-demo1 />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import TimeSlider from './TimeSlider.vue'
// import oldTimeSlider from './oldTimeSlider.vue'
import pieDemo1 from './pieDemo1.vue'

const timePoints = ref([]) // 存储时间点（单位：分钟）

// 监听timePoints的变化
watch(timePoints, (newVal) => {
  console.log('timePoints:', newVal)
})

// 计算时间段 - 修复计算属性中的副作用
const timeSegments = computed(() => {
  // 创建新数组并排序，避免修改原数组
  const sortedPoints = [0, ...timePoints.value].sort((a, b) => a - b)
  sortedPoints.push(1440)

  const segments = []
  for (let i = 0; i < sortedPoints.length - 1; i++) {
    segments.push([sortedPoints[i], sortedPoints[i + 1]])
  }

  return segments
})

// 格式化时间范围显示
const formatTimeRange = (segment) => {
  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`
  }

  return `${formatTime(segment[0])} - ${formatTime(segment[1])}`
}
</script>

<style scoped>
.pie-container {
  width: 1000px;
}
.time-segments {
  margin-top: 20px;
  padding: 10px;
}
</style>
