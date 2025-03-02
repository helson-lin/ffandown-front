// stores/counter.js
import { defineStore } from 'pinia'
import { userLogin } from '@/api/index'
import { isMobile } from '../utils'

export const useStore = defineStore('main', {
    state: () => ({ 
        authed: true,
        status: '0,1,5',
        // 是否为手机端
        isMobile: isMobile(),
        systemConfig: {
            preset: 'medium',
            outputformat: 'mp4',
        },
    }),
    actions: {
        async login(data) {
            const res = await userLogin(data)
            if (res.code === 0) {
                localStorage.setItem('x-userinfo', JSON.stringify(res.user))
                this.authed = true
                return '0'
            } 
            return res.message
        },
        logout() {
            this.authed = false
            localStorage.removeItem('x-userinfo')
        },
        setStatus(status) {
            this.status = status
        },
        setSystemConfig(options) {
            if (options?.preset) this.systemConfig.preset = options.preset
            if (options?.outputformat) this.systemConfig.outputformat = options.outputformat
        },
    },
})
