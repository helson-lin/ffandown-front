<template>
    <div class="quick">
        <div class="left-tool">
            <add
                theme="filled"
                size="24"
                fill="#333"
                @click="showNewMission = !showNewMission"
            />
        </div>
        <div class="quick-actions">
            <div v-for="(action, index) in actions" :key="index" class="quick-action">
                <n-tooltip
                    :show-arrow="false"
                    placement="top"
                    trigger="hover"
                    :delay="1000"
                >
                    <template #trigger>
                        <n-button
                            class="m10"
                            ghost
                            size="tiny"
                            @click="action.onClick"
                        >
                            <n-icon :component="action.icon"></n-icon>
                        </n-button>
                    </template>
                    <span>{{ action.name }}</span>
                </n-tooltip>
            </div>
        </div>
        <NewMission :show="showNewMission" @update:show="showNewMission = $event" @refresh="refresh" />  
    </div>
</template>
<script>
import { Redo, Clear, Add } from '@icon-park/vue-next'
import NewMission from './NewMission.vue'
import i18n from '@/lang'

export default defineComponent({
    name: 'Blank',
    components: { NewMission, Add },
    emits: ['refresh', 'clear'],
    setup(_, ctx) {
        const activeStatusKey = ref(null)
        const showNewMission = ref(false)
        const actions = [
            {
                name: i18n.global.t('refresh'),
                key: 'redo',
                icon: Redo,
                onClick: () => {
                    ctx.emit('refresh')
                },
            },
            {
                name: i18n.global.t('clear'),
                key: 'clear',
                icon: Clear,
                onClick: () => {
                    ctx.emit('clear')
                },
            },
        ]
        const refresh = () => ctx.emit('refresh')
        return {
            showNewMission,
            actions,
            activeStatusKey,
            Add,
            refresh,
        }
    },
})
</script>
<style lang="scss" scoped>
.quick {
    position: relative;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    padding: 10px 10px 20px;

    &::after {
        position: absolute;
        right: 0;
        bottom: 10px;
        display: block;
        width: 100%;
        height: 0;
        content: "";
        border-bottom: 1px solid #b6b2b271;
    }

    .quick-actions {
        display: flex;
        justify-content: flex-end;
    }
    .m10 { margin-right: 10px; }
}
</style>
