<template>
    <n-modal
        class="new-mission"
        :show="showModel"
        preset="card"
        :closable="false"
        :title="$t('create_mission')"
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
                path="url" 
                :label="$t('url')" 
                label-width="90px"  
                class="warp"
            >
                <n-input
                    v-model:value="model.url"
                    type="textarea"
                    :placeholder="$t('please_enter_url')"
                    @keydown.enter.prevent
                >
                </n-input>
                <div class="notice">
                    {{ $t('url_notice') }}
                </div>
            </n-form-item>
        </n-form>
    </n-modal>
</template>
<script>
import { reactive, toRefs } from 'vue'
import i18n from '@/i18n'

export default {
    emits: ['update:show', 'confirm', 'refresh'],
    setup(props, ctx) {
        const formInfo = reactive({
            rules: {
                url: [
                    {
                        trigger: ['blur'],
                        required: true,
                        message: i18n.global.t('please_enter_url'),
                    },
                ],
                name: [
                    {
                        trigger: ['blur'],
                        required: false,
                        message: i18n.global.t('please_enter_filename'),
                    },
                ],
                dir: [
                    {
                        trigger: ['blur'],
                        required: false,
                    },
                ],
                outputformat: [
                    {
                        trigger: ['blur', 'change'],
                        required: true,
                        message: i18n.global.t('please_select_outputformat'),
                    },
                ],
                preset: [
                    {
                        trigger: ['blur', 'change'],
                        required: true,
                        message: i18n.global.t('please_select_perset'),
                    },
                ],
                useragent: [
                    {
                        tigger: ['blur', 'change'],
                        required: false,
                        message: i18n.global.t('please_enter_useragent'),
                    },
                ],
                headers: [
                    {
                        trigger: ['blur', 'change'],
                        type: 'array',
                        required: false,
                    },
                ],
            },
            model: {
                url: '',
                preset: '',
                outputformat: '',
                dir: '',
                useragent: '',
                // 自定义请求头
                headers: [],
            },
        })
        const showModel = computed({
            get() {
                return props.show
            },
            set(val) {
                ctx.emit('update:show', val)
            },
        })
        const closeModal = () => {
            showModel.value = false
        }
        return {
            showModel,
            closeModal,
            ...toRefs(formInfo),
        }
    },
}
</script>
