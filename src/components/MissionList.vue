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
        const missionList = computed(() => state.list.filter(i => props.status.includes(i.status)))
        const delMission = async ({ uid }) => {
            const res = await deleteMission(uid)
            if (res.code === 0) {
                message.success(i18n.global.t('delete_success'))
                getMissionList()
            } else {
                message.success(i18n.global.t('delete_failed'))
            }
        }

        const getData = async () => {
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
        }

        const getMissionList = () => {
            if (timer) clearInterval(timer)
            getData()
            timer = setInterval(() => {
                getData()
            }, 5000)
        }

        const updatePg = (val) => {
            page.value.current = val
            getData()
        }

        const delAllMission = () => {
            const uids = missionList.value.map(i => i.uid)
            delMission({ uid: uids.join(',') })
        }
        // clear all mission
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
            if (props.status === '0,1,5') {
                // reset page to 1
                page.value.current = 1
                getMissionList()
            } else {
                clearInterval(timer)
                getData()
            }
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
        // stop mission 
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
    height: calc(100% - 100px);
    padding: 0 10px;
    overflow-y: auto;
    background: #fff;
}

.pg-box {
    width: 100%;
    padding: 20px 0;
}
</style>
