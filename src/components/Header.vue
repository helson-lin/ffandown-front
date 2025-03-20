<template>
    <div class="headers">
        <!-- logo 文本 -->
        <div class="logo">
            <span class="logo-txt">ffandown</span>
        </div>
        <div class="headers-right">
            <div class="user-info">
                <n-dropdown :options="options" @select="handleSelect">
                    <n-avatar 
                        round 
                        :style="{
                            color: '#f2f2f2',
                            backgroundColor: '#333',
                        }"
                    >  
                        {{ username }}
                    </n-avatar>
                </n-dropdown>
            </div>
        </div>
    </div>
</template>
<script>
import { userLogout } from '@/api/index'
import { useMessage } from 'naive-ui'
import { Key, Logout } from '@icon-park/vue-next'
import { useRouter } from 'vue-router'
import { h } from 'vue'

export default {
    setup() {
        const router = useRouter()
        const message = useMessage()
        const username = localStorage.getItem('x-username')
        const options = [
            {
                label: '重置密码',
                key: 'resetPassword',
                icon: () => h(Key, { theme: 'outline', fill: '#000000', strokeLinecap: 'square' }),
            },
            {
                label: '退出登录',
                key: 'logout',
                icon: () => h(Logout, { theme: 'outline', fill: '#000000', strokeLinecap: 'square' }),
            },
        ]
        // 退出登录
        
        const logout = async () => {
            const res = await userLogout()
            if (res.code !== 0) {
                message.error(res.msg)
            } else {
                localStorage.removeItem('x-userinfo')
                router.push({ path: '/login' })
            }
        }

        const resetPassword = () => {
            console.log('resetPassword')
        }

        const handleSelect = (key) => {
            switch (key) {
                case 'logout':
                    logout()
                    break
                case 'resetPassword':
                    resetPassword()
                    break
                default:
                    break
            }
        }
        return {
            handleSelect,
            logout,
            options,
            username,
        }
    },
}
</script>
<style lang="scss" scoped>
.headers {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 60px;
    padding: $pd;
    background: #fff;
    border-bottom: 1px solid #ddd;
    box-shadow: rgb(50 50 93 / 25%) 0 6px 12px -2px, rgb(0 0 0 / 30%) 0 3px 7px -3px;

    .logo-txt {
        font-family: monospace, sans-serif;
        font-size: 18px;
        font-weight: 600;
        text-transform: uppercase;
    }

    &-right {
        display: flex;
        align-items: center;
    }
}
</style>
