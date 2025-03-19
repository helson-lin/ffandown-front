<template>
    <n-modal
        class="new-plugin"
        :show="showModel"
        preset="card"
        :closable="false"
        :title="$t('create_plugin')"
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
                v-for="item in settingsItems.items"
                :key="item.key"
                :path="item.key" 
                :label="$t(item.key)" 
                label-width="90px"  
                class="warp"
            >
                <n-input
                    v-if="item.type === 'input'"
                    v-model:value="settingsItems.model[key]"
                    type="text"
                    :placeholder="$t('please_enter_url')"
                    @keydown.enter.prevent
                >
                </n-input>
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
import { defineComponent } from 'vue'
// import i18n from '@/lang'
import { useMessage } from 'naive-ui'

export default defineComponent({
    props: {
        show: {
            type: Boolean,
            default: false,
        },
        settings: {
            type: String,
            default: '',
        },
    },
    emits: ['update:show', 'confirm', 'refresh'],
    setup(props, ctx) {
        const message = useMessage()
        const settingsItems = computed(() => {
            try {
                const settings = JSON.parse(props.settings)
                const allSettinsItem = Object.entries(settings).map(([key, val]) => ({ ...val, key }))
                // const model = Object.keys(settings).reduce(() => { return pre; }, {})
                return {
                    items: allSettinsItem,
                    rules: {},
                    model: {},
                }
            } catch {
                return {
                    items: [],
                    rules: {},
                    model: {},
                }
            }
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
        const confirmModal = () => {}
        return {
            showModel,
            closeModal,
            confirmModal,
            message,
            settingsItems,
        }
    },
})
</script>