import { createRouter, createWebHashHistory } from 'vue-router'

// 使用路由懒加载，提高首屏加载速度
const routes = [
    {
        path: '/',
        name: 'home',
        component: () => import('../views/Home.vue'),
        children: [
            {
                path: '/mission',
                name: 'Mission',
                component: () => import('../views/pages/Mission.vue'),
            },
            {
                path: '/plugins',
                name: 'Plugin',
                component: () => import('../views/pages/Plugin.vue'),
            },
            {
                path: '/',
                redirect: '/mission',
            },
        ],
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/Login.vue'),
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: '/',
    },

]

// 添加设备识别和自动跳转
const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

router.beforeEach((to, from, next) => {
    if (to.path === '/login') {
        const userInfo = localStorage.getItem('x-userinfo')
        if (userInfo) next('/')
        else next()
    } else {
        next()
    }
})

export default router
