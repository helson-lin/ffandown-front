<template>
    <n-modal
        class="new-mission"
        :show="show"
        preset="card"
        title="任务"
        :style="bodyStyle"
        :close-on-esc="true"
        @negative-click="closeModal"
    >
        <!-- 2: form -->
        <n-form
            ref="formRef"
            :model="model"
            :rules="rules"
            label-align="left"
            label-placement="left"
        >
            <n-form-item path="url" label="链接" label-width="90px">
                <n-input
                    v-model:value="model.url"
                    type="textarea"
                    placeholder="请输入链接"
                    @keydown.enter.prevent
                >
                </n-input>
            </n-form-item>
            <n-form-item path="name" label="文件名称" label-width="90px">
                <n-input
                    v-model:value="model.name"
                    type="text"
                    placeholder="文件名称（不填默认随机）"
                    @keydown.enter.prevent
                >
                </n-input>
            </n-form-item>
            <n-form-item path="preset" label="视频质量" label-width="90px">
                <n-select v-model:value="model.preset" :options="persetOptions" />
            </n-form-item>
            <n-form-item path="videoFormat" label="视频格式" label-width="90px">
                <n-select v-model:value="model.videoFormat" :options="videoFormatOptions" />
            </n-form-item>
            <n-form-item path="downloadDir" label="目录" label-width="90px">
                <n-input
                    v-model:value="model.downloadDir"
                    type="text"
                    placeholder="下载目录位置"
                    disabled="true"
                    @keydown.enter.prevent
                >
                    <template #prefix>
                        <n-icon :component="FolderClose" />
                    </template>
                </n-input>
            </n-form-item>
            <!--- 转码方式 fast -->
            <!--- 转换格式 mp4  -->
        </n-form>
        <template #footer>
            <div class="flex jce footer-color">
                <n-button class="mr2" @click="closeModal">取消</n-button>
                <n-button type="primary" @click="confirmModal">确定</n-button>
            </div>
        </template>
    </n-modal>
</template>
<script>
import { FolderClose } from '@icon-park/vue-next'
import { defineComponent, reactive, getCurrentInstance } from 'vue'

export default defineComponent({
    props: {
        show: {
            type: Boolean,
            default: false,
        },
    },
    emits: ['show', 'confirm'],
    setup(_, ctx) {
        const formInfo = reactive({
            rules: {
                url: [
                    {
                        trigger: ['blur'],
                        required: true,
                        message: '请输入网址',
                    },
                ],
                name: [
                    {
                        trigger: ['blur'],
                        required: true,
                        message: '请输入文件名称',
                    },
                ],
                downloadDir: [
                    {
                        trigger: ['blur'],
                        required: true,
                        message: '请输入目录',
                    },
                ],
                videoFormat: [
                    {
                        trigger: ['blur', 'change'],
                        required: true,
                        message: '请选择输出格式',
                    },
                ],
                preset: [
                    {
                        trigger: ['blur', 'change'],
                        required: true,
                        message: '请选择视频质量',
                    },
                ],
            },
            model: {
                url: 'https://pic.kblue.site/vsco.png',
                downloadDir: '/Download',
                preset: 'medium',
                videoFormat: 'mp4',
            },
        })
        const arrToOptions = (arr) => arr.map(i => ({ value: i, label: i }))
        const videoFormatOptions = arrToOptions(['mp4', 'mov', 'flv', 'mpeg'])
        const persetOptions = arrToOptions(['ultrafast', 'superfast', 'veryfast', 'faster', 'fast', 'medium', 'slow', 'slower', 'veryslow'])

        const bodyStyle = {
            width: '550px',
        }
        const confirmModal = () => {
            ctx.emit('confirm', formInfo.model)
            ctx.emit('update:show', false)
        }
        const closeModal = () => {
            ctx.emit('update:show', false)
        }
        return {
            videoFormatOptions,
            bodyStyle,
            FolderClose,
            persetOptions,
            ...toRefs(formInfo),
            confirmModal,
            closeModal,
        }
    },
})
</script>
