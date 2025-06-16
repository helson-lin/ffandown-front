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
                        class="icon-park-icon"
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
                            <n-icon :component="action.icon" class="icon-park-icon"></n-icon>
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
    align-items: center;
    justify-content: space-between;
    padding: 10px 10px 20px;
    background: #fff;
    transition: all .3s ease;
    animation: fade-in .3s ease-out;

    &::after {
        position: absolute;
        right: 20px;
        bottom: 0;
        left: 20px;
        display: block;
        height: 0;
        content: "";
        border-bottom: 1px solid rgb(0 0 0 / 6%);
        transition: all .3s ease;
    }

    .operation {
        :deep(.n-button) {
            height: 36px;
            padding: 0 16px;
            font-size: 14px;
            border-radius: 6px;
            transition: all .2s ease;

            .n-button__icon {
                margin-right: 8px;
                font-size: 16px;
            }

            &:hover {
                box-shadow: 0 2px 8px rgb(0 0 0 / 8%);
                transform: translateY(-1px);
            }
        }
    }

    .quick-actions {
        display: flex;
        gap: 8px;
        align-items: center;

        .quick-action {
            :deep(.n-button) {
                width: 32px;
                height: 32px;
                padding: 0;
                border-radius: 6px;
                transition: all .2s ease;

                .n-icon {
                    font-size: 16px;
                    color: rgb(0 0 0 / 65%);
                }

                &:hover {
                    background: rgb(0 0 0 / 4%);
                    transform: translateY(-1px);

                    .n-icon {
                        color: $primary-color;
                    }
                }
            }
        }
    }
}

// 移动端适配
@media screen and (max-width: 768px) {
    .quick {
        padding: 12px 16px;

        &::after {
            right: 16px;
            left: 16px;
        }

        .operation {
            :deep(.n-button) {
                height: 32px;
                padding: 0 12px;
                font-size: 13px;

                .n-button__icon {
                    margin-right: 6px;
                    font-size: 15px;
                }
            }
        }

        .quick-actions {
            gap: 6px;

            .quick-action {
                :deep(.n-button) {
                    width: 28px;
                    height: 28px;

                    .n-icon {
                        font-size: 15px;
                    }
                }
            }
        }
    }
}

// 平板适配
@media screen and (min-width: 769px) and (max-width: 1024px) {
    .quick {
        padding: 14px 20px;

        &::after {
            right: 20px;
            left: 20px;
        }
    }
}

// 暗色模式支持
@media (prefers-color-scheme: dark) {
    .quick {
        background: rgb(255 255 255 / 2%);

        &::after {
            border-bottom-color: rgb(255 255 255 / 8%);
        }

        .operation {
            :deep(.n-button) {
                color: rgb(255 255 255 / 85%);
                background: rgb(255 255 255 / 4%);
                border-color: rgb(255 255 255 / 12%);

                .n-button__icon {
                    color: rgb(255 255 255 / 65%);
                }

                &:hover {
                    background: rgb(255 255 255 / 8%);
                    box-shadow: 0 2px 8px rgb(0 0 0 / 20%);
                }
            }
        }

        .quick-actions {
            .quick-action {
                :deep(.n-button) {
                    background: rgb(255 255 255 / 4%);
                    border-color: rgb(255 255 255 / 12%);

                    .n-icon {
                        color: rgb(255 255 255 / 65%);
                    }

                    &:hover {
                        background: rgb(255 255 255 / 8%);

                        .n-icon {
                            color: $primary-color;
                        }
                    }
                }
            }
        }
    }

    // 工具提示暗色模式样式
    :deep(.n-tooltip) {
        .n-tooltip__content {
            color: rgb(255 255 255 / 85%);
            background: rgb(30 30 30 / 95%);
            border: 1px solid rgb(255 255 255 / 8%);
            box-shadow: 0 4px 12px rgb(0 0 0 / 30%);
            backdrop-filter: blur(10px);
        }
    }
}

// 动画效果
@keyframes fade-in {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
