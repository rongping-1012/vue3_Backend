import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import path from 'path';
import { viteMockServe } from 'vite-plugin-mock'

export default defineConfig(({ command }) => {
  return {
    plugins: [
      vue(),
      createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
        symbolId: 'icon-[dir]-[name]',
      }),
      viteMockServe({
        enable: command === 'serve',
      }),
    ],
      resolve: {
      alias: {
        // 使用绝对路径（__dirname 指向当前配置文件所在目录）
        '@': path.resolve(__dirname, 'src'),
          // 可选：添加其他常用路径别名
          '@assets': path.resolve(__dirname, 'src/assets'),
            '@components': path.resolve(__dirname, 'src/components'),
              '@views': path.resolve(__dirname, 'src/views'),
    },
    },

    // 添加 TypeScript 选项（可选，根据需要调整）
    esbuild: {
      jsxFactory: 'h',
        jsxFragment: 'Fragment',
          jsxInject: `import { h } from 'vue'`,
  },
    css: {
      preprocessorOptions: {
        scss: {
          // 支持全局 SCSS 变量
          additionalData: `@use "@/styles/variable.scss" as *;`,
      },
      },
    },
  }
});