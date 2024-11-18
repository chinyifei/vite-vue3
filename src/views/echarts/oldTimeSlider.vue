<template>
  <div class="time-slider-container">
    <!-- <div class="time-display">
      <div class="time-label">{{ formatTime(startValue) }}</div>
      <div class="time-label">{{ formatTime(endValue) }}</div>
    </div> -->

    <div ref="trackRef" class="slider-track" @mousedown="onTrackClick">
      <div
        class="slider-bar"
        :style="{
          left: `${leftPercent}%`,
          width: `${rightPercent - leftPercent}%`,
        }"
      ></div>

      <div class="slider-handle start" :style="{ left: `${leftPercent}%` }" @mousedown="startDragging('start', $event)">
        <div class="handle-tooltip">{{ formatTime(startValue) }}</div>
      </div>

      <div class="slider-handle end" :style="{ left: `${rightPercent}%` }" @mousedown="startDragging('end', $event)">
        <div class="handle-tooltip">{{ formatTime(endValue) }}</div>
      </div>

      <div class="time-marks">
        <div v-for="hour in 24" :key="hour" class="time-mark" :style="{ left: `${(hour / 24) * 100}%` }">
          <div class="mark-label">{{ hour }}:00</div>
        </div>
      </div>
    </div>

    <!-- <div class="time-input">
      <input v-model="timeRangeName" class="name-input" placeholder="请输入时间段名称" />
      <button class="submit-btn" @click="submitTimeRange">添加分割点</button>
    </div> -->
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

// const emit = defineEmits(['submit'])

const trackRef = ref(null)
const startValue = ref(0) // 以分钟为单位，0-1440
const endValue = ref(240)
// const timeRangeName = ref('')
const isDragging = ref(false)
const currentHandle = ref(null)

// 计算百分比位置
const leftPercent = computed(() => (startValue.value / 1440) * 100)
const rightPercent = computed(() => (endValue.value / 1440) * 100)

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

// 开始拖动
const startDragging = (handle, event) => {
  event.preventDefault()
  isDragging.value = true
  currentHandle.value = handle
  document.addEventListener('mousemove', onDragging)
  document.addEventListener('mouseup', stopDragging)
}

// 拖动中
const onDragging = (event) => {
  if (!isDragging.value) return

  const newValue = positionToValue(event.clientX)

  if (currentHandle.value === 'start') {
    if (newValue < endValue.value) {
      startValue.value = newValue
    }
  } else {
    if (newValue > startValue.value) {
      endValue.value = newValue
    }
  }
}

// 停止拖动
const stopDragging = () => {
  isDragging.value = false
  currentHandle.value = null
  document.removeEventListener('mousemove', onDragging)
  document.removeEventListener('mouseup', stopDragging)
}

// 点击轨道
const onTrackClick = (event) => {
  const newValue = positionToValue(event.clientX)
  const middlePoint = (startValue.value + endValue.value) / 2

  if (newValue < middlePoint) {
    startValue.value = newValue
  } else {
    endValue.value = newValue
  }
}

// // 提交时间范围
// const submitTimeRange = () => {
//   if (!timeRangeName.value) {
//     alert('请输入时间段名称')
//     return
//   }

//   emit('submit', {
//     name: timeRangeName.value,
//     timeRange: [startValue.value, endValue.value],
//   })

//   // 重置输入
//   timeRangeName.value = ''
// }

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

.time-display {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.time-label {
  font-size: 14px;
  color: #4e5969;
}

.slider-track {
  position: relative;
  width: 100%;
  height: 4px;
  background-color: #e5e6eb;
  border-radius: 2px;
  cursor: pointer;
  margin: 30px 0;
}

.slider-bar {
  position: absolute;
  height: 100%;
  background-color: #165dff;
  border-radius: 2px;
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

.time-input {
  margin-top: 40px;
  display: flex;
  gap: 16px;
}

.name-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #e5e6eb;
  border-radius: 4px;
  font-size: 14px;
}

.name-input:focus {
  border-color: #165dff;
  outline: none;
}

.submit-btn {
  padding: 8px 16px;
  background-color: #165dff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.submit-btn:hover {
  background-color: #306fe7;
}
</style>
