<template>
  <canvas ref="canvasRef"></canvas>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { fabric } from 'fabric'

type Point = {
  x: number
  y: number
}
// 相位数据类型
interface PhaseData {
  roadIndex: number // 道路索引 0-3，对应北东南西
  roadAngle: number // 道路角度
  inLanesType: LaneType[] // 进口车道类型
  hasPedestrianCrossing: boolean // 是否有人行横道
}

// todo : roadAngle 道路角度差小于40度时，70路宽会展示不正常
const props = withDefaults(
  defineProps<{
    phaseData?: PhaseData[]
    size?: number
    roadColor?: string
    strokeWidth?: number
  }>(),
  {
    phaseData: () => [
      {
        roadIndex: 0,
        roadAngle: 0,
        inLanesType: ['left', 'straight', 'right'],
        hasPedestrianCrossing: true,
      },
      {
        roadIndex: 1,
        roadAngle: 90,
        inLanesType: ['left', 'straight', 'right'],
        hasPedestrianCrossing: true,
      },
      {
        roadIndex: 2,
        roadAngle: 180,
        inLanesType: ['left', 'straight', 'right'],
        hasPedestrianCrossing: true,
      },
      {
        roadIndex: 3,
        roadAngle: 270,
        inLanesType: ['left', 'straight', 'right'],
        hasPedestrianCrossing: true,
      },
    ],
    size: 200,
    roadColor: '#3a3a3c',
    strokeWidth: 2,
  }
)

const canvasRef = ref<HTMLCanvasElement | null>(null)
let cvs: fabric.Canvas

// 画布配置
const CANVAS_SIZE = 200
const ROAD_WIDTH = 70
const CENTER = { x: CANVAS_SIZE / 2, y: CANVAS_SIZE / 2 }

/**
 * 计算基点坐标
 */
function calculateBasePoints(ang: number, roadWidth: number, lineDistance: number) {
  const angleRad = (ang * Math.PI) / 180
  const halfRoadWidth = roadWidth / 2

  const cx = Math.round(lineDistance * Math.cos(angleRad) + CENTER.x)
  const cy = Math.round(CENTER.y - lineDistance * Math.sin(angleRad))

  const offsetX = Math.round(halfRoadWidth * Math.cos(((90 - ang) * Math.PI) / 180))
  const offsetY = Math.round(halfRoadWidth * Math.sin(((90 - ang) * Math.PI) / 180))

  const x1 = cx - offsetX
  const x2 = cx + offsetX
  const y1 = cy - offsetY
  const y2 = cy + offsetY

  return { p1: { x: x1, y: y1 }, p2: { x: x2, y: y2 } }
}

/**
 * 计算移动距离
 */
function calculateMovement(basePoint: Point, angle: number, length: number) {
  const radian = (angle * Math.PI) / 180
  const dx = length * Math.cos(radian)
  const dy = length * Math.sin(radian)

  const movementX = dx
  const movementY = -dy

  const newX = basePoint.x + movementX
  const newY = basePoint.y + movementY

  return {
    newX: Math.round(newX),
    newY: Math.round(newY),
  }
}

/**
 * 计算两点之间最大距离
 */
function maxDistance(p1: Point, p2: Point, theta: number) {
  function calculateShortestDistance(basePoint: Point, theta: number) {
    const radian = (theta * Math.PI) / 180
    const dx = Math.cos(radian)
    const dy = Math.sin(radian)
    const { x: x1, y: y1 } = basePoint
    const intersections = []

    // 计算与画布边界的交点
    if (dx !== 0) {
      let intersectX = CANVAS_SIZE
      let intersectY = y1 + (CANVAS_SIZE - x1) * (dy / dx)
      if (intersectY >= 0 && intersectY <= CANVAS_SIZE) {
        intersections.push({ x: intersectX, y: intersectY })
      }

      intersectX = 0
      intersectY = y1 + (0 - x1) * (dy / dx)
      if (intersectY >= 0 && intersectY <= CANVAS_SIZE) {
        intersections.push({ x: intersectX, y: intersectY })
      }
    }

    if (dy !== 0) {
      let intersectY = CANVAS_SIZE
      let intersectX = x1 + (CANVAS_SIZE - y1) * (dx / dy)
      if (intersectX >= 0 && intersectX <= CANVAS_SIZE) {
        intersections.push({ x: intersectX, y: intersectY })
      }

      intersectY = 0
      intersectX = x1 + (0 - y1) * (dx / dy)
      if (intersectX >= 0 && intersectX <= CANVAS_SIZE) {
        intersections.push({ x: intersectX, y: intersectY })
      }
    }

    const distances = intersections.map((point) => Math.sqrt((point.x - x1) ** 2 + (point.y - y1) ** 2))

    return Math.min(...distances)
  }

  return Math.round(Math.min(calculateShortestDistance(p1, theta), calculateShortestDistance(p2, theta)))
}

