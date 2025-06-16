<template>
    <div class="plugin-list">
        <n-checkbox-group v-model:value="checkList">
            <div v-for="plugin in data" :key="plugin.uid" class="plugin">
                <div class="plugin-left">
                    <n-checkbox :value="plugin.uid" size="large"></n-checkbox>
                    <div class="plugin-left-logo">
                        <img :src="plugin.icon || DefaultPluginLogo" alt="icon">
                    </div>
                    <div class="plugin-left-baseinfo">
                        <div class="plugin-name">{{ plugin.name }}</div>
                        <div class="plugin-desc">{{ plugin.description }}</div>
                    </div>
                </div>
                <div class="plugin-right">
                    <div class="author leading">
                        <a :href="plugin.homepage" target="_blank">@{{ plugin.author }}</a>
                    </div>
                    <div class="version leading">{{ plugin.version }}</div>
                    <div class="crt leading">{{ transformTm(plugin.upd_tm) }}</div> 
                    <n-switch 
                        v-model:value="plugin.status" 
                        checked-value="1" 
                        unchecked-value="0" 
                        @update:value="(status) => updateStatus(plugin?.uid, status)" 
                    />
                    <!-- 插件设置 -->
                    <div class="setting">
                        <span class="setting-btn" @click="openSetting(plugin)">...</span>
                    </div>
                </div>
            </div>
        </n-checkbox-group>
        <PluginSetting 
            v-model:show="pluginSettingShow" 
            :uid="pluginUid" 
            :settings="pluginSettings" 
            :options="pluginOptions"
            @refresh="refresh"
            @update:show="pluginSettingShow = $event" 
        />
    </div>
</template>
<script>
import { computed, defineComponent } from 'vue'
import DefaultPluginLogo from '@/assets/imgs/plugin_default.png'
// import { SettingConfig } from '@icon-park/vue-next'
import PluginSetting from './PluginSetting.vue'

