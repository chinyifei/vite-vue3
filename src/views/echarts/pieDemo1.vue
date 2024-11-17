<template>
  <v-chart class="chart" :option="option" autoresize theme="light" @click="handleChartClick" @contextmenu="handleContextMenu" />
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

const handleChartClick = (params) => {
  const { data, dataIndex } = params
  console.log('点击的饼图数据:', {
    id: data.id,
    name: data.name,
    value: data.value,
  })

  const index = selectedIndices.value.indexOf(dataIndex)
  if (index > -1) {
    selectedIndices.value.splice(index, 1)
  } else {
    selectedIndices.value.push(dataIndex)
  }

  option.value.series[0].data = option.value.series[0].data.map((item, index) => ({
    ...item,
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
}

const handleContextMenu = (params) => {
  params.event.event.preventDefault()

  if (params.componentType === 'series') {
    const { data, dataIndex } = params
    console.log(
      '右键点击的饼图数据:',
      {
        id: data.id,
        name: data.name,
        value: data.value,
      },
      dataIndex
    )

    // 这里可以添加你的右键点击逻辑
    // 比如显示自定义菜单等
  }
}

const option = ref({
  tooltip: {
    trigger: 'item',
    formatter: (params) => {
      const hours = Math.floor(params.value / 60)
      const minutes = params.value % 60
      return `${params.name}<br/>时长：${hours}小时${minutes}分钟`
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
          value: 240, // 4小时 = 240分钟 (00:00-04:00)
          name: '凌晨',
          id: 1,
        },
        {
          value: 360, // 6小时 = 360分钟 (04:00-10:00)
          name: '早上',
          id: 2,
        },
        {
          value: 120, // 2小时 = 120分钟 (10:00-12:00)
          name: '中午',
          id: 3,
        },
        {
          value: 300, // 5小时 = 300分钟 (12:00-17:00)
          name: '下午',
          id: 4,
        },
        {
          value: 180, // 3小时 = 180分钟 (17:00-20:00)
          name: '傍晚',
          id: 5,
        },
        {
          value: 240, // 4小时 = 240分钟 (20:00-24:00)
          name: '晚上',
          id: 6,
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
.chart {
  height: 800px;
  width: 800px;
}
</style>
