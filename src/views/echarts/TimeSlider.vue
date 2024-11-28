<template>
  <div class="time-slider-container" @mousemove="handleMouseMove" @mouseup="handleMouseUp" @mouseleave="handleMouseLeave">
    <div ref="trackRef" class="slider-track">
      <!-- 滑块容器：用于展示所有的时间点滑块 -->
      <div class="slider-handles">
        <template v-for="(point, index) in sortedTimePoints" :key="index">
          <div
            class="slider-handle"
            :style="{ left: `${(point / 1440) * 100}%` }"
            :class="{ 'is-dragging': isDragging && currentPointIndex === index }"
            @mousedown.stop="startDragging(index, $event)"
            @contextmenu.prevent="showContextMenu(index, $event)"
          >
            <!-- 悬浮提示：显示具体时间 -->
            <div class="handle-tooltip">{{ formatTime(point) }}</div>
          </div>
        </template>
      </div>

      <!-- 时间刻度：展示24小时刻度，支持双击添加时间点 -->
      <div class="time-marks" @dblclick.stop="addTimePoint">
        <div v-for="hour in 25" :key="hour" class="time-mark" :style="{ left: `${((hour - 1) / 24) * 100}%` }">
          <div class="mark-label">{{ hour - 1 }}:00</div>
        </div>
      </div>
    </div>

    <!-- 右键菜单 -->
    <div v-show="showMenu" class="context-menu" :style="{ left: menuPosition.x + 'px', top: menuPosition.y + 'px' }">
      <div class="menu-item delete" @click="deleteTimePoint">删除时间点</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onUnmounted } from 'vue'

// 组件属性：接收外部传入的时间点数组
const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
})

// 定义组件事件
const emit = defineEmits(['update:modelValue'])

// 组件内部状态
const trackRef = ref(null) // 滑动轨道的引用
const isDragging = ref(false) // 是否正在拖动
const currentPointIndex = ref(null) // 当前拖动的时间点索引
const timePoints = ref(props.modelValue || []) // 内部维护的时间点数组

// 右键菜单状态
const showMenu = ref(false)
const menuPosition = ref({ x: 0, y: 0 })
const menuTargetIndex = ref(null)

// 计算属性：确保时间点按升序排序
const sortedTimePoints = computed(() => {
  return [...timePoints.value].sort((a, b) => a - b)
})

// 监听外部传入的值变化
watch(
  () => props.modelValue,
  (newVal) => {
    // 只在非拖动状态下更新内部值
    if (newVal && !isDragging.value) {
      timePoints.value = newVal
    }
  },
  { deep: true }
)

/**
 * 格式化时间显示
 * @param {number} minutes - 分钟数（0-1440）
 * @returns {string} 格式化后的时间字符串（HH:mm）
 */
