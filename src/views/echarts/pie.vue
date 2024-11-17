<template>
  <!--  :popup-visible="popupVisible"
    :trigger-props="{ preventDefault: false }"
    @popup-visible-change="onPopupVisibleChange" -->
  <a-trigger trigger="contextMenu" align-point>
    <div class="v-box">
      <v-chart class="chart" :option="option" autoresize theme="light" @click="handleChartClick" @contextmenu="handleContextMenu" />
    </div>
    <template #content>
      <div class="demo-point">
        <a-empty />
      </div>
    </template>
  </a-trigger>
</template>

<script setup>
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { PieChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import VChart, { THEME_KEY } from 'vue-echarts'
import { ref, provide } from 'vue'

use([CanvasRenderer, PieChart, TitleComponent, TooltipComponent, LegendComponent])

provide(THEME_KEY, 'dark')

const selectedIndices = ref([])

// const popupVisible = ref(false)

// tag：不要删除注释 右键点击时，弹出菜单
// const onPopupVisibleChange = (visible) => {
//   popupVisible.value = visible
// }

// 添加一个通用的时间格式化函数
const formatTime = (hours, mins) => {
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`
}

const handleChartClick = (params) => {
  params.event.event.stopPropagation()

  const { data, dataIndex } = params
  const [startMinutes, endMinutes] = data.timeRange
  const startHours = Math.floor(startMinutes / 60)
  const startMins = startMinutes % 60
  const endHours = Math.floor(endMinutes / 60)
  const endMins = endMinutes % 60

  // 更新选中状态
  const index = selectedIndices.value.indexOf(dataIndex)
  const isSelected = index === -1 // 如果不在选中数组中，则这次点击后会被选中

  if (index > -1) {
    selectedIndices.value.splice(index, 1)
  } else {
    selectedIndices.value.push(dataIndex)
  }

  option.value.series[0].data = option.value.series[0].data.map((item, index) => ({
    ...item,
    selected: selectedIndices.value.includes(index), // 更新数据中的选中状态
    itemStyle: {
      ...item.itemStyle,
      scale: selectedIndices.value.includes(index),
      scaleSize: 10,
    },
    emphasis: {
      disabled: selectedIndices.value.includes(index),
      scale: true,
      scaleSize: 10,
    },
  }))
  console.log('点击的饼图数据:', {
    id: data.id,
    name: data.name,
    timeRange: `${formatTime(startHours, startMins)} - ${formatTime(endHours, endMins)}`,
    duration: `${Math.floor(data.value / 60)}小时${data.value % 60}分钟`,
    selected: isSelected, // 添加选中状态
  })
}

const handleContextMenu = (params) => {
  // 阻止默认行为（阻止浏览器默认的右键菜单）
  params.event.event.preventDefault()
  // 阻止事件冒泡到父元素
  params.event.event.stopPropagation()
  // popupVisible.value = true

  if (params.componentType === 'series') {
    const { data, dataIndex } = params
    const [startMinutes, endMinutes] = data.timeRange
    const startHours = Math.floor(startMinutes / 60)
    const startMins = startMinutes % 60
    const endHours = Math.floor(endMinutes / 60)
    const endMins = endMinutes % 60

    console.log(
      '右键点击的饼图数据:',
      {
        id: data.id,
        name: data.name,
        timeRange: `${formatTime(startHours, startMins)} - ${formatTime(endHours, endMins)}`,
        duration: `${Math.floor(data.value / 60)}小时${data.value % 60}分钟`,
        value: data.timeRange,
      },
      data
    )

    // 这里可以添加你的右键点击逻辑
    // 比如显示自定义菜单等
  }
}

const option = ref({
  tooltip: {
    trigger: 'item',
    formatter: (params) => {
      const { timeRange } = params.data // 从data中获取时间范围
      const [startMinutes, endMinutes] = timeRange
      const startHours = Math.floor(startMinutes / 60)
      const startMins = startMinutes % 60
      const endHours = Math.floor(endMinutes / 60)
      const endMins = endMinutes % 60

      const durationHours = Math.floor(params.value / 60)
      const durationMins = params.value % 60

      return `${params.name}<br/>
              时间段：${formatTime(startHours, startMins)} - ${formatTime(endHours, endMins)}<br/>
              时长：${durationHours}小时${durationMins}分钟`
    },
  },
  legend: {
    top: '5%',
    left: 'center',
  },
  series: [
    {
      name: '时间分配',
      type: 'pie',
      radius: ['40%', '70%'],
      padAngle: 2,
      // startAngle: 90, // 设置起始角度，使0点位于最上方（12点钟方向）
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2,
      },
      label: {
        show: false,
      },
      emphasis: {
        scale: true,
        scaleSize: 10,
        label: {
          show: false,
        },
      },
      labelLine: {
        show: false,
      },
      data: [
        {
          value: 240, // 使用持续时间作为主要的value
          timeRange: [0, 240], // 时间范围作为额外属性
          name: '凌晨',
          id: 1,
          selected: false, // 添加初始选中状态
        },
        {
          value: 360,
          timeRange: [240, 600],
          name: '早上',
          id: 2,
          selected: false,
        },
        {
          value: 120,
          timeRange: [600, 720],
          name: '中午',
          id: 3,
          selected: false,
        },
        {
          value: 300,
          timeRange: [720, 1020],
          name: '下午',
          id: 4,
          selected: false,
        },
        {
          value: 180,
          timeRange: [1020, 1200],
          name: '傍晚',
          id: 5,
          selected: false,
        },
        {
          value: 240,
          timeRange: [1200, 1440],
          name: '晚上',
          id: 6,
          selected: false,
        },
      ].map((item) => ({
        ...item,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2,
          scale: false,
          scaleSize: 10,
        },
        emphasis: {
          disabled: false,
          scale: true,
          scaleSize: 10,
        },
      })),
    },
  ],
})
</script>

<style scoped>
.v-box {
  width: 800px;
  height: 800px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.chart {
  height: 800px;
  width: 800px;
}

.demo-point-trigger {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 300px;
  background-color: var(--color-fill-2);
}

.demo-point {
  padding: 10px;
  width: 200px;
  background-color: var(--color-bg-popup);
  border-radius: 4px;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.15);
}

.demo-point-wrapper {
  display: block;
}
</style>
