<template>
    <div class="quick">
        <div class="operation">
            <n-button 
                icon-placement="left" 
                @click="showNewMission = !showNewMission"
            >
                <template #icon>
                    <add
                        size="18"
                        fill="#333"
                    />
                </template>
                {{ $t('add_mission') }}
            </n-button>
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
        <NewMission
            :show="showNewMission"
            :dir-options="dirOptions"
            @update:show="showNewMission = $event"
            @refresh="refresh"
        />  
    </div>
</template>
<script>
import { Redo, Clear, Add } from '@icon-park/vue-next'
import NewMission from './NewMission.vue'
import { getDir } from '../api'
import i18n from '@/lang'
import { onMounted } from 'vue'

export default defineComponent({
    name: 'Blank',
    components: { NewMission, Add },
    emits: ['refresh', 'clear'],
    setup(_, ctx) {
        const activeStatusKey = ref(null)
        const showNewMission = ref(false)
        const dirOptions = ref([])
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
        const getDirOption = async () => {
            const res = await getDir()
            if (res.code === 0) {
                const list = res.data.map((item) => ({
                    label: item.label.replace('/media', '配置目录'),
                    value: item.value.replace('/media', '/'),
                }))
                dirOptions.value = list
            }
        }
        const refresh = () => ctx.emit('refresh')
        onMounted(() => {
            getDirOption()
        })
        return {
            showNewMission,
            actions,
            activeStatusKey,
            dirOptions,
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
    background: #fff;

    &::after {
        position: absolute;
        right: 10px;
        bottom: 10px;
        left: 10px;
        display: block;

        // width: 100%;
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
