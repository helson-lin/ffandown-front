<template>
    <div class="home">
        <Header />
        <div class="controller-panel">
            <div :class="['panel-left', isClosed ? 'min' : 'max']">
                <div class="mission">
                    <!-- 标题 --> 
                    <h2 class="module-name">{{ $t('mission_list') }}</h2>
                    <!-- 任务状态列表 -->
                    <div class="status-list slider-block">
                        <div
                            v-for="status in statusList"
                            :key="status.name"
                            class="slider-block-item status"
                            :class="{ 'status-active': activeStatusKey === status.key && menuName === 'mission' }"
                            @click="changeStatusTab(status.key)"
                        >
                            <component
                                :is="status.icon"
                                class="status-icon slider-block-item-icon"
                                theme="filled"
                                size="24"
                                :fill="(activeStatusKey === status.key && menuName === 'mission') ? '#b78aff' : '#333'"
                            ></component>
                            <div v-show="showMenuName" class="status-name slider-block-item-name">{{ status.name }}</div>
                        </div>
                    </div>
                    <!-- 增加插件设置 --> 
                    <h2 class="module-name">{{ $t("system_settings") }}</h2>
                    <!-- <div class="base-settings"> -->
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
                                :fill="menuName === 'plugin' ? '#b78aff' : '#333'"
                            ></component>
                            <div v-if="showMenuName" class="slider-block-item-name" :class="{ 'active': menuName === 'plugin'}">{{ setting.name }}</div>
                        </div>
                    </div>
                    <!-- </div> -->
                </div>
                <div v-show="!isClosed" class="open-resource">
                    <a href="https://github.com/helson-lin/ffandown" target="_blank">
                        <Icon name="github" :size="30" />
                    </a>
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
                    <n-button 
                        circle 
                        type="primary" 
                        @click="upgrade" 
                    >
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
import Header from '../components/Header.vue'
import i18n from '@/lang'
import { useStore } from '../store'
import { getSystemVersion } from '@/api/index'
import { useRouter, useRoute } from 'vue-router'
// 引入i8n实例
export default defineComponent({
    components: { Header, MissionList, Blank, Quick, Setting, SettingConfig, Refresh, Mission, Upgrade, ArrowLeft, ArrowRight },
    setup() {
        const dialog = useDialog()
        const message = useMessage()
        const store = useStore()
        const mission = ref(null)
        const upgradeVersion = ref(false)
        const isClosed = ref(false)
        const router = useRouter()
        const route = useRoute()
        const menuPathMap = {
            '/mission': 'mission',
            '/plugins': 'plugin',
        }
        const menuName = computed(() => menuPathMap[route.path] || menuPathMap['/mission'])
        // const menuName = ref(menuPathMap[route.path] || menuPathMap['/mission'])
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
                if (route.path !== '/mission') router.push({ path: '/mission' })
                store.setStatus(val)
            },
        })
        const changeStatusTab = (key) => { activeStatusKey.value = key }
        // 切换系统设置
        const changeSystemSetting = ({ path }) => {
            // 设置是否为当前页面
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
            menuName,
            upgrade,
            toggleSlider,
            upgradeVersion,
        }
    },
})
</script>
<style lang="scss" scoped>
.home {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    background-color: #f8fafc;
}

