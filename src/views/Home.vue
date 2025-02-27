<template>
    <div class="controller-panel">
        <div :class="['panel-left', isClosed ? 'min' : 'max']">
            <div class="mission">
                <!-- 标题 --> 
                <h2>{{ $t('mission_list') }}</h2>
                <!-- 任务状态列表 -->
                <div class="status-list slider-block">
                    <div
                        v-for="status in statusList"
                        :key="status.name"
                        class="slider-block-item status"
                        :class="{ 'status-active': activeStatusKey === status.key }"
                        @click="changeStatusTab(status.key)"
                    >
                        <component
                            :is="status.icon"
                            class="status-icon slider-block-item-icon"
                            theme="filled"
                            size="24"
                            :fill="activeStatusKey === status.key ? '#B78AFF' : '#333'"
                        ></component>
                        <div v-show="showMenuName" class="status-name slider-block-item-name">{{ status.name }}</div>
                    </div>
                </div>
                <!-- 增加插件设置 --> 
                <h2 v-if="false">{{ $t("system_settings") }}</h2>
                <div v-if="false" class="base-settings">
                    <div class="settings-list slider-block">
                        <div 
                            v-for="setting in settingsList" 
                            :key="setting.key" 
                            class="slider-block-item" 
                            @click="changeSystemSetting(setting)"
                        >
                            <component
                                :is="setting.icon"
                                class="slider-block-item-icon"
                                theme="filled"
                                size="24"
                                :fill="activeStatusKey === setting.key ? '#B78AFF' : '#333'"
                            ></component>
                            <div v-if="showMenuName" class="slider-block-item-name">{{ setting.name }}</div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 侧边栏展开收起 -->
            <div class="arrow" @click="toggleSlider">
                <n-icon size="13">
                    <ArrowLeft v-if="!isClosed" />
                    <ArrowRight v-else />
                </n-icon>
            </div>
        </div>
        <!-- 内容展示区域 -->
        <div class="panel-right">
            <router-view class="main-container" />
        </div>
        <!-- 系统升级 -->
        <div class="system">
            <n-tooltip
                v-if="versionInfo.upgrade"
                :show-arrow="false"
                placement="left"
                trigger="hover"
            >
                <template #trigger>
                    <n-button circle type="primary" @click="upgrade">
                        <template #icon>
                            <n-icon>
                                <Refresh size="24" />
                            </n-icon>
                        </template>
                    </n-button>
                </template>
                <span>{{ $t('upgrade') }}</span>
            </n-tooltip>
            <n-tooltip
                :show-arrow="false"
                placement="left"
                trigger="hover"
            >
                <template #trigger>
                    <n-button circle type="primary" @click="showSetting = true">
                        <template #icon>
                            <n-icon>
                                <SettingConfig size="24" />
                            </n-icon>
                        </template>
                    </n-button>
                </template>
                <span>{{ $t('setting') }}</span>
            </n-tooltip>
        </div>
        <!-- 基础设置弹窗 --> 
        <Setting :show="showSetting" @update:show="showSetting = $event" />
        <!-- 全局升级 loading -->
        <Upgrade :show="upgradeVersion" @close="upgradeVersion = false" />
    </div>
