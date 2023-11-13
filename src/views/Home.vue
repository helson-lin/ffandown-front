<template>
    <div class="controller-panel">
        <div class="panel-left">
            <div class="quick-actions">
                <div class="action">
                    <add
                        theme="outline"
                        size="24"
                        fill="#eee"
                        @click="showNewMission = !showNewMission"
                    />
                </div>
            </div>
            <div class="mission">
                <h2>任务列表</h2>
                <div class="status-list">
                    <div
                        v-for="status in statusList"
                        :key="status.name"
                        :class="{'status': true, 'status-active': activeStatusKey === status.key }"
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
            <!--- 没有数据 -->
            <MissionCard />
        </div>
        <NewMission :show="showNewMission" @update:show="showNewMission = $event" @confirm="confirmMission" />
    </div>
</template>
<script>
import { defineComponent } from 'vue'
import { PlayOne, PauseOne, Box, Add } from '@icon-park/vue-next'
import NewMission from '../components/NewMission.vue'
import MissionCard from '../components/MissionCard.vue'

export default defineComponent({
    components: { Add, NewMission, MissionCard },
    setup() {
        const statusList = [{
            name: '下载中',
            icon: PlayOne,
            key: 'downloading',
        },
        {
            name: '已完成',
            icon: Box,
            key: 'finished',
        },
        {
            name: '已停止',
            icon: PauseOne,
            key: 'stopped',
        }]
        const activeStatusKey = ref('downloading')
        const changeStatusTab = (key) => { activeStatusKey.value = key }
        const showNewMission = ref(false)
        const confirmMission = (data) => {
            // 直接发起任务请求
            console.log(data)
        }
        return {
            confirmMission,
            changeStatusTab,
            statusList,
            activeStatusKey,
            showNewMission,
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

    // box-shadow: rgba(17, 17, 26, 0.1) 0px 0px 16px;
    border-radius: 10px;

    @include center;

    .panel {
        &-left {

            // padding: 0 20px;
            box-sizing: border-box;
            display: flex;
            width: 220px;
            height: 100%;
            border-right: 1px solid #eee;

            // background: #f4f5f755;
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
        }
    }
}
</style>
