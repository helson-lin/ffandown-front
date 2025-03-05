<template>
    <n-modal
        class="new-mission"
        :show="showModel"
        preset="card"
        :closable="false"
        :title="$t('create_mission')"
        :style="bodyStyle"
        @on-close="closeModal"
    >
        <!-- 2: form -->
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
            <!--- 文件名称  -->
            <n-form-item
                path="name"
                :label="$t('mission_filename')"
                label-width="90px"
                class="warp"
            >
                <n-input
                    v-model:value="model.name"
                    type="text"
                    :placeholder="$t('filename_placeholder')"
                    @keydown.enter.prevent
                >
                </n-input>
                <div class="notice">
                    {{ $t('filename_notice') }}
                </div>
            </n-form-item>
            <n-form-item path="dir" :label="$t('downloadDir')" label-width="90px">
                <n-input
                    v-model:value="model.dir"
                    type="text"
                    :placeholder="$t('download_child_dir_placeholder')"
                    @keydown.enter.prevent
                >
                </n-input>
            </n-form-item>
            <!--- 转码方式 fast -->
            <n-form-item 
                path="preset" 
                :label="$t('preset')" 
                label-width="90px"
                class="warp"
            >
                <n-select v-model:value="model.preset" :options="persetOptions" />
                <div class="notice">{{ $t('preset_notice') }}</div>
            </n-form-item>
            <!--- 转换格式 mp4  -->
            <n-form-item 
                path="outputformat" 
                :label="$t('outputformat')" 
                label-width="90px"
                class="warp"
            >
                <n-select v-model:value="model.outputformat" :options="videoFormatOptions" />
                <div class="notice">
                    {{ $t('outputformat_notice') }}
                </div>
            </n-form-item>
            <!--- 用户代理  -->
            <n-form-item 
                path="useragent" 
                :label="$t('useragent')" 
                label-width="90px"
                class="warp"
            >
                <n-input
                    v-model:value="model.useragent"
                    type="text"
                    :placeholder="$t('useragent_placeholder')"
                    @keydown.enter.prevent
                >
                </n-input>
                <div class="notice">
                    {{ $t('useragent_notice') }}
                </div>
            </n-form-item>
            <!-- 自定义请求头 -->
            <n-form-item 
                path="headers" 
                :label="$t('custom_headers')" 
                label-width="90px"
                class="warp"
            >
                <Kv v-model:value="model.headers" />
                <div class="notice">
                    {{ $t('headers_notice') }}
                </div>
            </n-form-item>
        </n-form>
        <!-- file upload -->
        <template #footer>
            <div class="flex jce footer-color">
                <n-button class="mr2" @click="closeModal">{{ $t('cancel') }}</n-button>
                <n-button type="primary" @click="confirmModal">{{ $t('confirm') }}</n-button>
            </div>
        </template>
    </n-modal>
</template>
<script>
import { FolderClose, UserPositioning } from '@icon-park/vue-next'
import { defineComponent, reactive } from 'vue'
import { useMessage } from 'naive-ui'
import { createMission } from '../api'
import i18n from '@/lang'
import { SUPPORT_VIDEO_OUTPUT, SUPPORT_PRESET } from '@/utils/constant'
import { useStore } from '../store'
import Kv from './Kv.vue'

export default defineComponent({
    components: { Kv },
    props: {
        show: {
            type: Boolean,
            default: false,
        },
        dirOptions: {
            type: Array,
            default: () => ([]),
        },
    },
    emits: ['update:show', 'confirm', 'refresh'],
    setup(props, ctx) {
        const showModel = computed({
            get() {
                return props.show
            },
            set(val) {
                ctx.emit('update:show', val)
            },
        })
        const store = useStore()
        const formRef = ref(null)
        const message = useMessage()
        const systemConfig = computed(() => store.systemConfig)
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
        watchEffect(() => {
            if (systemConfig) {
                const { preset, outputformat } = systemConfig.value
                formInfo.model.preset = preset
                formInfo.model.outputformat = outputformat
            }
        })
        const arrToOptions = (arr) => arr.map(i => ({ value: i, label: i }))
        const videoFormatOptions = arrToOptions(SUPPORT_VIDEO_OUTPUT)
        const persetOptions = arrToOptions(SUPPORT_PRESET)

        const bodyStyle = {
            width: '550px',
        }

        const createDownloadMission = async () => {
            const res = await createMission(formInfo.model)
            if (res.code === 0) {
                message.success(i18n.global.t('create_success'))
                formInfo.model = {
                    url: '',
                    dir: '',
                    preset: systemConfig.value.preset || '',
                    outputformat: systemConfig.value.outputformat || '',
                    useragent: '',
                    headers: [],
                }
                ctx.emit('refresh')
                ctx.emit('update:show', false)
            }
        }
        const confirmModal = async () => {
            formRef.value?.validate(async (errors) => {
                if (!errors) {
                    await createDownloadMission()
                }
            })
            // await createDownloadMission()
            // ctx.emit('update:show', false)
        }
        const closeModal = () => {
            ctx.emit('update:show', false)
        }
        return {
            videoFormatOptions,
            bodyStyle,
            formRef,
            FolderClose,
            UserPositioning,
            persetOptions,
            ...toRefs(formInfo),
            confirmModal,
            closeModal,
            showModel,
        }
    },
})
</script>
<style lang="scss" scoped>
.new-mission {
    .warp {
        :deep(.n-form-item-blank) {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
        }
    }
}

.notice {
    font-size: 12px;
    line-height: 26px;
    color: #c2c2c2;
}

</style>
