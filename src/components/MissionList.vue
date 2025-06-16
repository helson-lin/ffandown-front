<template>
    <div class="mission-list">
        <mission-card
            v-for="item in missionList"
            :key="item.uid"
            :mission="item"
            @delMission="delMission"
            @resume="resume"
            @stop="stop"
        />
        <Blank v-if="missionList.length === 0" />
    </div>
    <!-- 分页 -->
    <div class="pg-box">
        <n-pagination v-model:page="page.current" :page-count="page.count" :on-update:page="updatePg" />
    </div>
</template>
<script>
import { defineComponent, toRefs, reactive, onUnmounted, computed, watch } from 'vue'
import MissionCard from './MissionCard.vue'
import { deleteMission, resumeMission, stopMission, getDownloadList } from '../api/index'
import { useMessage, useDialog, NPagination } from 'naive-ui'
import Blank from './Blank.vue'
import i18n from '@/lang'
import { useSSE } from '../hooks/useSSE'

export default defineComponent({
    components: { MissionCard, Blank, NPagination },
    props: {
        status: {
            type: String,
            default: '0,1',
        },
    },
    setup(props, { expose }) {
        let timer = null
        const page = ref({
            current: 1,
            pageSize: 6,
            count: 1,
        })
        const message = useMessage()
        const dialog = useDialog()
        const state = reactive({
            list: [],
        })
        const { initSSE, closeSSE } = useSSE('/list/sse', {
            onMessage: (res) => {
                if (res.code !== 0) return
                const { rows, total } = res.data
                const list = rows.map(i => ({
                    ...i,
                    percent: parseInt(Number(i.percent).toFixed(2)),
                }))
                page.value.count = total
                state.list = list
            },
            events: {
                end: (data) => console.warn(`连接结束: ${data}`),
            },
        })
        const missionList = computed(() => state.list.filter(i => props.status.includes(i.status)))
        // 删除任务
        const delMission = async ({ uid }) => {
            const res = await deleteMission(uid)
            if (res.code === 0) {
                message.success(i18n.global.t('delete_success'))
                getData()
            } else {
                message.success(i18n.global.t('delete_failed'))
            }
        }

        const getData = async (notice = false) => {
            const res = await getDownloadList(Object.assign(page.value, { status: props.status }))
            if (res.code === 0) {
                const { rows, total } = res.data
                const list = rows.map(i => ({
                    ...i,
                    percent: parseInt(Number(i.percent).toFixed(2)),
                }))
                page.value.count = total
                state.list = list
            }
            if (notice) {
                message.success(i18n.global.t('refresh_success'))
            }
        }

        // 获取任务列表
        const getMissionList = () => {
            closeSSE()
            initSSE(Object.assign(page.value, { status: props.status }))
        }

        // 更新分页
        const updatePg = (val) => {
            page.value.current = val
            getData()
        }

        // 删除所有任务
        const delAllMission = () => {
            const uids = missionList.value.map(i => i.uid)
            delMission({ uid: uids.join(',') })
        }
        // 清除所有任务
        const clearAllMission = () => {
            dialog.warning({
                title: i18n.global.t('warn'),
                content: i18n.global.t('clear_all_mission'),
                positiveText: i18n.global.t('confirm'),
                negativeText: i18n.global.t('cancel'),
                onPositiveClick: () => {
                    delAllMission()
                },
            })
        }

        watch(() => props.status, () => {
            clearInterval(timer)
            page.value.current = 1
            getMissionList()
            // if (props.status === '0,1,5') {
            //     page.value.current = 1
            //     getMissionList()
            // } else {
            //     closeSSE()
            //     getData()
            // }
        })

        const resume = async ({ uid, status }) => {
            if (status === '4') {
                const res = await resumeMission(uid)
                if (res.code === 0) {
                    message.success(i18n.global.t('resume_success'))
                    // 刷新列表
                    getData()
                } else {
                    message.warning(i18n.global.t('resume_failed'))
                }
            }
        }
        // 停止任务
        const stop = async ({ uid }) => {
            const res = await stopMission(uid)
            if (res.code === 0) {
                message.success(i18n.global.t('stop_success'))
                getData()
            } else {
                message.warning(res.message)
            }
        }

        expose({
            getMissionList,
            getData,
            clearAllMission,
        })

        onMounted(() => {
            getMissionList()
        })

        onUnmounted(() => {
            clearInterval(timer)
        })
        
        return {
            delMission,
            resume,
            stop,
            missionList,
            page,
            getData,
            updatePg,
            ...toRefs(state),
        }
    },
})
</script>
<style lang="scss" scoped>
.mission-list {
    box-sizing: border-box;
    flex: 1;
    padding: 16px;
    overflow-y: auto;
    background: #fff;
    transition: all .3s ease;

    &::-webkit-scrollbar {
        width: 4px;
    }

    &::-webkit-scrollbar-thumb {
        background-color: rgb(0 0 0 / 10%);
        border-radius: 2px;
    }

    &::-webkit-scrollbar-track {
        background-color: transparent;
    }
}