.controller-panel {
    box-sizing: border-box;
    display: flex;
    width: 100%;
    height: calc(100% - 40px);
    overflow: hidden;
    background-color: #f8fafc;

    .panel {
        &-left {
            position: relative;
            box-sizing: border-box;
            display: flex;
            width: 240px;
            height: 100%;
            padding-bottom: 40px;
            background-color: #fff;
            border-right: 1px solid rgb(0 0 0 / 6%);
            box-shadow: 0 1px 2px rgb(0 0 0 / 3%);
            transition: all .3s cubic-bezier(.4, 0, .2, 1);

            &::after {
                position: absolute;
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
                z-index: -1;
                content: "";
                background-color: rgb(255 255 255 / 80%);
                backdrop-filter: blur(20px);
            }

            &.min {
                width: 80px;
            }

            &.max {
                width: 240px;
            }

            .open-resource {
                position: absolute;
                bottom: 20px;
                left: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 100%;
                padding: 12px;
                transition: opacity .3s ease;

                &:hover {
                    opacity: .8;
                }

                :deep(svg) {
                    color: #1a1a1a;
                    fill: #1a1a1a;
                }
            }

            .arrow {
                position: absolute;
                top: 50%;
                right: -16px;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 32px;
                height: 32px;
                cursor: pointer;
                background-color: #fff;
                border-radius: 50%;
                box-shadow: 0 2px 8px rgb(0 0 0 / 8%);
                transition: all .3s ease;
                transform: translateY(-50%);

                &:hover {
                    background-color: #f8fafc;
                    box-shadow: 0 4px 12px rgb(0 0 0 / 12%);
                }
            }

            .mission {
                box-sizing: border-box;
                flex: 1;
                padding: 0 16px;
                overflow-x: hidden;
                overflow-y: auto;

                &::-webkit-scrollbar {
                    width: 4px;
                }

                &::-webkit-scrollbar-thumb {
                    background-color: rgb(0 0 0 / 10%);
                    border-radius: 2px;
                }

                h2 {
                    display: inline-block;
                    padding: 24px 12px 16px;
                    margin: 0;
                    font-size: 16px;
                    font-weight: 600;
                    color: #1a1a1a;
                    transition: all .3s ease;
                }
            }

            .status-list,
            .slider-block {
                display: flex;
                flex-direction: column;
                width: 100%;
                padding: 0 4px;

                .status,
                .slider-block-item {
                    box-sizing: border-box;
                    display: flex;
                    align-items: center;
                    padding: 10px 12px;
                    margin-bottom: 8px;
                    cursor: pointer;
                    border-radius: 8px;
                    transition: all .2s ease;

                    &-icon {
                        margin-right: 12px;
                        transition: all .2s ease;

                        &:hover {
                            fill: $primary-color;
                            transform: scale(1.05);
                        }
                    }

                    &-name {
                        font-size: 14px;
                        font-weight: 500;
                        color: #4a4a4a;
                        transition: all .2s ease;
                    }

                    &:hover {
                        background-color: rgb(0 0 0 / 4%);
                    }

                    &.status-active {
                        background-color: rgba($primary-color, .08);

                        .status-icon,
                        .slider-block-item-icon {
                            fill: $primary-color;
                        }

                        .status-name,
                        .slider-block-item-name {
                            color: $primary-color;
                        }
                    }
                }
            }
        }

        &-right {
            box-sizing: border-box;
            flex: 1;
            height: 100%;
            padding: 24px;
            overflow-x: hidden;
            overflow-y: auto;

            &::-webkit-scrollbar {
                width: 4px;
            }

            &::-webkit-scrollbar-thumb {
                background-color: rgb(0 0 0 / 10%);
                border-radius: 2px;
            }

            .main-container {
                height: 100%;
            }
        }
    }
}

.system {
    position: fixed;
    right: 24px;
    bottom: 24px;
    z-index: 100;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;

    .n-button {
        margin-bottom: 12px;
        transition: all .3s ease;

        &:hover {
            transform: translateY(-2px);
        }
    }
}

// 移动端适配
@media screen and (max-width: 768px) {
    .controller-panel {
        .panel {
            &-left {
                position: fixed;
                top: 40px;
                left: 0;
                z-index: 100;
                width: 100%;
                height: calc(100% - 40px);
                transition: transform .3s cubic-bezier(.4, 0, .2, 1);
                transform: translateX(-100%);

                &.min {
                    transform: translateX(-100%);
                }

                &.max {
                    transform: translateX(0);
                }

                .arrow {
                    top: 16px;
                    right: 16px;
                    transform: none;
                }

                .mission {
                    padding: 0 16px;
                    padding-top: 48px;

                    h2 {
                        padding: 16px 12px;
                        font-size: 15px;
                    }
                }

                .status-list,
                .slider-block {
                    padding: 0;

                    .status,
                    .slider-block-item {
                        padding: 12px;
                        margin-bottom: 4px;

                        &-icon {
                            margin-right: 16px;
                        }

                        &-name {
                            font-size: 15px;
                        }
                    }
                }
            }

            &-right {
                padding: 16px;
            }
        }
    }

    .system {
        right: 16px;
        bottom: 16px;

        .n-button {
            margin-bottom: 8px;
        }
    }
}

// 平板适配
@media screen and (min-width: 769px) and (max-width: 1024px) {
    .controller-panel {
        .panel {
            &-left {
                width: 200px;

                &.min {
                    width: 80px;
                }

                &.max {
                    width: 200px;
                }
            }
        }
    }
}

// 暗色模式支持
@media (prefers-color-scheme: dark) {
    .home {
        background-color: #1a1a1a;
    }

    .controller-panel {
        background-color: #1a1a1a;

        .panel {
            &-left {
                background-color: #242424;
                border-right-color: rgb(255 255 255 / 8%);

                &::after {
                    background-color: rgb(36 36 36 / 80%);
                }

                .arrow {
                    background-color: #242424;
                    box-shadow: 0 2px 8px rgb(0 0 0 / 20%);

                    &:hover {
                        background-color: #2a2a2a;
                    }
                }

                .mission {
                    h2 {
                        color: rgb(255 255 255 / 85%);
                    }
                }

                .status-list,
                .slider-block {
                    .status,
                    .slider-block-item {
                        &-name {
                            color: rgb(255 255 255 / 65%);
                        }

                        &:hover {
                            background-color: rgb(255 255 255 / 8%);
                        }

                        &.status-active {
                            background-color: rgba($primary-color, .15);
                        }
                    }
                }
            }
        }
    }
}
</style>
