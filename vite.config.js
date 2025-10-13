import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import eslintPlugin from 'vite-plugin-eslint'
import { visualizer } from 'rollup-plugin-visualizer'
import path from 'path'

// 创建 IconPark 自定义解析器
function IconParkResolver() {
    return {
        type: 'component',
        resolve: (name) => {
            // 匹配 icon-park 图标组件
            // 例如：PlayOne, AddOne, SettingConfig 等
            const icons = [
                'Add', 'AddOne', 'ArrowLeft', 'ArrowRight', 'Box', 'Clear', 'Close',
                'DeleteOne', 'DownOne', 'FolderClose', 'Forbid', 'Key', 'LinkTwo',
                'Logout', 'Pause', 'PauseOne', 'PlayOne', 'PlugOne', 'Redo',
                'Refresh', 'Send', 'SettingConfig', 'ShuffleOne', 'UserPositioning'
            ]
            
            if (icons.includes(name)) {
                return {
                    name,
                    from: '@icon-park/vue-next'
                }
            }
        }
    }
}

export default defineConfig({
    plugins: [
        eslintPlugin(),
        vue(),
        AutoImport({
            imports: [
                'vue',
                {
                    'naive-ui': [
                        'useDialog',
                        'useMessage',
                        'useNotification',
                        'useLoadingBar',
                        'useThemeVars',
                    ],
                },
            ],
            dts: false,
            eslintrc: {
                enabled: true,
            },
        }),
        // Naive UI 和 IconPark 自动按需引入
        Components({
            resolvers: [
                NaiveUiResolver(),
                IconParkResolver(),
            ],
            dts: false,
        }),
        createSvgIconsPlugin({
            // 指定需要缓存的图标文件夹
            iconDirs: [path.resolve(process.cwd(), 'src/assets/svg/')],
            // 指定symbolId格式
            symbolId: 'icon-svg-[name]',
        }),
        // 打包体积分析工具
        visualizer({
            open: false, // 构建完成后自动打开浏览器
            gzipSize: true, // 显示 gzip 后的大小
            brotliSize: true, // 显示 brotli 压缩后的大小
            filename: 'dist/stats.html', // 输出文件路径
        }),
    ],
    build: {
        sourcemap: false, // 打开sourceMap 定位问题
        rollupOptions: {
            output: {
                manualChunks(id) {
                    // Naive UI 单独打包
                    if (id.includes('node_modules/naive-ui')) {
                        return 'naive-ui'
                    }
                    // Vue 全家桶
                    if (id.includes('node_modules/vue') || 
                        id.includes('node_modules/vue-router') || 
                        id.includes('node_modules/pinia')) {
                        return 'vue-vendor'
                    }
                    // IconPark 图标 - 让 Vite 自动处理，实现更好的 tree-shaking
                    // 不强制打包到一起，而是让每个图标独立，未使用的会被自动移除
                    if (id.includes('node_modules/@icon-park')) {
                        // 提取图标名，实现更细粒度的按需加载
                        const match = id.match(/@icon-park\/vue-next\/es\/icons\/(.+)\.js/)
                        if (match) {
                            return 'icon-park'  // 已使用的图标会被打包到这里
                        }
                    }
                    // 其他第三方库
                    if (id.includes('node_modules')) {
                        return 'vendor'
                    }
                },
            },
        },
        chunkSizeWarningLimit: 1000,
        minify: 'terser',
        terserOptions: {
            compress: {
                drop_console: true,
                drop_debugger: true,
                // 移除未使用的代码
                unused: true,
                // 移除无法访问的代码
                dead_code: true,
            },
            mangle: {
                // 压缩变量名
                toplevel: true,
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