const formatTime = (minutes) => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`
}

/**
 * 将鼠标位置转换为时间值
 * @param {number} position - 鼠标的clientX位置
 * @returns {number} 对应的分钟数（0-1440）
 */
const positionToValue = (position) => {
  const track = trackRef.value
  const rect = track.getBoundingClientRect()
  const percent = (position - rect.left) / rect.width
  return Math.round(Math.max(0, Math.min(1440, percent * 1440)))
}

/**
 * 添加新的时间点
 * 通过双击时间轴添加新的时间点
 */
const addTimePoint = (event) => {
  const newValue = positionToValue(event.clientX)

  // 禁止在端点附近添加时间点（距离端点10分钟内）
  if (newValue <= 10 || newValue >= 1430) {
    return
  }

  // 检查是否已存在相近的点（5分钟内）
  const hasNearbyPoint = timePoints.value.some((point) => Math.abs(point - newValue) < 5)

  if (!hasNearbyPoint) {
    timePoints.value.push(newValue)
    updateModelValue()
  }
}

/**
 * 开始拖动时间点
 * @param {number} index - 被拖动的时间点索引
 * @param {Event} event - 鼠标事件对象
 */
const startDragging = (index, event) => {
  event.preventDefault()
  // 确保之前的拖动已经完全结束
  stopDragging()

  // 设置当前拖动状态
  isDragging.value = true
  currentPointIndex.value = index
}

/**
 * 处理鼠标移动
 */
const handleMouseMove = (event) => {
  if (!isDragging.value || currentPointIndex.value === null) return

  const newValue = positionToValue(event.clientX)

  // 添加边界检查，确保不会与相邻点重叠，且不会到达端点
  const points = sortedTimePoints.value
  const currentIdx = points.indexOf(timePoints.value[currentPointIndex.value])

  // 检查左右边界，增加端点限制
  const leftBound = currentIdx > 0 ? points[currentIdx - 1] + 5 : 10 // 最小值为10分钟
  const rightBound = currentIdx < points.length - 1 ? points[currentIdx + 1] - 5 : 1430 // 最大值为1430分钟

  // 限制在有效范围内
  const boundedValue = Math.max(leftBound, Math.min(rightBound, newValue))

  timePoints.value[currentPointIndex.value] = boundedValue
  updateModelValue()
}

/**
 * 处理鼠标松开
 */
const handleMouseUp = () => {
  if (isDragging.value) {
    stopDragging()
  }
}

/**
 * 处理鼠标离开容器
 */
const handleMouseLeave = () => {
  if (isDragging.value) {
    stopDragging()
  }
}

/**
 * 停止拖动
 */
const stopDragging = () => {
  if (isDragging.value) {
    isDragging.value = false
    currentPointIndex.value = null
    // 确保更新最终位置
    updateModelValue()
  }
}

/**
 * 更新v-model值
 */
const updateModelValue = () => {
  emit('update:modelValue', sortedTimePoints.value)
}

// 显示右键菜单
const showContextMenu = (index, event) => {
  event.preventDefault()
  menuTargetIndex.value = index
  menuPosition.value = {
    x: event.clientX,
    y: event.clientY,
  }
  showMenu.value = true

  // 添加一次性点击事件监听器来关闭菜单
  document.addEventListener('click', closeContextMenu, { once: true })
}

// 关闭右键菜单
const closeContextMenu = () => {
  showMenu.value = false
  menuTargetIndex.value = null
}

// 删除时间点
const deleteTimePoint = () => {
  if (menuTargetIndex.value !== null) {
    timePoints.value = timePoints.value.filter((_, index) => index !== menuTargetIndex.value)
    updateModelValue()
    closeContextMenu()
  }
}

// 在组件卸载时确保清理事件监听器
onUnmounted(() => {
  document.removeEventListener('click', closeContextMenu)
})
</script>

<style scoped>
/* 样式保持不变 */
.time-slider-container {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  user-select: none; /* 防止拖动时选中文本 */
}

/* 滑动轨道 */
.slider-track {
  position: relative;
  width: 100%;
  height: 4px;
  background-color: #e5e6eb;
  border-radius: 2px;
  margin: 30px 0;
}

/* 滑块容器 */
.slider-handles {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none; /* 防止干扰时间轴的点击事件 */
}

/* 滑块样式 */
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
  pointer-events: auto; /* 允许滑块接收鼠标事件 */
  z-index: 1;
  transition:
    border-color 0.2s,
    transform 0.2s;
}

/* 添加拖动状态的样式 */
.slider-handle.is-dragging {
  border-color: #0040c9;
  transform: translate(-50%, -50%) scale(1.1);
  z-index: 2;
  cursor: grabbing;
}

/* 滑块悬浮提示 */
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

/* 时间刻度容器 */
.time-marks {
  position: absolute;
  width: 100%;
  height: 100%;
  cursor: pointer;
}

/* 时间刻度线 */
.time-mark {
  position: absolute;
  width: 1px;
  height: 6px;
  background-color: #c9cdd4;
  transform: translateX(-50%);
  top: 10px;
}

/* 时间刻度标签 */
.mark-label {
  position: absolute;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 12px;
  color: #86909c;
  white-space: nowrap;
}

/* 右键菜单样式 */
.context-menu {
  position: fixed;
  background: white;
  border: 1px solid #e5e6eb;
  border-radius: 4px;
  padding: 4px 0;
  min-width: 100px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 1000;
}

.menu-item {
  padding: 8px 12px;
  cursor: pointer;
  font-size: 14px;
  color: #1d2129;
  transition: background-color 0.2s;
}

.menu-item:hover {
  background-color: #f2f3f5;
}

.menu-item.delete {
  color: #f53f3f;
}

.menu-item.delete:hover {
  background-color: #fff2f2;
}

/* 添加端点标记样式 */
.time-mark:first-child,
.time-mark:last-child {
  height: 10px; /* 端点刻度线加长 */
  background-color: #f53f3f; /* 端点刻度线变红 */
}

.time-mark:first-child .mark-label,
.time-mark:last-child .mark-label {
  color: #f53f3f; /* 端点文字变红 */
  font-weight: bold;
}
</style>
