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
        <PluginSetting :show="pluginSettingShow" :settings="pluginSettings" />
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
    emits: ['update:modelValue', 'updateStatus'],
    setup(props, ctx) {
        const pluginSettingShow = ref(false)
        const pluginSettings = ref('')
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
            console.warn(plugin)
            if (!plugin.settings) return
            pluginSettings.value = plugin.settings
            pluginSettingShow.value = true
        }
        return {
            DefaultPluginLogo,
            checkList,
            pluginSettingShow,
            openSetting,
            pluginSettings,
            updateStatus,
            transformTm,
        }
    },
})
</script>
<style lang="scss" scoped>
.plugin-list {
    display: flex;
    flex-direction: column;
    border-bottom: 1px solid #e2e2e3;

    .plugin {
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 0;

        // border-bottom: 1px solid #e2e2e3;
        border-top: 1px solid #e2e2e3;

        &-left {
            display: flex;
            align-items: center;

            &-logo {
                box-sizing: border-box;
                width: 40px;
                height: 40px;
                margin-left: 10px;
                background: #f2f2f2;
                border-radius: 10px;

                &.pad {
                    padding: 5px;
                }

                img {
                    width: 100%;
                    height: 100%;
                }
            }

            &-baseinfo {
                margin-left: 10px;

                .plugin-name {
                    font-weight: 500;
                    line-height: 1.5;
                }

                .plugin-desc {
                    font-size: 12px;
                    line-height: 1.5;
                    color: #999;
                }
            }
        }

        &-right {
            display: flex;
            align-items: center;

            .author {
                a {
                    color: #999;
                    transition: color .3s ease;
                }

                a:hover {
                    text-decoration: none;
                }
            }

            .leading {
                margin-right: 10px;
                font-size: 13px;
                line-height: 1.5;
                color: #999;
            }

            .setting {
                display: flex;
                align-items: center;
                justify-content: center;
                margin-left: 10px;

                &-btn {
                    box-sizing: border-box;
                    padding: 5px;
                    border-radius: 4px;

                    &:hover {
                        cursor: pointer;
                        background: #e2e2e3;
                    }
                }
            }
        }
    }
}
</style>
