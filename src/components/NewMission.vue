<template>
    <n-modal
        class="new-mission"
        :show="show"
        preset="card"
        :title="$t('mission')"
        :style="bodyStyle"
        :close-on-esc="true"
    >
        <!-- 2: form -->
        <n-form
            ref="formRef"
            :model="model"
            :rules="rules"
            label-align="left"
            label-placement="left"
        >
            <n-form-item path="url" :label="$t('url')" label-width="90px">
                <n-input
                    v-model:value="model.url"
                    type="textarea"
                    :placeholder="$t('please_enter_url')"
                    @keydown.enter.prevent
                >
                </n-input>
            </n-form-item>
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
                <div v-if="false" class="notice">
                    如果为m3u地址，那么自动采用m3u内的文件名称
                </div>
            </n-form-item>
            <n-form-item path="preset" :label="$t('preset')" label-width="90px">
                <n-select v-model:value="model.preset" :options="persetOptions" />
            </n-form-item>
            <n-form-item path="outputformat" :label="$t('outputformat')" label-width="90px">
                <n-select v-model:value="model.outputformat" :options="videoFormatOptions" />
            </n-form-item>
            <n-form-item path="useragent" :label="$t('useragent')" label-width="90px">
                <n-input
                    v-model:value="model.useragent"
                    type="text"
                    :placeholder="$t('useragent_placeholder')"
                    @keydown.enter.prevent
                >
                    <template #prefix>
                        <n-icon :component="UserPositioning" />
                    </template>
                </n-input>
            </n-form-item>
            <!--- 转码方式 fast -->
            <!--- 转换格式 mp4  -->
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

export default defineComponent({
    props: {
        show: {
            type: Boolean,
            default: false,
        },
    },
    emits: ['update:show', 'confirm'],
    setup(_, ctx) {
        const formRef = ref(null)
        const message = useMessage()
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
            },
            model: {
                url: '',
                preset: 'medium',
                outputformat: 'mp4',
                useragent: '',
            },
        })
        const arrToOptions = (arr) => arr.map(i => ({ value: i, label: i }))
        const videoFormatOptions = arrToOptions(['mp4', 'mov', 'flv', 'avi'])
        const persetOptions = arrToOptions(['ultrafast', 'superfast', 'veryfast', 'faster', 'fast', 'medium', 'slow', 'slower', 'veryslow'])

        const bodyStyle = {
            width: '550px',
        }
        const createDownloadMission = async () => {
            const res = await createMission(formInfo.model)
            if (res.code === 0) {
                message.success('创建任务成功')
                formInfo.model = {
                    url: '',
                    downloadDir: '/Download',
                    preset: 'medium',
                    outputformat: 'mp4',
                    useragent: '',
                }
            }
        }
        const confirmModal = async () => {
            await createDownloadMission()
            ctx.emit('update:show', false)
        }
        const closeModal = () => {
            console.warn('closeModal')
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
        }
    },
})
</script>
<style lang="scss" scoped>
.new-mission {
    .warp {
        :deep .n-form-item-blank {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
        }
    }
}

.notice {
    // position: absolute;
    // left: 0px;
    // top: 100%;
    font-size: 12px;
    line-height: 26px;
    color: #333333be;
}
</style>
