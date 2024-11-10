<template>
  <div class="container">
    <div id="map"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { GaodeMap } from '@antv/l7-maps'
import { Scene, PointLayer } from '@antv/l7'

const position = ref([113.76532705801831, 34.7679894605431])

onMounted(() => {
  // AMapLoader.load({
  //   key: 'bd6aecd36d2f100f16a9cbb47b357b28', // 申请好的Web端开发者Key，首次调用 load 时必填
  //   version: '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
  //   plugins: ['AMap.Scale'], // 需要使用的的插件列表，如比例尺'AMap.Scale'，支持添加多个如：['...','...']
  // })
  //   .then((AMap) => {
  //     map.value = new AMap.Map('map', {
  //       // 设置地图容器id
  //       viewMode: '3D', // 是否为3D地图模式
  //       zoom: 11, // 初始化地图级别
  //       center: [116.397428, 39.90923], // 初始化地图中心点位置
  //     });
  //   })
  //   .catch((e) => {
  //     console.log(e);
  //   });
  // const scene = new Scene({
  //   id: 'map',
  //   map: new GaodeMap({
  //     style: 'dark', // 样式URL
  //     center: [113.76532705801831, 34.7679894605431],
  //     pitch: 35.210526315789465,
  //     zoom: 12,
  //     token: 'bd6aecd36d2f100f16a9cbb47b357b28',
  //   }),
  // });
  const scene = new Scene({
    id: 'map',
    map: new GaodeMap({
      style: 'normal',
      center: [121.435159, 31.256971],
      zoom: 14.89,
      minZoom: 10,
      token: 'bd6aecd36d2f100f16a9cbb47b357b28',
    }),
  })
  scene.on('loaded', () => {
    fetch('https://gw.alipayobjects.com/os/basement_prod/893d1d5f-11d9-45f3-8322-ee9140d288ae.json')
      .then((res) => res.json())
      .then((data) => {
        const pointLayer = new PointLayer({})
          .source(data, {
            parser: {
              type: 'json',
              x: 'longitude',
              y: 'latitude',
            },
          })
          .shape('name', ['circle', 'triangle', 'square', 'pentagon', 'hexagon', 'octogon', 'hexagram', 'rhombus', 'vesica'])
          .size('unit_price', [10, 25])
          .active(true)
          .color('name', ['#5B8FF9', '#5CCEA1', '#5D7092', '#F6BD16', '#E86452'])
          .style({
            opacity: 1,
            strokeWidth: 2,
          })

        scene.addLayer(pointLayer)
      })
  })
})
// onUnmounted(() => {
//   map.value?.destroy();
// });
</script>

<style lang="scss" scoped>
.container {
  min-height: calc(100vh - 60px);
  background-color: var(--color-fill-2);
  // display: flex;
  .amap-container {
    background-color: transparent !important;
  }
  #map {
    width: 100vw;
    height: calc(100vh - 60px);
    position: relative;
    justify-content: center;
    // height: 100%;
    // min-height: calc(100vh - 60px);
  }
}
</style>
