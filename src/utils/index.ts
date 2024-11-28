import chroma from 'chroma-js'
export const getStorage = (key: string) => {
  return localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)!) : {}
}

export const setStorage = (key: string, value: unknown) => {
  localStorage.setItem(key, JSON.stringify(value))
}

//generator random color
export const randomColor = (opacity: number = 0.8): string => {
  const r = Math.floor(Math.random() * 256)
  const g = Math.floor(Math.random() * 256)
  const b = Math.floor(Math.random() * 256)

  // 将 RGB 转换为 HEX，并确保每个颜色值都是两位数
  const rHex = r.toString(16).padStart(2, '0')
  const gHex = g.toString(16).padStart(2, '0')
  const bHex = b.toString(16).padStart(2, '0')

  // 将透明度转换为两位 HEX（0-255）
  const aHex = Math.round(opacity * 255)
    .toString(16)
    .padStart(2, '0')

  return `#${rHex}${gHex}${bHex}${aHex}`
}

//Color Palette Generator
export const colorPalette = (count: number = 10): string[] => {
  // 预定义的柔和彩虹色板
  const pastelRainbow = [
    '#ffadad', // 柔和的红色
    '#ffd6a5', // 柔和的橙色
    '#fdffb6', // 柔和的黄色
    '#caffbf', // 柔和的绿色
    '#9bf6ff', // 柔和的青色
    '#a0c4ff', // 柔和的蓝色
    '#bdb2ff', // 柔和的靛色
    '#ffc6ff', // 柔和的紫色
    '#77dd77', // 柔和的绿色
    '#43b0f1', // 柔和的蓝色
    '#2ecc71', // 柔和的绿色
    '#69ebfc', // 柔和的青色
    '#a898f3', // 柔和的紫色
  ]

  // 如果请求的数量小于等于预定义色板的长度，直接返回前 count 个颜色
  if (count <= pastelRainbow.length) {
    return pastelRainbow.slice(0, count)
  }

  // 如果需要更多颜色，则在原有色板的基础上通过插值生成新的颜色
  const result = [...pastelRainbow]
  const remaining = count - pastelRainbow.length

  for (let i = 0; i < remaining; i++) {
    // 在现有颜色中随机选择两个颜色进行混合
    const color1 = pastelRainbow[Math.floor(Math.random() * pastelRainbow.length)]
    const color2 = pastelRainbow[Math.floor(Math.random() * pastelRainbow.length)]

    // 简单的颜色混合：取两个颜色的平均值
    const newColor =
      '#' +
      Array.from({ length: 3 }, (_, i) => {
        const start = parseInt(color1.substr(1 + i * 2, 2), 16)
        const end = parseInt(color2.substr(1 + i * 2, 2), 16)
        const mixed = Math.floor((start + end) / 2)
        return mixed.toString(16).padStart(2, '0')
      }).join('')

    result.push(newColor)
  }

  return result
}

//使用chroma-js生成颜色
export const chromaRandomColor = (count: number = 10): string[] => {
  // 使用更鲜艳的基础色板
  const baseColors = [
    '#FF6B6B', // 红色
    '#FF9F43', // 橙色
    '#FECA57', // 黄色
    '#32FF7E', // 绿色
    '#18DCFF', // 青色
    '#4834DF', // 蓝色
    '#9B59B6', // 紫色
    '#FF78C4', // 粉红色
    '#2ECC71', // 翠绿
    '#3498DB', // 天蓝
  ]

  if (count <= baseColors.length) {
    return baseColors.slice(0, count)
  }

  // 使用 chroma.js 的色彩空间插值生成更多颜色
  return chroma
    .scale(baseColors)
    .mode('lch') // 使用 LCH 色彩空间
    .padding(0.1) // 添加一些padding避免颜色过于接近
    .colors(count)
    .map((color) =>
      chroma(color)
        .saturate(1.2) // 增加饱和度
        .hex()
    )
}
