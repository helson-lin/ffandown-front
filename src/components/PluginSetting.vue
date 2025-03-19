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
        {{ settings }}
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
        }
    },
})
</script>