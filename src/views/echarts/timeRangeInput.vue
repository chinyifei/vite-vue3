<template>
  <div class="time-range-container">
    <div class="time-blocks">
      <div
        v-for="(block, index) in timeBlocks"
        :key="index"
        class="time-block"
        draggable="true"
        @dragstart="handleDragStart(index)"
        @dragend="handleDragEnd"
        @dragover.prevent
        @drop="handleDrop(index)"
      >
        <div class="block-header">
          <span>时间段 {{ index + 1 }}</span>
          <a-button type="text" status="danger" @click="removeBlock(index)">
            <icon-close />
          </a-button>
        </div>
        <a-form :model="block" layout="vertical">
          <a-form-item label="名称">
            <a-input v-model="block.name" placeholder="请输入时间段名称" />
          </a-form-item>
          <a-form-item label="时间范围">
            <a-time-picker
              v-model="block.startTime"
              disable-confirm
              format="HH:mm"
              placeholder="开始时间"
              style="width: 120px"
              @change="updateTimeRange(index)"
            />
            <span class="separator">至</span>
            <a-time-picker
              v-model="block.endTime"
              disable-confirm
              format="HH:mm"
              placeholder="结束时间"
              style="width: 120px"
              @change="updateTimeRange(index)"
            />
          </a-form-item>
        </a-form>
      </div>
    </div>

    <div class="actions">
      <a-button type="primary" @click="addNewBlock">
        <template #icon>
          <icon-plus />
        </template>
        添加时间段
      </a-button>
      <a-button type="primary" style="margin-left: 16px" @click="submitData"> 确认提交 </a-button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Message } from '@arco-design/web-vue'

const timeBlocks = ref([])
let draggedItem = null

// 添加新的时间块
const addNewBlock = () => {
  timeBlocks.value.push({
    name: '',
    startTime: '',
    endTime: '',
    timeRange: [0, 0],
  })
}

// 移除时间块
const removeBlock = (index) => {
  timeBlocks.value.splice(index, 1)
}

// 转换时间为分钟数
const timeToMinutes = (time) => {
  if (!time) return 0
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

// 更新时间范围
const updateTimeRange = (index) => {
  const block = timeBlocks.value[index]
  const startMinutes = timeToMinutes(block.startTime)
  const endMinutes = timeToMinutes(block.endTime)
  block.timeRange = [startMinutes, endMinutes]
}

// 拖拽相关方法
const handleDragStart = (index) => {
  console.log('handleDragStart', index)
  draggedItem = index
}

const handleDragEnd = () => {
  draggedItem = null
}

const handleDrop = (dropIndex) => {
  console.log('dropIndex', dropIndex)
  if (draggedItem === null) return

  const itemToMove = timeBlocks.value[draggedItem]
  timeBlocks.value.splice(draggedItem, 1)
  timeBlocks.value.splice(dropIndex, 0, itemToMove)
}

// 提交数据
const submitData = () => {
  // 验证数据
  const isValid = timeBlocks.value.every((block) => block.name && block.startTime && block.endTime)

  if (!isValid) {
    Message.error('请填写完整的时间段信息')
    return
  }

  // 转换为目标格式
  const formattedData = timeBlocks.value.map((block) => ({
    timeRange: block.timeRange,
    name: block.name,
  }))

  console.log('提交的数据:', formattedData)
  // 这里可以触发事件将数据传递给父组件
  // emit('submit', formattedData)
}
</script>

<style scoped>
.time-range-container {
  padding: 20px;
}

.time-blocks {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}

.time-block {
  border: 1px solid var(--color-border);
  border-radius: 4px;
  padding: 16px;
  background: var(--color-bg-2);
  cursor: move;
}

.time-block:hover {
  border-color: var(--color-primary-light-3);
}

.block-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.separator {
  margin: 0 8px;
}

.actions {
  display: flex;
  justify-content: flex-start;
  margin-top: 20px;
}
</style>
