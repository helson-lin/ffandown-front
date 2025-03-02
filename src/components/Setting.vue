<template>
    <n-drawer :show="show" width="500" :on-update:show="update">
        <n-drawer-content :title="$t('setting')" closeable>
            <n-form
                ref="formRef"
                :model="model"
                :rules="rules"
                label-align="left"
                label-placement="left"
            >
                <!-- 端口配置 -->
                <n-form-item path="port" :label="$t('port')" label-width="110px">
                    <n-input-number
                        v-model:value="model.port"
                        style="width: 100%;"
                        type="number"
                        :placeholder="$t('port')"
                        disabled
                        @keydown.enter.prevent
                    >
                    </n-input-number>
                </n-form-item>
                <!-- 下载目录配置 -->
                <n-form-item 
                    path="downloadDir" 
                    :label="$t('download_dir')" 
                    label-width="110px"
                >
                    <n-input
                        v-model:value="model.downloadDir"
                        type="text"
                        :placeholder="$t('download_dir_placeholder')"
                        @keydown.enter.prevent
                    >
                        <template #suffix>
                            <n-icon :component="FolderClose" />
                        </template>
                    </n-input>
                </n-form-item>
                <!-- webhook 类型 -->
                <n-form-item path="webhookType" :label="$t('webhookType')" label-width="110px">
                    <n-select v-model:value="model.webhookType" :options="webHookOptions" />
                </n-form-item>
                <!-- webhook 地址 --> 
                <n-form-item path="webhooks" :label="$t('webhooks')" label-width="110px">
                    <n-input-group>
                        <n-input
                            v-model:value="model.webhooks"
                            type="textarea"
                            :placeholder="$t('please_enter_webhooks')"
                            @keydown.enter.prevent
                        >
                            <template #suffix><span class="test-webhook" @click="testWebhookUrl"><n-icon :component="Send"></n-icon></span></template>
                        </n-input>
                    </n-input-group>
                </n-form-item>
                <!--- 转码方式 fast -->
                <n-form-item 
                    path="preset" 
                    :label="$t('preset')" 
                    label-width="110px"
                    class="warp"
                >
                    <n-select v-model:value="model.preset" :options="persetOptions" />
                    <div class="notice">{{ $t('preset_notice') }}</div>
                </n-form-item>
                <!--- 转换格式 mp4  -->
                <n-form-item 
                    path="outputformat" 
                    :label="$t('outputformat')" 
                    label-width="110px"
                    class="warp"
                >
                    <n-select v-model:value="model.outputformat" :options="videoFormatOptions" />
                    <div class="notice">
                        {{ $t('outputformat_notice') }}
                    </div>
                </n-form-item>
                <!-- 同时下载任务数量 -->
                <n-form-item 
                    path="maxDownloadNum" 
                    :label="$t('maxDownloadNum')" 
                    label-width="110px"
                    class="warp"
                >
                    <n-input-number
                        v-model:value="model.maxDownloadNum"
                        style="width: 100%;"
                        :min="1"
                        type="number"
                        :placeholder="$t('please_enter_maxDownloadNum')"
                        @keydown.enter.prevent
                    >
                    </n-input-number>
                    <div class="notice">
                        {{ $t('maxDownloadNum_notice') }}
                    </div>
                </n-form-item>
                <n-form-item 
                    path="downloadThread" 
                    :label="$t('thread')" 
                    label-width="110px"
                    class="warp"
                >
                    <n-switch v-model:value="model.thread" />
                    <div class="notice">
                        {{ $t('thread_notice') }}
                    </div>
                </n-form-item>
                <!-- 后缀时间戳-->
                <n-form-item 
                    path="enableTimeSuffix" 
                    :label="$t('enableTimeSuffix')" 
                    label-width="110px"
                    class="warp"
                >
                    <n-switch v-model:value="model.enableTimeSuffix" />
                    <div class="notice">
                        {{ $t('enableTimeSuffix_notice') }}
                    </div>
                </n-form-item>
                <n-form-item>
                    <div class="btns">
                        <n-button attr-type="button" @click="update(false)">
                            {{ $t('cancel') }}
                        </n-button>
                        <n-button type="primary" attr-type="button" @click="confirmUpdate">
                            {{ $t('confirm') }}
                        </n-button>
                    </div>
                </n-form-item>
            </n-form>
        </n-drawer-content>
    </n-drawer>
</template>
<script>
import { getSystemConfig, updateSytemConfig, testWebhook } from '@/api/index'
import { defineComponent, reactive, toRefs, onMounted } from 'vue'
import { FolderClose, Send } from '@icon-park/vue-next'
import { useMessage } from 'naive-ui'
import i18n from '@/lang'
import { SUPPORT_VIDEO_OUTPUT, SUPPORT_PRESET, SUPPORT_NOTIFICATION } from '@/utils/constant'
import { useStore } from '../store'

export default defineComponent({
    props: {
        show: {
            type: Boolean,
            default: false,
        },
    },
    emits: ['update:show'],
    setup(props, ctx) {
        const store = useStore()
        const message = useMessage()
        const arrToOptions = (arr) => arr.map(i => ({ value: i, label: i }))
        const webHookOptions = arrToOptions(SUPPORT_NOTIFICATION)
        const videoFormatOptions = arrToOptions(SUPPORT_VIDEO_OUTPUT)
        const persetOptions = arrToOptions(SUPPORT_PRESET)
        const formInfo = reactive({
            rules: {
                port: [
                    {
                        trigger: ['blur'],
                        required: true,
                        message: i18n.global.t('port_required'),
                    },
                ],
                downloadDir: [
                    {
                        trigger: ['blur'],
                        required: true,
                        message: i18n.global.t('download_dir_required'),
                    },
                ],
            },
            model: {
                port: 8081,
                downloadDir: '/media/',
                webhookType: 'bark',
                webhooks: '',
                thread: true,
                enableTimeSuffix: false,
                maxDownloadNum: 5,
            },
        })
        const getData = async () => {
            const res = await getSystemConfig()
            if (res.code === 0) {
                formInfo.model = res.data
                store.setSystemConfig(res.data)
            }
        }
        const updateConfig = async () => {
            const res = await updateSytemConfig(formInfo.model)
            if (res.code === 0) {
                getData()
                message.success(i18n.global.t('update_setting_success'))
            } else {
                message.warning(res.message)
            }
        }
        const update = (show) => { ctx.emit('update:show', show) }
        const confirmUpdate = async () => {
            await updateConfig()
            update(false)
        }

        const testWebhookUrl = async () => {
            const { webhooks, webhookType } = formInfo.model
            const res = await testWebhook({
                webhookType,
                webhooks,
            })
            if (res.code === 0) {
                message.success(i18n.global.t('test_webhook_success'))
            } else if (res.message === '请求错误,未找到该资源' && res.status === 404) {
                message.warning(i18n.global.t('upgrade_backend'))
            } else {
                message.warning(res.message)
            }
        }
        onMounted(() => getData())
        return {
            ...toRefs(formInfo),
            FolderClose,
            Send,
            update,
            confirmUpdate,
            persetOptions,
            videoFormatOptions,
            testWebhookUrl,
            webHookOptions,
        }
    },
})
</script>
<style>
@media screen and (max-width: 768px) {
    .n-drawer {
        width: 100% !important;
    }
}
</style>
<style lang="scss" scoped>
.btns {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    width: 100%;

    .n-button {
        margin-right: 10px;
    }
}

.test-webhook {
    cursor: pointer;
}
</style>