/**
 * 初始化道路顶点数据
 */
function initRoadData(angles: number[]) {
  const vertices: Point[] = []
  const lineDistance = 50

  angles.forEach((angle) => {
    const { p1, p2 } = calculateBasePoints(angle, ROAD_WIDTH, lineDistance)
    const maxDist = maxDistance(p1, p2, angle)

    const result = calculateMovement(p1, angle, maxDist)
    const result2 = calculateMovement(p2, angle, maxDist)

    const borderPoint1 = { x: result.newX, y: result.newY }
    const borderPoint2 = { x: result2.newX, y: result2.newY }

    vertices.push(p2, borderPoint2, borderPoint1, p1)
  })

  return vertices
}

/**
 * 创建道路边缘路径
 */
function createEdgePathRTM(vertices: Point[]) {
  const filterVertices: Point[][] = []
  for (let i = 2; i < vertices.length; i += 4) {
    filterVertices.push([vertices[i + 1], vertices[i]])
  }

  const roadTrafficMarkings: Point[][] = []

  filterVertices.forEach((point) => {
    const nearOffsetPath = calculateParallelOffset([point[0], point[1]], 5)
    const farOffsetPath = calculateParallelOffset([point[0], point[1]], ROAD_WIDTH - 5)
    roadTrafficMarkings.push(farOffsetPath, nearOffsetPath)
  })

  roadTrafficMarkings.push(roadTrafficMarkings.shift()!)
  return roadTrafficMarkings
}

/**
 * 计算平行偏移
 */
function calculateParallelOffset(points: Point[], distance: number): Point[] {
  const [start, end] = points
  const dx = end.x - start.x
  const dy = end.y - start.y
  const length = Math.sqrt(dx * dx + dy * dy)

  if (length === 0) return points

  const unitX = dx / length
  const unitY = dy / length

  const offsetX = -distance * unitY
  const offsetY = distance * unitX

  return [
    { x: start.x + offsetX, y: start.y + offsetY },
    { x: end.x + offsetX, y: end.y + offsetY },
  ]
}

/**
 * 计算两条线段的延长线交点
 */
function calculateIntersection(line1Start: Point, line1End: Point, line2Start: Point, line2End: Point): Point | null {
  // 计算线段的方向向量
  const dx1 = line1End.x - line1Start.x
  const dy1 = line1End.y - line1Start.y
  const dx2 = line2End.x - line2Start.x
  const dy2 = line2End.y - line2Start.y

  // 计算行列式
  const denominator = dx1 * dy2 - dy1 * dx2

  // 如果行列式为0，则线段平行或重合
  if (denominator === 0) {
    return null
  }

  // 计算交点参数
  const t1 = ((line2Start.x - line1Start.x) * dy2 - (line2Start.y - line1Start.y) * dx2) / denominator

  // 计算交点坐标
  return {
    x: line1Start.x + t1 * dx1,
    y: line1Start.y + t1 * dy1,
  }
}

/**
 * 在现有代码中添加一个新的辅助函数来计算点的移动
 */
function movePointTowards(start: Point, end: Point, distance: number): Point {
  const dx = end.x - start.x
  const dy = end.y - start.y
  const length = Math.sqrt(dx * dx + dy * dy)

  if (length === 0) return start

  const ratio = (length - distance) / length
  return {
    x: start.x + dx * ratio,
    y: start.y + dy * ratio,
  }
}

/**
 * 修改 calculateControlPoints 函数
 */
function calculateControlPoints(
  line1Start: Point,
  line1End: Point,
  line2Start: Point,
  line2End: Point
): { controlPoint: Point; newLine1End: Point; newLine2Start: Point } {
  const SHORTEN_DISTANCE = 20 // 缩短线段的距离

  // 先计算原始的延长线交点
  const intersection = calculateIntersection(line1Start, line1End, line2Start, line2End)

  if (!intersection) {
    // 线段平行的情况，需要缩短线段
    const newLine1End = movePointTowards(line1Start, line1End, SHORTEN_DISTANCE)
    const newLine2Start = movePointTowards(line2End, line2Start, SHORTEN_DISTANCE)

    // 使用缩短后的线段的中点作为控制点
    const controlPoint = {
      x: (newLine1End.x + newLine2Start.x) / 2,
      y: (newLine1End.y + newLine2Start.y) / 2,
    }

    return { controlPoint, newLine1End, newLine2Start }
  }

  // 检查交点是否在线段上
  const isIntersectionOnLines = isPointOnLines(intersection, line1Start, line1End, line2Start, line2End)

  if (isIntersectionOnLines) {
    // 交点在线段上，从交点开始缩短线段
    const newLine1End = movePointTowards(
      line1Start, // 从交点开始
      intersection, // 向第一条线段起点方向缩短
      SHORTEN_DISTANCE
    )
    const newLine2Start = movePointTowards(
      intersection, // 从交点开始
      line2End, // 向第二条线段终点方向缩短
      SHORTEN_DISTANCE
    )

    console.log('交点在线段上：', {
      intersection,
      newLine1End,
      newLine2Start,
    })

    return {
      controlPoint: intersection,
      newLine1End,
      newLine2Start,
    }
  }

  // 交点在延长线上，使用原始线段和延长线交点
  return {
    controlPoint: intersection,
    newLine1End: line1End,
    newLine2Start: line2Start,
  }
}

