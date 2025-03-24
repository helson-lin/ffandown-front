<template>
    <n-modal
        class="reset-password"
        :show="showModal"
        preset="card"
        :closable="false"
        :title="$t('plugin_settings')"
        :style="'width: 550px'"
        @on-close="closeModal"
    >
        <n-form
            ref="formRef"
            :model="model"
            :rules="rules"
            label-align="left"
            label-placement="left"
        >
            <n-form-item 
                path="currentPassword" 
                :label="$t('currentPassword')"   
                label-width="100px"  
                class="warp"
            >
                <n-input
                    v-model:value="model.currentPassword"
                    size="large"
                    type="currentPassword"
                    :placeholder="$t('currentPassword_placeholder')"
                    show-password-on="mousedown"
                    @keydown.enter.prevent
                />
            </n-form-item>
            <n-form-item path="password" :label="$t('password')" label-width="100px"> 
                <n-input
                    v-model:value="model.password"
                    size="large"
                    type="password"
                    :placeholder="$t('password_placeholder')"
                    show-password-on="mousedown"
                    @keydown.enter.prevent
                />
            </n-form-item>
        </n-form>
        <template #footer>
            <div class="flex jce footer-color">
                <n-button class="mr2" @click="closeModal">{{ $t('cancel') }}</n-button>
                <n-button type="primary" @click="confirmModal">{{ $t('confirm') }}</n-button>
            </div>
        </template>
    </n-modal>
</template>
<script>
import { defineComponent, ref, toRefs } from 'vue'
import i18n from '@/lang'
import { useMessage } from 'naive-ui'
import { resetUserPassword } from '../api'
// import { updatePluginOptions } from '@/api/index.js'

export default defineComponent({
    props: {
        show: {
            type: Boolean,
            default: false,
        },
    },
    emits: ['update:show', 'confirm', 'refresh'],
    setup(props, ctx) {
        const formRef = ref(null)
        const message = useMessage()
        const showModal = computed({
            get() {
                return props.show
            },
            set(val) {
                ctx.emit('update:show', val)
            },
        })
        const formInfo = reactive({
            rules: {
                currentPassword: {
                    required: true,
                    message: i18n.global.t('currentPassword_placeholder'),
                    trigger: 'blur',
                },
                password: {
                    required: true,
                    message: i18n.global.t('password_placeholder'),
                    trigger: 'blur',
                },
            },
            model: {
                password: '',
                currentPassword: '',
            },
        })
        const closeModal = () => {
            showModal.value = false
        }
        // 重置密码
        const resetPassword = async () => {
            const username = localStorage.getItem('x-username')
            const res = await resetUserPassword({ ...formInfo.model, username })
            if (res.code === 0) {
                message.success(i18n.global.t('reset_password_success'))
                closeModal()
            } else {
                message.error(res.message)
            }
        }

        const confirmModal = () => {
            formRef.value?.validate(async (errors) => {
                if (!errors) {
                    resetPassword()
                }
            })
        }
        return {
            showModal,
            closeModal,
            confirmModal,
            message,
            ...toRefs(formInfo),
            formRef,
        }
    },
})
</script>