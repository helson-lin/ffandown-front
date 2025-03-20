<template>
    <div class="login">
        <div class="header">
            <div class="login-title">
                <img class="logo" src="../assets/imgs/logo.webp" alt="logo">
                {{ $t('login_title') }}
            </div>
        </div>
        <div class="login-box">
            <div class="title">
                <h3>Login</h3>
                <p>Hi, Welcome back👋</p>
            </div>
            <n-form 
                ref="formRef" 
                :model="model" 
                :rules="rules" 
                :show-label="true"
                label-placement="top"
                label-width="auto"
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
                        @input="handlePasswordInput"
                        @keydown.enter.prevent
                    />
                </n-form-item>

                <div class="remember">
                    <n-checkbox v-model:checked="remmberPassword" size="medium" :label="$t('remmber_password')" />
                    <div class="forget">{{ $t('forget_password') }}</div>
                </div>
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
                message: '请输入用户名',
                trigger: 'blur',
            },
            password: {
                required: true,
                message: '请输入密码',
                trigger: 'blur',
            },
        })
        const router = useRouter()
        const route = useRoute()
        const message = useMessage()
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
        onMounted(() => {
            const xUsername = localStorage.getItem('x-username')
            const xPassword = localStorage.getItem('x-password')
            const remmberPasswordCached = localStorage.getItem('x-remmber') 
            if (xUsername) model.value.username = xUsername
            if (xPassword) model.value.password = Base64.decode(xPassword)
            if (remmberPasswordCached === '1') remmberPassword.value = true
        })
        return {
            model,
            rules,
            login,
            remmberPassword,
        }
    },
})

</script>
<style lang="scss" scoped>
.login {
    position: relative;
    width: 100vw;
    height: 100vh;

    // background: url("../assets/imgs/background.webp") no-repeat center center;
    background-color: #fff;
    background-size: cover;

    .header {
        box-sizing: border-box;
        width: 100%;
        padding: 15px 30px;
        border-bottom: 1px solid #eee;
    }

    .login-title {
        // padding: 10px 0;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        width: 100%;
        font-size: 22px;
        font-weight: bolder;

        .logo {
            width: 40px;
            height: 40px;
            margin-right: 10px;
        }
    }

    &-box {
        position: absolute;
        top: 45%;
        left: 50%;
        z-index: 22;
        box-sizing: border-box;
        width: 420px;
        padding: 20px;

        // box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
        // background-color: rgba(0, 0, 0, .04);
        border-radius: 12px;
        transform: translate(-50%, -50%);
        backdrop-filter: blur(6px);

        .title {
            display: flex;
            flex-direction: column;
            margin-bottom: 30px;

            h3 {
                padding: 10px 0;
                font-size: 25px;
            }

            p {
                margin-top: 10px;
                font-size: 14px;
            }
        }

        .remember {
            box-sizing: border-box;
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
            padding: 0 0 20px;

            .forget {
                font-size: 14px;
            }
        }

        .footer {
            box-sizing: border-box;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px 0;
            color: #e3e3e3;
        }
    }
}
</style>