/**
 * 判断点是否在线段上或附近
 */
function isPointOnLines(point: Point, line1Start: Point, line1End: Point, line2Start: Point, line2End: Point, tolerance = 1): boolean {
  // 检查点是否在第一条线段上
  const onLine1 = isPointOnLine(point, line1Start, line1End, tolerance)
  // 检查点是否在第二条线段上
  const onLine2 = isPointOnLine(point, line2Start, line2End, tolerance)

  return onLine1 || onLine2
}

/**
 * 判断点是否在单个线段上
 */
function isPointOnLine(point: Point, lineStart: Point, lineEnd: Point, tolerance: number): boolean {
  const d1 = Math.sqrt((point.x - lineStart.x) ** 2 + (point.y - lineStart.y) ** 2)
  const d2 = Math.sqrt((point.x - lineEnd.x) ** 2 + (point.y - lineEnd.y) ** 2)
  const lineLength = Math.sqrt((lineEnd.x - lineStart.x) ** 2 + (lineEnd.y - lineStart.y) ** 2)

  return Math.abs(d1 + d2 - lineLength) <= tolerance
}

/**
 * 获取道路角度数组
 */
function getRoadAngles(): number[] {
  if (!props.phaseData) return []
  return props.phaseData.map((phase) => phase.roadAngle)
}

/**
 * 绘制道路边缘
 */
function drawRoadEdges() {
  if (!cvs) return

  cvs.clear()
  const roadAngles = getRoadAngles()
  const vertices = initRoadData(roadAngles)
  const roadEdges = createEdgePathRTM(vertices)

  for (let i = 0; i < roadEdges.length; i += 2) {
    const line1 = roadEdges[i]
    const line2 = roadEdges[i + 1]

    // 添加调试信息
    console.log(`线段对 ${i / 2 + 1}:`, {
      line1: { start: line1[1], end: line1[0] },
      line2: { start: line2[0], end: line2[1] },
    })

    const { controlPoint, newLine1End, newLine2Start } = calculateControlPoints(line1[1], line1[0], line2[0], line2[1])

    // 添加控制点调试信息
    console.log(`控制点信息:`, {
      controlPoint,
      newLine1End,
      newLine2Start,
    })

    // 构建路径命令
    const pathData = [
      `M ${line1[1].x} ${line1[1].y}`, // 起点
      `L ${newLine1End.x} ${newLine1End.y}`, // 第一条线
      `Q ${controlPoint.x} ${controlPoint.y} ${newLine2Start.x} ${newLine2Start.y}`, // 使用二次贝塞尔曲线连接
      `L ${line2[1].x} ${line2[1].y}`, // 第二条线
    ].join(' ')

    const path = new fabric.Path(pathData, {
      fill: 'transparent',
      stroke: props.roadColor,
      strokeWidth: props.strokeWidth,
      selectable: false,
    })

    cvs.add(path)
  }

  cvs.renderAll()
}

// 监听角度变化
watch(
  () => props.phaseData,
  () => {
    drawRoadEdges()
  },
  { deep: true }
)

onMounted(() => {
  if (!canvasRef.value) return

  cvs = new fabric.Canvas(canvasRef.value, {
    width: CANVAS_SIZE,
    height: CANVAS_SIZE,
    backgroundColor: 'gainsboro',
    selection: false,
    // 禁用所有交互
    interactive: false,
    // 禁用事件
    skipTargetFind: true,
    // 设置默认鼠标样式
    defaultCursor: 'default',
    // 禁止画布移动
    allowTouchScrolling: false,
  })

  // 添加画布点击事件（仅用于调试）
  cvs.on('mouse:down', function (options) {
    const pointer = cvs.getPointer(options.e)
    console.log('点击坐标:', {
      x: Math.round(pointer.x),
      y: Math.round(pointer.y),
    })
  })

  drawRoadEdges()
})
</script>

<style scoped>
canvas {
  border: 1px solid #ccc;
  /* 禁用画布上的文本选择 */
  user-select: none;
  -webkit-user-select: none;
  /* 确保鼠标样式始终为默认 */
  cursor: default !important;
}
</style>
