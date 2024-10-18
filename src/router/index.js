import { createRouter, createWebHashHistory } from 'vue-router'
import { isMobile } from '../utils/index' // 导入设备识别工具

const routes = [
    {
        path: '/',
        name: 'home',
        component: () => import('../views/Home.vue'),
    },
    {
        path: '/mobile',
        name: 'mobileHome',
        component: () => import('../views/MobileHome.vue'),
    },
]

// 添加设备识别和自动跳转
const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

router.beforeEach((to, from, next) => {
    if (isMobile() && to.name !== 'mobileHome') {
        next({ name: 'mobileHome' }) // 如果是手机端，跳转到手机端路由
    } else {
        next() // 否则继续
    }
})

export default router
