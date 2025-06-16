<template>
    <div class="login" :class="{ 'dark': isDark }">
        <div class="header">
            <div class="login-title">
                <img class="logo" src="../assets/imgs/logo.webp" alt="logo">
                {{ $t('login_title') }}
            </div>
        </div>
        <div class="login-box">
            <div class="title">
                <h3>{{ $t('login_title') }}</h3>
                <p>{{ $t('welcome_back') }}👋</p>
            </div>
            <n-form 
                ref="formRef" 
                :model="model" 
                :rules="rules" 
                :show-label="true"
                label-placement="top"
                label-width="auto"
                class="login-form"
            >
                <n-form-item path="username" :label="$t('username')">
                    <n-input
                        v-model:value="model.username"
                        :placeholder="$t('username_placeholder')"
                        size="large"
                        @keydown.enter.prevent
                    />
                </n-form-item>
                <n-form-item path="password" :label="$t('password')">
                    <n-input
                        v-model:value="model.password"
                        size="large"
                        type="password"
                        :placeholder="$t('password_placeholder')"
                        show-password-on="mousedown"
                        @keydown.enter.prevent
                    />
                </n-form-item>

                <div class="remember">
                    <n-checkbox v-model:checked="remmberPassword" size="medium" :label="$t('remember_password')" />
                    <n-popover trigger="hover" class="forget">
                        <template #trigger>
                            <n-button text @click="goToDocs">{{ $t('forget_password') }}</n-button>
                        </template>
                        <span>{{ $t('forget_password_notice') }}</span>
                    </n-popover>
                </div>
                <div v-if="showNotice" class="notice">{{ $t('first_login') }}</div>
                <div style="display: flex; justify-content: center;">
                    <n-button 
                        type="primary"
                        size="large" 
                        style="width: 100%;"
                        @click="login"
                    >
                        {{ $t('login_btn') }}
                    </n-button>
                </div>
            </n-form>
            <div class="footer">
                ffandown@2022-2025
            </div>
        </div>
    </div>
</template>
<script>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useMessage } from 'naive-ui'
import { useStore } from '../store'
import { Base64 } from 'js-base64'
import i18n from '../lang/index'

export default defineComponent({
    setup() {
        const model = ref({
            username: '',
            password: '',
            reenteredPassword: '',
        })
        const remmberPassword = ref(false)
        const rules = ref({
            username: {
                required: true,
                message: i18n.global.t('username_placeholder'),
                trigger: 'blur',
            },
            password: {
                required: true,
                message: i18n.global.t('password_placeholder'),
                trigger: 'blur',
            },
        })
        const router = useRouter()
        const route = useRoute()
        const message = useMessage()
        // 是否展示提示信息
        const showNotice = ref(false)
        const isDark = ref(false)
        
        /**
         * @description login
         */
        const login = async () => {
            const store = useStore()
            const res = await store.login(model.value)
            if (res === '0') {
                if (remmberPassword.value) {
                    localStorage.setItem('x-username', model.value.username)
                    localStorage.setItem('x-password', Base64.encode(model.value.password))
                    localStorage.setItem('x-remmber', '1')
                } else {
                    localStorage.removeItem('x-username')
                    localStorage.removeItem('x-password')
                    localStorage.setItem('x-remmber', '0')
                }
                const redirect = route.query?.redirect
                router.push({ path: redirect || '/mission' })
            } else {
                message.warning(res)
            }
        }

        const goToDocs = () => {
            window.open('https://ffandown.oimi.space', '_blank')
        }

        // 检测系统主题
        const checkDarkMode = () => {
            isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
        }
        
        onMounted(() => {
            checkDarkMode()
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', checkDarkMode)
            const xUsername = localStorage.getItem('x-username')
            const xPassword = localStorage.getItem('x-password')
            const remmberPasswordCached = localStorage.getItem('x-remmber') 
            if (xUsername) model.value.username = xUsername
            if (xPassword) model.value.password = Base64.decode(xPassword)
            if (!xUsername && !xPassword && remmberPasswordCached !== '1') showNotice.value = true
            if (remmberPasswordCached === '1') remmberPassword.value = true
        })
        return {
            model,
            rules,
            login,
            remmberPassword,
            showNotice,
            goToDocs,
            isDark,
        }
    },
})

