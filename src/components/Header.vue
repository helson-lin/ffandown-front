<template>
    <div class="headers">
        <!-- logo 文本 -->
        <div class="logo">
            <span class="logo-txt">ffandown</span>
        </div>
        <!-- 退出登录-->
        <div class="logout" @click="logout">
            <Icon name="logout" :size="15" />
        </div>
    </div>
</template>
<script>
import { userLogout } from '@/api/index'
import { useMessage } from 'naive-ui'
import { useRouter } from 'vue-router'

export default {
    setup() {
        const router = useRouter()
        const message = useMessage()
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
        return {
            logout,
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

    .logout {
        padding: $pd / 3;
        cursor: pointer;
        border-radius: 10px;

        &:hover {
            background-color: $primary-color;

            :deep(svg) {
                fill: white;
            }
        }
    }
}
</style>
