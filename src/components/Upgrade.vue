<template>
    <div v-if="show" class="upgrade">
        <div class="content">
            <n-spin size="large" />
            <div class="loading">{{ $t('upgrading') }}...</div>
        </div>
    </div>
</template>
<script>
import { defineComponent } from 'vue'
import { useMessage } from 'naive-ui'
import { upgradeVersion } from '@/api/index'
import i18n from '@/lang'

export default defineComponent({
    props: {
        show: {
            type: Boolean,
            default: false,
        },
    },
    emits: ['close'],
    setup(prop, ctx) {
        const message = useMessage()
        const upgrade = async () => {
            const res = await upgradeVersion()
            if (res.code === 0) {
                message.success(i18n.global.t('upgrade_success'))
                ctx.emit('close')
            }
        }
        watchEffect(() => {
            if (prop.show) {
                upgrade()
            }
        })
        return {
            upgrade,
        }
    },
})
</script>
<style lang="scss" scoped>
.upgrade {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background: rgba($color: #000, $alpha: 30%);

    .content {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        .loading {
            margin-top: 20px;
            font-weight: bolder;
            color: #fff;
        }
    }
}
</style>
