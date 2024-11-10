import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
/**使用箭头函数形参获取当前模式 */
export default ({ mode }: { mode: string }) => {
  console.log(mode)
  //在Node环境下使用loadEnv读取.env.development中的环境变量
  console.log(loadEnv(mode, process.cwd()))

  return defineConfig({
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    plugins: [vue()],
    build: {
      sourcemap: false,
      chunkSizeWarningLimit: 2000,
      cssCodeSplit: true,
      //esbuild打包速度快,terser打包体积小
      minify: 'terser',
      assetsInlineLimit: 4000,
    },
  })
}
