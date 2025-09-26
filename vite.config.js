import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  base: './', // 使用相对路径，确保静态资源正确加载
  plugins: [
    vue({
       // 添加 Vue 模板编码配置
      template: {
        compilerOptions: {
          // 确保模板编码
          whitespace: 'preserve'
        }
      }
    }),
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
  build: {
    outDir: 'dist', // 输出目录
    assetsDir: 'assets', // 静态资源目录
    sourcemap: false, // 关闭 sourcemap 减小体积
    charset: 'utf8',
    // minify: 'terser', // 压缩代码
    // 确保字符编码
    rollupOptions: {
      output: {
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
        // 确保 JS 文件编码
        // chunkFileNames: 'assets/js/[name]-[hash].js'
      }
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
