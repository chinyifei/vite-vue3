<template>
  <div class="time-slider-container">
    <div ref="trackRef" class="slider-track">
      <div class="slider-handles">
        <template v-for="(point, index) in sortedTimePoints" :key="index">
          <div class="slider-handle" :style="{ left: `${(point / 1440) * 100}%` }" @mousedown="startDragging(index, $event)">
            <div class="handle-tooltip">{{ formatTime(point) }}</div>
          </div>
        </template>
      </div>

      <div class="time-marks" @dblclick="addTimePoint">
        <div v-for="hour in 24" :key="hour" class="time-mark" :style="{ left: `${(hour / 24) * 100}%` }">
          <div class="mark-label">{{ hour }}:00</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['update:modelValue'])

const trackRef = ref(null)
const isDragging = ref(false)
const currentPointIndex = ref(null)

// 内部维护的时间点数组（按分钟计算，0-1440）
const timePoints = ref(props.modelValue || [])

// 确保时间点按升序排序
const sortedTimePoints = computed(() => {
  return [...timePoints.value].sort((a, b) => a - b)
})

// 监听外部值变化
watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal && !isDragging.value) {
      timePoints.value = newVal
    }
  },
  { deep: true }
)

// 格式化时间显示
const formatTime = (minutes) => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`
}

// 将鼠标位置转换为时间值
const positionToValue = (position) => {
  const track = trackRef.value
  const rect = track.getBoundingClientRect()
  const percent = (position - rect.left) / rect.width
  return Math.round(Math.max(0, Math.min(1440, percent * 1440)))
}

// 添加新的时间点
const addTimePoint = (event) => {
  const newValue = positionToValue(event.clientX)

  // 检查是否已存在相近的点（5分钟内）
  const hasNearbyPoint = timePoints.value.some((point) => Math.abs(point - newValue) < 5)

  if (!hasNearbyPoint) {
    timePoints.value.push(newValue)
    updateModelValue()
  }
}

// 开始拖动
const startDragging = (index, event) => {
  event.preventDefault()
  isDragging.value = true
  currentPointIndex.value = index

  document.addEventListener('mousemove', onDragging)
  document.addEventListener('mouseup', stopDragging)
}

// 拖动中
const onDragging = (event) => {
  if (!isDragging.value) return

  const newValue = positionToValue(event.clientX)

  // 更新当前拖动点的位置
  if (currentPointIndex.value !== null) {
    timePoints.value[currentPointIndex.value] = newValue
    updateModelValue()
  }
}

// 停止拖动
const stopDragging = () => {
  isDragging.value = false
  currentPointIndex.value = null
  document.removeEventListener('mousemove', onDragging)
  document.removeEventListener('mouseup', stopDragging)
}

// 更新v-model值
const updateModelValue = () => {
  emit('update:modelValue', sortedTimePoints.value)
}

// 清理事件监听
onUnmounted(() => {
  document.removeEventListener('mousemove', onDragging)
  document.removeEventListener('mouseup', stopDragging)
})
</script>

<style scoped>
.time-slider-container {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
}

.slider-track {
  position: relative;
  width: 100%;
  height: 4px;
  background-color: #e5e6eb;
  border-radius: 2px;
  margin: 30px 0;
}

.slider-handles {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.slider-handle {
  position: absolute;
  top: 50%;
  width: 14px;
  height: 14px;
  background-color: #fff;
  border: 2px solid #165dff;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  cursor: grab;
  pointer-events: auto;
  z-index: 1;
}

.slider-handle:hover .handle-tooltip {
  opacity: 1;
}

.handle-tooltip {
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  padding: 4px 8px;
  background-color: #1d2129;
  color: #fff;
  font-size: 12px;
  border-radius: 4px;
  opacity: 0;
  transition: opacity 0.2s;
  white-space: nowrap;
}

.time-marks {
  position: absolute;
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.time-mark {
  position: absolute;
  width: 1px;
  height: 6px;
  background-color: #c9cdd4;
  transform: translateX(-50%);
  top: 10px;
}

.mark-label {
  position: absolute;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 12px;
  color: #86909c;
  white-space: nowrap;
}
</style>
