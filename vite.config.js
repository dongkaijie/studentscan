import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      resolvers: [ElementPlusResolver()]
    }),
  ],
  resolve:{
    alias:{
      '@': path.resolve(__dirname,'./src') // 设置 @ 指向 src 目录
    }
  },
  server: {
    host: '192.168.1.31',
    port: 3000,
    open: true,
    proxy: {
      '/api': {
      target: 'http://192.168.1.202:8090',
      changeOrigin: true,
      secure: false,
      rewrite: (path) => path.replace(/^\/api/, 'api')
    },
    }
  }
})
