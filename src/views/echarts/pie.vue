<template>
  <div class="pie-container">
    <time-slider v-model="timePoints" />
    <div class="time-segments">
      <div v-for="(segment, index) in timeSegments" :key="index">
        {{ formatTimeRange(segment) }}
      </div>
    </div>
    <!-- <old-time-slider /> -->
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import TimeSlider from './TimeSlider.vue'
// import oldTimeSlider from './oldTimeSlider.vue'

const timePoints = ref([]) // 存储时间点（单位：分钟）

// 监听timePoints的变化
watch(timePoints, (newVal) => {
  console.log('timePoints:', newVal)
})

// 计算时间段
const timeSegments = computed(() => {
  const points = [0, ...timePoints.value.sort((a, b) => a - b), 1440]
  const segments = []

  for (let i = 0; i < points.length - 1; i++) {
    segments.push([points[i], points[i + 1]])
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
