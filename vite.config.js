import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
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
        createSvgIconsPlugin({
            // 指定需要缓存的图标文件夹
            iconDirs: [path.resolve(process.cwd(), 'src/assets/svg/')],
            // 指定symbolId格式
            symbolId: 'icon-svg-[name]',
        }),
    ],
    build: {
        sourcemap: false, // 打开sourceMap 定位问题
        rollupOptions: {
            output: {
                manualChunks: {
                    'icon-park': ['@icon-park/vue-next'],
                },
            },
        },
    },
    server: {
        host: true,
        proxy: {
            '/api': {
                target: 'http://localhost:8081',
                rewrite: (path) => path.replace(/^\/api/, ''),
            },
            '/ws': {
                target: 'ws://localhost:8081',
                ws: true,
            },
        },
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
