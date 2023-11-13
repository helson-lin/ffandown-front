import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import eslintPlugin from 'vite-plugin-eslint'
import path from 'path'

export default defineConfig({
    plugins: [
        eslintPlugin(),
        vue(),
        AutoImport({
            imports: ['vue'],
            dts: false,
            eslintrc: {
                enabled: true,
            },
        }),
    ],
    build: {
        sourcemap: true, // 打开sourceMap 定位问题
    },
    server: {
        host: true,
    },
    resolve: {
        alias: {
            '#': path.resolve(__dirname, './public/'),
            '@': path.resolve(__dirname, './src/'),
        },
    },
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: '@import "@/style/index.scss";',
            },
        },
    },
    base: './',
})
