<template>
    <div class="headers">
        <!-- logo 文本 -->
        <div class="logo">
            <span class="logo-txt">FFMPEG Anime Downloader</span>
        </div>
        <div class="headers-right">
            <div class="user-info">
                <n-dropdown :options="options" @select="handleSelect">
                    <n-avatar 
                        round 
                        :src="logo"
                        :style="{
                            background: '#fff'
                        }"
                    >  
                        <!-- {{ username }} -->
                    </n-avatar>
                </n-dropdown>
            </div>
        </div>
        <ResetPassword v-model:show="showResetPassword" />
    </div>
</template>
<script>
import { userLogout } from '@/api/index'
import { useMessage } from 'naive-ui'
import { Key, Logout } from '@icon-park/vue-next'
import { useRouter } from 'vue-router'
import i18n from '../lang/index'
import { h } from 'vue'
import logo from '../assets/imgs/logo.webp'
import ResetPassword from './ResetPassword.vue'

export default {
    components: {
        ResetPassword,
    },
    setup() {
        const router = useRouter()
        const message = useMessage()
        const username = localStorage.getItem('x-username')
        const showResetPassword = ref(false)
        const options = [
            {
                label: i18n.global.t('reset_password'),
                key: 'resetPassword',
                icon: () => h(Key, { 
                    theme: 'outline', 
                    strokeLinecap: 'square',
                    class: 'icon-park-icon',
                }),
            },
            {
                label: i18n.global.t('logout'),
                key: 'logout',
                icon: () => h(Logout, { 
                    theme: 'outline', 
                    strokeLinecap: 'square',
                    class: 'icon-park-icon',
                }),
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
            // resetUserPassword
            showResetPassword.value = true
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
            showResetPassword,
            logo,
            options,
            username,
        }
    },
}
</script>
<style lang="scss" scoped>
.headers {
    position: relative;
    z-index: 100;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 64px;
    padding: 0 24px;
    background: #fff;
    border-bottom: 1px solid rgb(0 0 0 / 6%);
    box-shadow: 0 1px 2px rgb(0 0 0 / 3%);

    .logo {
        display: flex;
        gap: 10px;
        align-items: center;
        cursor: pointer;

        &:hover {
            opacity: .8;
        }

        .logo-txt {
            font-family: "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            font-size: 18px;
            font-weight: 600;
            color: rgb(0 0 0 / 85%);
            text-transform: none;
            letter-spacing: -.3px;
            background: linear-gradient(45deg, #b78aff, #8a63ff);
            -webkit-background-clip: text;
            background-clip: text;
            transition: all .2s ease;
            -webkit-text-fill-color: transparent;
        }
    }

    &-right {
        display: flex;
        gap: 12px;
        align-items: center;

        .user-info {
            :deep(.n-avatar) {
                cursor: pointer;
                border: 2px solid transparent;

                &:hover {
                    border-color: rgb(0 0 0 / 10%);
                }
            }
        }
    }
}

// 移动端适配
@media screen and (max-width: 768px) {
    .headers {
        height: 52px;
        padding: 0 14px;

        .logo {
            .logo-txt {
                font-size: 16px;
            }
        }

        &-right {
            gap: 10px;
        }
    }
}

// 暗色模式支持
@media (prefers-color-scheme: dark) {
    .headers {
        background: rgb(255 255 255 / 2%);
        border-bottom-color: rgb(255 255 255 / 6%);
        box-shadow: 0 1px 2px rgb(0 0 0 / 20%);
        backdrop-filter: blur(10px);

        .logo {
            .logo-txt {
                background: linear-gradient(45deg, #b78aff, #8a63ff);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }
        }

        &-right {
            .user-info {
                :deep(.n-avatar) {
                    box-shadow: 0 2px 4px rgb(0 0 0 / 20%);

                    &:hover {
                        border-color: rgb(255 255 255 / 12%);
                        box-shadow: 0 4px 8px rgb(0 0 0 / 30%);
                    }
                }
            }
        }
    }

    // 下拉菜单暗色模式样式
    :deep(.n-dropdown-menu) {
        background: rgb(30 30 30 / 95%);
        border: 1px solid rgb(255 255 255 / 6%);
        box-shadow: 0 4px 12px rgb(0 0 0 / 30%);
        backdrop-filter: blur(10px);

        .n-dropdown-option {
            color: rgb(255 255 255 / 85%);

            &:hover {
                background: rgb(255 255 255 / 4%);
            }

            .n-dropdown-option-icon {
                color: rgb(255 255 255 / 65%);
            }
        }
    }
}

// 动画效果
@keyframes fade-in {
    from {
        opacity: 0;
        transform: translateY(-8px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

</style>