export default defineComponent({
    components: { PluginSetting },
    props: {
        data: {
            type: Array,
            default: () => ([]),
        },
        modelValue: {
            type: Array,
            default: () => ([]),
        },
    },
    emits: ['update:modelValue', 'updateStatus', 'refresh'],
    setup(props, ctx) {
        const pluginSettingShow = ref(false)
        const pluginUid = ref('')
        const pluginSettings = ref('')
        const pluginOptions = ref('')
        const checkList = computed({
            get() {
                return props.modelValue
            },
            set(value) {
                ctx.emit('update:modelValue', value)
            },
        })
        const transformTm = (tmStr) => new Date(tmStr).toLocaleString()
        // 更新插件使用状态
        const updateStatus = (uid, status) => {
            ctx.emit('updateStatus', { uid, status })
        }
        // 打开插件设置
        const openSetting = (plugin) => {
            if (!plugin.settings) return
            pluginSettings.value = plugin.settings || '{}'
            pluginUid.value = plugin.uid
            pluginOptions.value = plugin.options || '{}'
            pluginSettingShow.value = true
        }
        const refresh = () => ctx.emit('refresh')
        return {
            DefaultPluginLogo,
            checkList,
            openSetting,
            pluginSettingShow,
            pluginSettings,
            pluginOptions,
            pluginUid,
            updateStatus,
            transformTm,
            refresh,
        }
    },
})
</script>
<style lang="scss" scoped>
.plugin-list {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: #fff;
    border-radius: 8px;
    transition: all .3s ease;

    .plugin {
        position: relative;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 20px 24px;
        border-bottom: 1px solid rgb(0 0 0 / 6%);
        transition: all .2s ease;
        animation: fade-in .3s ease-out;
        animation-fill-mode: both;

        @for $i from 1 through 10 {
            &:nth-child(#{$i}) {
                animation-delay: #{($i - 1) * .05}s;
            }
        }

        &:hover {
            background: rgb(0 0 0 / 2%);
            box-shadow: 0 2px 8px rgb(0 0 0 / 4%);
            transform: translateY(-1px);
        }

        &:last-child {
            border-bottom: none;
        }

        &-left {
            display: flex;
            flex: 1;
            align-items: center;
            min-width: 0;

            :deep(.n-checkbox) {
                margin-right: 16px;

                .n-checkbox__input {
                    border-radius: 4px;
                    transition: all .2s ease;
                }
            }

            &-logo {
                box-sizing: border-box;
                flex-shrink: 0;
                width: 48px;
                height: 48px;
                margin-right: 16px;
                overflow: hidden;
                background: rgb(0 0 0 / 4%);
                border-radius: 12px;
                transition: all .2s ease;

                &:hover {
                    transform: scale(1.05);
                }

                img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    border-radius: 12px;
                }
            }

            &-baseinfo {
                flex: 1;
                min-width: 0;

                .plugin-name {
                    margin-bottom: 4px;
                    overflow: hidden;
                    font-size: 16px;
                    font-weight: 600;
                    line-height: 1.4;
                    color: rgb(0 0 0 / 85%);
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                .plugin-desc {
                    overflow: hidden;
                    font-size: 13px;
                    line-height: 1.5;
                    color: rgb(0 0 0 / 45%);
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            }
        }

        &-right {
            display: flex;
            flex-shrink: 0;
            gap: 16px;
            align-items: center;

            .author {
                min-width: 80px;

                a {
                    padding: 4px 8px;
                    font-size: 13px;
                    color: rgb(0 0 0 / 45%);
                    text-decoration: none;
                    border-radius: 4px;
                    transition: all .2s ease;

                    &:hover {
                        color: #b78aff;
                        background: rgb(183 138 255 / 5%);
                    }
                }
            }

            .version {
                min-width: 60px;
                padding: 2px 6px;
                font-family: "SF Mono", Monaco, "Cascadia Code", monospace;
                font-size: 13px;
                color: rgb(0 0 0 / 45%);
                background: rgb(0 0 0 / 4%);
                border-radius: 4px;
            }

            .crt {
                min-width: 100px;
                font-size: 12px;
                color: rgb(0 0 0 / 35%);
            }

            :deep(.n-switch) {
                .n-switch__rail {
                    transition: all .2s ease;
                }
            }

            .setting {
                display: flex;
                align-items: center;
                justify-content: center;

                &-btn {
                    box-sizing: border-box;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 32px;
                    height: 32px;
                    font-size: 16px;
                    font-weight: 600;
                    color: rgb(0 0 0 / 45%);
                    cursor: pointer;
                    border-radius: 6px;
                    transition: all .2s ease;

                    &:hover {
                        color: rgb(0 0 0 / 65%);
                        background: rgb(0 0 0 / 6%);
                        transform: scale(1.1);
                    }

                    &:active {
                        transform: scale(.95);
                    }
                }
            }
        }
    }
}

// 移动端适配
@media screen and (max-width: 768px) {
    .plugin-list {
        .plugin {
            flex-direction: column;
            gap: 12px;
            align-items: flex-start;
            padding: 16px;

            &-left {
                width: 100%;

                :deep(.n-checkbox) {
                    margin-right: 12px;
                }

                &-logo {
                    width: 40px;
                    height: 40px;
                    margin-right: 12px;
                    border-radius: 8px;
                }

                &-baseinfo {
                    .plugin-name {
                        font-size: 15px;
                        line-height: 1.3;
                        white-space: normal;
                    }

                    .plugin-desc {
                        display: box;
                        overflow: hidden;
                        font-size: 12px;
                        line-height: 1.4;
                        white-space: normal;
                        -webkit-line-clamp: 2;
                        -webkit-box-orient: vertical;
                    }
                }
            }

            &-right {
                flex-wrap: wrap;
                gap: 8px;
                justify-content: space-between;
                width: 100%;

                .author {
                    order: 1;
                    min-width: auto;

                    a {
                        padding: 2px 6px;
                        font-size: 12px;
                    }
                }

                .version {
                    order: 2;
                    min-width: auto;
                    padding: 1px 4px;
                    font-size: 12px;
                }

                .crt {
                    order: 3;
                    min-width: auto;
                    font-size: 11px;
                }

                :deep(.n-switch) {
                    order: 4;
                    margin-left: auto;
                }

                .setting {
                    order: 5;

                    &-btn {
                        width: 28px;
                        height: 28px;
                        font-size: 14px;
                    }
                }
            }
        }
    }
}

// 平板适配
@media screen and (min-width: 769px) and (max-width: 1024px) {
    .plugin-list {
        .plugin {
            padding: 18px 20px;

            &-left {
                &-logo {
                    width: 44px;
                    height: 44px;
                    border-radius: 10px;
                }

                &-baseinfo {
                    .plugin-name {
                        font-size: 15px;
                    }
                }
            }

            &-right {
                gap: 12px;

                .author {
                    min-width: 70px;
                }

                .version {
                    min-width: 50px;
                }

                .crt {
                    min-width: 90px;
                }
            }
        }
    }
}

// 暗色模式支持
@media (prefers-color-scheme: dark) {
    .plugin-list {
        background: rgb(255 255 255 / 2%);

        .plugin {
            border-bottom-color: rgb(255 255 255 / 8%);

            &:hover {
                background: rgb(255 255 255 / 4%);
                box-shadow: 0 2px 8px rgb(0 0 0 / 20%);
            }

            &-left {
                :deep(.n-checkbox) {
                    .n-checkbox__input {
                        background: rgb(255 255 255 / 4%);
                        border-color: rgb(255 255 255 / 24%);
                    }

                    .n-checkbox__input--checked {
                        background: #b78aff;
                        border-color: #b78aff;
                    }
                }

                &-logo {
                    background: rgb(255 255 255 / 6%);
                }

                &-baseinfo {
                    .plugin-name {
                        color: rgb(255 255 255 / 90%);
                    }

                    .plugin-desc {
                        color: rgb(255 255 255 / 45%);
                    }
                }
            }

            &-right {
                .author {
                    a {
                        color: rgb(255 255 255 / 45%);

                        &:hover {
                            color: #b78aff;
                            background: rgb(183 138 255 / 10%);
                        }
                    }
                }

                .version {
                    color: rgb(255 255 255 / 45%);
                    background: rgb(255 255 255 / 6%);
                }

                .crt {
                    color: rgb(255 255 255 / 35%);
                }

                :deep(.n-switch) {
                    .n-switch__rail {
                        background: rgb(255 255 255 / 16%);

                        &--active {
                            background: #b78aff;
                        }
                    }
                }

                .setting {
                    &-btn {
                        color: rgb(255 255 255 / 45%);

                        &:hover {
                            color: rgb(255 255 255 / 65%);
                            background: rgb(255 255 255 / 8%);
                        }
                    }
                }
            }
        }
    }
}

// 动画效果
@keyframes fade-in {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

</style>