</script>
<style lang="scss" scoped>
.login {
    position: relative;
    width: 100vw;
    height: 100vh;
    background-color: var(--bg-color);
    transition: all .3s ease;

    &.dark {
        --bg-color: #18181c;
        --text-color: #fff;
        --border-color: #333;
        --box-bg: #24242a;
        --box-bg-rgb: 36, 36, 42;
        --input-bg: #2d2d33;
        --hover-color: #3d3d44;
    }

    &:not(.dark) {
        --bg-color: #fff;
        --text-color: #333;
        --border-color: #e5e5e5;
        --box-bg: #fff;
        --box-bg-rgb: 255, 255, 255;
        --input-bg: #f5f5f5;
        --hover-color: #f0f0f0;
    }

    .header {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 100;
        box-sizing: border-box;
        width: 100%;
        padding: 12px 24px;
        background-color: var(--box-bg);
        background-color: rgb(var(--box-bg-rgb) .8);
        border-bottom: 1px solid var(--border-color);
        transition: all .3s ease;
        backdrop-filter: blur(10px);
    }

    .login-title {
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        width: 100%;
        height: 32px;
        font-size: 20px;
        font-weight: 600;
        color: var(--text-color);
        transition: all .3s ease;

        .logo {
            width: 32px;
            height: 32px;
            margin-right: 10px;
            border-radius: 6px;
            transition: transform .3s ease;

            &:hover {
                transform: scale(1.05);
            }
        }
    }

    &-box {
        position: absolute;
        top: 50%;
        left: 50%;
        z-index: 22;
        box-sizing: border-box;
        width: 440px;
        padding: 40px;
        margin-top: 20px;
        background-color: var(--box-bg);
        border-radius: 16px;
        box-shadow: 0 8px 24px rgb(0 0 0 / 12%);
        transition: all .3s ease;
        transform: translate(-50%, -50%);

        .title {
            display: flex;
            flex-direction: column;
            margin-bottom: 36px;
            color: var(--text-color);

            h3 {
                padding: 0;
                margin: 0;
                font-size: 28px;
                font-weight: 600;
                transition: all .3s ease;
            }

            p {
                margin-top: 12px;
                font-size: 16px;
                color: var(--text-color);
                opacity: .8;
                transition: all .3s ease;
            }
        }

        .login-form {
            :deep(.n-form-item-label) {
                font-weight: 500;
                color: var(--text-color);
            }

            :deep(.n-input) {
                background-color: var(--input-bg);
                border-color: var(--border-color);
                transition: all .3s ease;

                &:hover,
                &:focus {
                    border-color: var(--primary-color);
                }
            }
        }

        .remember {
            box-sizing: border-box;
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
            padding: 0 0 24px;
            color: var(--text-color);

            .forget {
                font-size: 14px;
                transition: all .3s ease;

                &:hover {
                    opacity: .8;
                }
            }
        }

        .notice {
            padding: 12px;
            margin-bottom: 16px;
            font-size: 14px;
            color: var(--text-color);
            text-align: center;
            background-color: var(--input-bg);
            border-radius: 8px;
            transition: all .3s ease;
        }

        .footer {
            box-sizing: border-box;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 24px 0 0;
            font-size: 14px;
            color: var(--text-color);
            opacity: .6;
            transition: all .3s ease;
        }
    }
}

// 添加响应式支持
@media screen and (max-width: 768px) {
    .login {
        &-box {
            width: 90%;
            max-width: 440px;
            padding: 30px;
        }
    }
}
</style>
