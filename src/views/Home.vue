<template>
    <div class="controller-panel">
        <div class="panel-left">
            <div class="mission">
                <h2>{{ $t('mission_list') }}</h2>
                <div class="status-list">
                    <div
                        v-for="status in statusList"
                        :key="status.name"
                        :class="{ 'status': true, 'status-active': activeStatusKey === status.key }"
                        @click="changeStatusTab(status.key)"
                    >
                        <component
                            :is="status.icon"
                            class="status-icon"
                            theme="filled"
                            size="24"
                            :fill="activeStatusKey === status.key ? '#B78AFF' : '#333'"
                        ></component>
                        <div class="status-name">{{ status.name }}</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="panel-right">
            <Quick @refresh="refresh" @clear="clearAllMission" />
            <!-- 快捷工具 -->
            <!--- 没有数据 -->
            <MissionList ref="mission" :status="activeStatusKey" />
            <!-- <Blank /> -->
        </div>
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
        <NewMission :show="showNewMission" @update:show="showNewMission = $event" />
        <Setting :show="showSetting" @update:show="showSetting = $event" />
        <Upgrade :show="upgradeVersion" @close="upgradeVersion = false" />
    </div>
</template>
<script>
import { defineComponent, ref, onMounted } from 'vue'
import { PlayOne, PauseOne, Box, SettingConfig, Refresh } from '@icon-park/vue-next'
import { useDialog } from 'naive-ui'
import MissionList from '../components/MissionList.vue'
import Blank from '../components/Blank.vue'
import Quick from '../components/Quick.vue'
import Setting from '../components/Setting.vue'
import Upgrade from '../components/Upgrade.vue'
import i18n from '@/lang'
import { getSystemVersion } from '@/api/index'
// 引入i8n实例
export default defineComponent({
    components: { MissionList, Blank, Quick, Setting, SettingConfig, Refresh, Upgrade },
    setup() {
        const dialog = useDialog()
        const mission = ref(null)
        const upgradeVersion = ref(false)
        const statusList = [{
            name: i18n.global.t('downloading'),
            icon: PlayOne,
            key: '1/0',
        },
        {
            name: i18n.global.t('finish'),
            icon: Box,
            key: '3',
        },
        {
            name: i18n.global.t('stoped'),
            icon: PauseOne,
            key: '2/4',
        }]
        const versionInfo = ref({
            upgrade: false,
        })
        const showSetting = ref(false)
        const activeStatusKey = ref('1/0')
        const changeStatusTab = (key) => { activeStatusKey.value = key }
        const getVersionIno = async () => {
            const res = await getSystemVersion()
            if (res.code === 0) {
                versionInfo.value = res.data
            }
        }
        const upgrade = () => {
            dialog.success({
                title: i18n.global.t('notification'),
                content: `Current Version: ${versionInfo.value.current}, Latest Version: ${versionInfo.value.version}`,
                positiveText: i18n.global.t('upgrade'),
                negativeText: i18n.global.t('cancel'),
                onPositiveClick: async () => {
                    upgradeVersion.value = !upgradeVersion.value
                },
            })
        }
        // refresh mission list
        const refresh = () => {
            mission.value?.getMissionList()
        }
        const clearAllMission = () => {
            mission.value?.clearAllMission()
        }
        onMounted(() => {
            getVersionIno()
        })
        return {
            changeStatusTab,
            refresh,
            clearAllMission,
            SettingConfig,
            showSetting,
            statusList,
            activeStatusKey,
            mission,
            versionInfo,
            upgrade,
            upgradeVersion,
        }
    },
})
</script>
<style lang="scss" scoped>
.controller-panel {
    position: absolute;
    display: flex;
    width: 100%;
    height: 100%;
    background-color: #fff;
    border-radius: 10px;

    @include center;

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

            // padding: 0 20px;
            padding-bottom: 40px;
            border-right: 1px solid #eee;
            backdrop-filter: blur(20px);

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
            }

            h2 {
                padding: 20px 10px;
            }

            .status-list {
                display: flex;
                flex-direction: column;
                width: 100%;

                .status {
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
        }
    }
}
</style>
