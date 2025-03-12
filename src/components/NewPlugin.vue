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
                path="url" 
                :label="$t('url')" 
                label-width="90px"  
                class="warp"
            >
                <n-input
                    v-model:value="model.url"
                    type="textarea"
                    :placeholder="$t('placeholder_plugin_url')"
                    @keydown.enter.prevent
                >
                </n-input>
                <div class="notice">
                    {{ $t('plugin_notice') }}
                </div>
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
import { reactive, toRefs, defineComponent } from 'vue'
import i18n from '@/lang'

export default defineComponent({
    props: {
        show: {
            type: Boolean,
            default: false,
        },
    },
    emits: ['update:show', 'confirm', 'refresh'],
    setup(props, ctx) {
        const formInfo = reactive({
            rules: {
                url: [
                    {
                        trigger: ['blur'],
                        required: true,
                        message: i18n.global.t('placeholder_plugin_url'),
                    },
                ],
            },
            model: {  
                url: '',
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
        const confirmModal = () => {
            showModel.value = false
        }
        return {
            showModel,
            closeModal,
            confirmModal,
            ...toRefs(formInfo),
        }
    },
})
</script>
<style lang="scss" scoped>
.new-plugin {
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