</template>
<script>
import { defineComponent, ref, onMounted } from 'vue'
import { PlayOne, PauseOne, Box, SettingConfig, Refresh, ArrowLeft, ArrowRight, PlugOne } from '@icon-park/vue-next'
import { useDialog, useMessage } from 'naive-ui'
import MissionList from '../components/MissionList.vue'
import Blank from '../components/Blank.vue'
import Quick from '../components/Quick.vue'
import Setting from '../components/Setting.vue'
import Upgrade from '../components/Upgrade.vue'
import Mission from './pages/Mission.vue'
import i18n from '@/lang'
import { useStore } from '../store'
import { getSystemVersion } from '@/api/index'
import { useRouter, useRoute } from 'vue-router'
// 引入i8n实例
export default defineComponent({
    components: { MissionList, Blank, Quick, Setting, SettingConfig, Refresh, Mission, Upgrade, ArrowLeft, ArrowRight },
    setup() {
        const dialog = useDialog()
        const message = useMessage()
        const store = useStore()
        const mission = ref(null)
        const upgradeVersion = ref(false)
        const isClosed = ref(false)
        const router = useRouter()
        const route = useRoute()
        const statusList = [{
            name: i18n.global.t('downloading'),
            icon: PlayOne,
            key: '0,1,5',
        },
        {
            name: i18n.global.t('finish'),
            icon: Box,
            key: '3',
        },
        {
            name: i18n.global.t('stoped'),
            icon: PauseOne,
            key: '2,4',
        }]
        const settingsList = [{
            name: i18n.global.t('plugin'),
            icon: PlugOne,
            key: 'plugin',
            path: '/plugins',
        }]
        const versionInfo = ref({
            upgrade: false,
        })
        const showSetting = ref(false)
        const activeStatusKey = computed({
            get: () => store?.status,
            set: (val) => {
                // todo: 如果当前的路由不是/那么跳转
                if (route.path !== '/') router.push({ path: '/' })
                store.setStatus(val)
            },
        })
        const changeStatusTab = (key) => { activeStatusKey.value = key }
        // 切换系统设置
        const changeSystemSetting = ({ path }) => {
            router.push({ path })
        }
        const getVersionInfo = async () => {
            const res = await getSystemVersion()
            if (res.code === 0) {
                versionInfo.value = res.data
                // message notification
                if (res.data.upgrade) message.info(i18n.global.t('upgrade_message'), { duration: 3000 })
            }
        }
        const upgrade = () => {
            dialog.success({
                title: i18n.global.t('notification'),
                content: `${i18n.global.t('current_version')}: ${versionInfo.value.current}, ${i18n.global.t('latest_version')}: ${versionInfo.value.version}`,
                positiveText: i18n.global.t('upgrade'),
                negativeText: i18n.global.t('cancel'),
                onPositiveClick: async () => {
                    upgradeVersion.value = !upgradeVersion.value
                },
            })
        }
        const toggleSlider = () => {
            isClosed.value = !isClosed.value
        }
        // 展示菜单名称
        const showMenuName = computed(() => {
            if (store?.isMobile) return false
            return !isClosed.value
        })

        onMounted(() => {
            getVersionInfo()
        })
        return {
            changeStatusTab,
            changeSystemSetting,
            SettingConfig,
            showSetting,
            settingsList,
            statusList,
            activeStatusKey,
            mission,
            versionInfo,
            isClosed,
            showMenuName,
            upgrade,
            toggleSlider,
            upgradeVersion,
        }
    },
})
</script>
<style lang="scss" scoped>
@media screen and (max-width: 768px) {
    .panel-left.min {
        width: 0 !important;
    }

    .panel-left.max {
        width: 70px !important;
    }
}

::v-deep .n-dialog .n-dialog__icon {
    --n-icon-color: #b78aff !important;

    color: #b78aff !important;
    background-color: #000;
}

.controller-panel {
    position: absolute;
    display: flex;
    width: 100%;
    height: 100%;
    background-color: #fff;
    border-radius: 10px;

    @include center;

    .n-modal-body-wrapper .n-dialog {
        --n-icon-color: #b78aff !important;
        --n-color: #b78aff !important;

        background-color: #000;
    }

    .system {
        position: absolute;
        right: 20px;
        bottom: 20px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;

        .n-button {
            margin-bottom: 10px;
        }
    }

    .panel {
        &-left {
            position: relative;
            box-sizing: border-box;
            display: flex;
            width: 220px;
            height: 100%;
            padding-bottom: 40px;
            border-right: 1px solid #eee;
            transition: width .3s ease-in-out;

            &::after {
                position: absolute;
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
                z-index: -1;
                content: "";
                background-color: #f2f2f2;
                filter: blur(20px);
            }

            &.min {
                width: 70px;
            }

            &.max {
                width: 220px;
            }

            .arrow {
                position: absolute;
                top: 50%;
                right: -20px;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 30px;
                height: 30px;
                cursor: pointer;
                background-color: #fff;
                border-radius: 50%;
                box-shadow: 0 2px 4px rgb(0 0 0 / 12%), 0 0 6px rgb(0 0 0 / 4%);
                transform: translateY(-50%);
            }

            .quick-actions {
                box-sizing: border-box;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: flex-start;
                width: 50px;
                height: 100%;
                padding: 10px 0;
                background: #000;

                .action {
                    margin: 10px 0;
                    cursor: pointer;
                }
            }

            .mission {
                box-sizing: border-box;
                flex: 1;
                padding: 0 10px;
                overflow: hidden;

                h2 {
                    display: inline-block;
                    padding: 20px 10px;
                    transition: width 200ms ease-in-out;
                }
            }

            .status-list,
            .slider-block {
                display: flex;
                flex-direction: column;
                width: 100%;

                .status,
                .slider-block-item {
                    box-sizing: border-box;
                    display: flex;
                    align-items: center;
                    padding: 5px 0;
                    padding-left: 10px;
                    margin-bottom: 10px;
                    cursor: pointer;
                    border-radius: 5px;

                    &-icon {
                        margin-right: 10px;

                        &:hover {
                            fill: $primary-color;
                        }
                    }

                    &:hover,
                    &.status-active {
                        color: $primary-color;
                        background-color: #eaecf0;
                    }
                }
            }
        }

        &-right {
            box-sizing: border-box;
            flex: 1;
            height: 100%;
            padding: $pd;
            overflow: hidden;

            .main-container {
                height: 100%;
            }
        }
    }
}
</style>
