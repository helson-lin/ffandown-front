<template>
    <n-modal
        class="new-plugin"
        :show="showModal"
        preset="card"
        :closable="false"
        :title="$t('plugin_settings')"
        :style="'width: 550px'"
        @on-close="closeModal"
    >
        <n-form
            ref="formRef"
            :model="settingsItems.model"
            :rules="settingsItems.rules"
            label-align="left"
            label-placement="left"
        >
            <n-form-item 
                v-for="item in settingsItems.items"
                :key="item.key"
                :path="item.key" 
                :label="item?.label ?? $t(item.key)" 
                label-width="90px"  
                class="warp"
            >
                <n-input
                    v-if="item.type === 'input'"
                    v-model:value="settingsItems.model[item.key]"
                    type="text"
                    :placeholder="`please input ${item.key}`"
                >
                </n-input>
                <n-select
                    v-if="item.type === 'select'"
                    v-model:value="settingsItems.model[item.key]"
                    :options="item.options"
                    :placeholder="item?.placeholder ?? `please select ${item.key}`"
                ></n-select>
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
import { defineComponent, ref } from 'vue'
import i18n from '@/lang'
import { useMessage } from 'naive-ui'
import { updatePluginOptions } from '@/api/index.js'

export default defineComponent({
    props: {
        show: {
            type: Boolean,
            default: false,
        },
        uid: {
            type: String,
            required: true,
        },
        settings: {
            type: String,
            default: '',
        },
        options: {
            type: String,
            default: '',
        },
        
    },
    emits: ['update:show', 'confirm', 'refresh'],
    setup(props, ctx) {
        const formRef = ref(null)
        const message = useMessage()
        const settingsItems = ref({
            items: [],
            rules: {},
            model: {},
        })
        const getSettingsItem = () => {
            try {
                const settings = JSON.parse(props.settings || '{}')
                const options = JSON.parse(props.options || '{}')
                const allSettinsItem = Object.entries(settings).map(([key, val]) => ({ ...val, key }))
                const model = allSettinsItem.reduce((pre, item) => { 
                    pre[item.key] = options[item.key] || item?.default || ''
                    return pre 
                }, {})
                const rules = allSettinsItem.reduce((pre, item) => {
                    pre[item.key] = [{ required: item.require || item.required || false, message: `please input ${item.key}`, trigger: ['blur'] }]
                    return pre
                }, {})
                return {
                    items: allSettinsItem,
                    rules,
                    model,
                }
            } catch (e) {
                console.error(e)
                return {
                    items: [],
                    rules: {},
                    model: {
                        cookie: '',
                    },
                }
            }
        }
        const showModal = computed({
            get() {
                settingsItems.value = getSettingsItem()
                return props.show
            },
            set(val) {
                ctx.emit('update:show', val)
            },
        })
        const closeModal = () => {
            showModal.value = false
        }
        const updatePlugin = async (data) => {
            const res = await updatePluginOptions(data)
            if (res.code === 0) {
                message.success(i18n.global.t('plugin_option_updated'))
                closeModal()
                ctx.emit('refresh')
            }
        }
        const confirmModal = () => {
            formRef.value?.validate(async (errors) => {
                if (!errors) {
                    await updatePlugin({
                        uid: props.uid,
                        options: JSON.stringify(settingsItems.value.model),
                    })
                }
            })
        }
        return {
            showModal,
            closeModal,
            confirmModal,
            message,
            settingsItems,
            formRef,
        }
    },
})
</script>