.pg-box {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    width: 100%;
    padding: 25px 0 16px 20px;
    background: #fff;
    border-top: 1px solid rgb(0 0 0 / 6%);
    transition: all .3s ease;

    :deep(.n-pagination) {
        .n-pagination-item {
            transition: all .2s ease;

            &:hover:not(.n-pagination-item--disabled) {
                background-color: rgb(0 0 0 / 4%);
            }

            &--active {
                color: #fff;
                background-color: $primary-color;
                border-color: $primary-color;

                &:hover {
                    background-color: darken($primary-color, 5%);
                }
            }
        }

        .n-pagination-item-quick-jumper {
            input {
                border-color: rgb(0 0 0 / 12%);
                transition: all .2s ease;

                &:hover,
                &:focus {
                    border-color: $primary-color;
                }
            }
        }
    }
}

// 移动端适配
@media screen and (max-width: 768px) {
    .mission-list {
        padding: 12px;
    }

    .pg-box {
        padding: 12px;

        :deep(.n-pagination) {
            .n-pagination-item {
                min-width: 32px;
                height: 32px;
                font-size: 13px;
            }

            .n-pagination-item-quick-jumper {
                display: none;
            }
        }
    }
}

// 平板适配
@media screen and (min-width: 769px) and (max-width: 1024px) {
    .mission-list {
        padding: 14px;
    }

    .pg-box {
        padding: 14px;
    }
}

// 暗色模式支持
@media (prefers-color-scheme: dark) {
    .mission-list {
        background: rgb(255 255 255 / 2%);

        &::-webkit-scrollbar-thumb {
            background-color: rgb(255 255 255 / 10%);
        }
    }

    .pg-box {
        background: rgb(255 255 255 / 2%);
        border-top-color: rgb(255 255 255 / 8%);

        :deep(.n-pagination) {
            .n-pagination-item {
                color: rgb(255 255 255 / 85%);
                background-color: rgb(255 255 255 / 4%);
                border-color: rgb(255 255 255 / 12%);

                &:hover:not(.n-pagination-item--disabled) {
                    background-color: rgb(255 255 255 / 8%);
                }

                &--active {
                    color: #fff;
                    background-color: $primary-color;
                    border-color: $primary-color;

                    &:hover {
                        background-color: darken($primary-color, 5%);
                    }
                }

                &--disabled {
                    color: rgb(255 255 255 / 30%);
                    background-color: rgb(255 255 255 / 2%);
                }
            }

            .n-pagination-item-quick-jumper {
                color: rgb(255 255 255 / 85%);

                input {
                    color: rgb(255 255 255 / 85%);
                    background-color: rgb(255 255 255 / 4%);
                    border-color: rgb(255 255 255 / 12%);

                    &:hover,
                    &:focus {
                        background-color: rgb(255 255 255 / 6%);
                        border-color: $primary-color;
                    }

                    &::placeholder {
                        color: rgb(255 255 255 / 30%);
                    }
                }
            }
        }
    }
}

// 空状态样式优化
:deep(.blank) {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    font-size: 14px;
    color: rgb(0 0 0 / 45%);
    transition: all .3s ease;

    @media (prefers-color-scheme: dark) {
        color: rgb(255 255 255 / 45%);
    }
}
</style>
