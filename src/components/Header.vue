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
    transition: all .3s ease;
    animation: fade-in .3s ease-out;

    .logo {
        display: flex;
        gap: 12px;
        align-items: center;
        cursor: pointer;
        transition: all .2s ease;

        &:hover {
            opacity: .8;
        }

        .logo-txt {
            font-family: "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            font-size: 20px;
            font-weight: 600;
            color: rgb(0 0 0 / 85%);
            text-transform: none;
            letter-spacing: -.5px;
            transition: all .2s ease;
        }
    }

    &-right {
        display: flex;
        gap: 16px;
        align-items: center;

        .user-info {
            :deep(.n-avatar) {
                cursor: pointer;
                border: 2px solid transparent;
                transition: all .2s ease;

                &:hover {
                    border-color: rgb(0 0 0 / 10%);
                    transform: scale(1.05);
                }
            }
        }
    }
}

// 移动端适配
@media screen and (max-width: 768px) {
    .headers {
        height: 56px;
        padding: 0 16px;

        .logo {
            .logo-txt {
                font-size: 18px;
            }
        }

        &-right {
            gap: 12px;
        }
    }
}

// 平板适配
@media screen and (min-width: 769px) and (max-width: 1024px) {
    .headers {
        height: 60px;
        padding: 0 20px;
    }
}

// 暗色模式支持
@media (prefers-color-scheme: dark) {
    .headers {
        background: rgb(255 255 255 / 3%);
        border-bottom-color: rgb(255 255 255 / 8%);
        box-shadow: 0 1px 2px rgb(0 0 0 / 20%);

        .logo {
            .logo-txt {
                color: rgb(255 255 255 / 90%);
            }
        }

        &-right {
            .user-info {
                :deep(.n-avatar) {
                    &:hover {
                        border-color: rgb(255 255 255 / 10%);
                    }
                }
            }
        }
    }

    // 下拉菜单暗色模式样式
    :deep(.n-dropdown-menu) {
        background: rgb(30 30 30 / 95%);
        border: 1px solid rgb(255 255 255 / 8%);
        box-shadow: 0 4px 12px rgb(0 0 0 / 30%);
        backdrop-filter: blur(10px);

        .n-dropdown-option {
            color: rgb(255 255 255 / 85%);

            &:hover {
                background: rgb(255 255 255 / 6%);
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
        transform: translateY(-10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

</style>
