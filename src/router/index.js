import { createRouter, createWebHashHistory } from 'vue-router'
import Mission from '../views/pages/Mission.vue'
import Plugin from '../views/pages/Plugin.vue'
import Layout from '../views/Home.vue'

const routes = [
    {
        path: '/',
        name: 'home',
        component: Layout,
        children: [
            {
                path: '/mission',
                name: 'Mission',
                component: Mission,
            },
            {
                path: '/plugins',
                name: 'Plugin',
                component: Plugin,
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
