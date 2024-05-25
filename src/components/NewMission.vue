<template>
    <n-modal
        class="new-mission"
        :show="show"
        preset="card"
        :title="$t('mission')"
        style="width: 500px;"
        :close-on-esc="true"
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
            <n-form-item path="url" :label="$t('url')" label-width="90px">
                <n-input
                    v-model:value="model.url"
                    type="textarea"
                    :placeholder="$t('please_enter_url')"
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
                <div v-if="false" class="notice"></div>
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
            <n-form-item path="dir" :label="$t('dir')" label-width="90px">
                <n-auto-complete v-model:value="model.dir" :options="dirList" :cascade="true" />
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
import { createMission, getSystemConfig } from '../api'
import i18n from '@/lang'
import axiosAPI from '../axios'

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
                dir: '',
            },
        })
        const arrToOptions = (arr) => arr.map(i => ({ value: i, label: i }))
        const videoFormatOptions = arrToOptions(['mp4', 'mov', 'flv', 'avi'])
        const persetOptions = arrToOptions(['ultrafast', 'superfast', 'veryfast', 'faster', 'fast', 'medium', 'slow', 'slower', 'veryslow'])
        const dirList = ref([])
        const getDirList = async () => {
            const res = await axiosAPI.get('/dir')
            if (res.code === 0) {
                dirList.value = res.data
            }
        }
        const getConfigOption = async () => {
            const res = await getSystemConfig()
            if (res.code === 0) {
                const data = res.data
                if (data?.preset) formInfo.model.preset = data.preset
                if (data?.outputformat) formInfo.model.outputformat = data.outputformat
            }
        }
        const createDownloadMission = async () => {
            const postData = { ...formInfo.model }
            postData.dir = postData.dir.replaceAll('/media', '')
            const res = await createMission(postData)
            if (res.code === 0) {
                message.success(i18n.global.t('mission_created'))
                formInfo.model = {
                    url: '',
                    downloadDir: '/Download',
                    preset: 'medium',
                    outputformat: 'mp4',
                    useragent: '',
                    dir: '',
                }
            }
        }

        const checkUrlisLegal = (url) => {
            if (!url) return Promise.resolve(false)
            const urlArray = url.split('\n')
            const isUrl = (url) => {
                try {
                    new URL(url)
                    return true
                } catch {
                    return false
                }
            }
            return Promise.resolve(urlArray.every(i => isUrl(i)))
        }
        const confirmModal = async () => {
            // 校验表单
            formRef.value?.validate(async (errors) => {
                if (!errors) {
                    // 进一步校验地址是否符合规范
                    checkUrlisLegal(formInfo.model.url).then(async (validated) => {
                        if (validated) {
                            await createDownloadMission()
                            ctx.emit('update:show', false)
                        } else {
                            message.warning(i18n.global.t('input_url_illegal'))
                        }
                    })
                } else {
                    // 提示信息
                    message.warning(i18n.global.t('mission_validate_failed'))
                }
            })
        }
        const closeModal = () => {
            ctx.emit('update:show', false)
        }
        onMounted(() => {
            getDirList()
            getConfigOption()
        })
        return {
            videoFormatOptions,
            formRef,
            FolderClose,
            UserPositioning,
            persetOptions,
            ...toRefs(formInfo),
            confirmModal,
            dirList,
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
