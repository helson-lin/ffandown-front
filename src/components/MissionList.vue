<template>
    <div class="mission-list">
        <mission-card
            v-for="item in missionList"
            :key="item.uid"
            :mission="item"
            @delMission="delMission"
            @resume="resume"
        />
        <Blank v-if="missionList.length === 0" />
    </div>
</template>
<script>
import { defineComponent, toRefs, reactive, computed } from 'vue'
import MissionCard from './MissionCard.vue'
import { deleteMission, pauseMission, resumeMission } from '../api/index'
import { useMessage, useDialog } from 'naive-ui'
import Websocket from '../api/ws'
import Blank from './Blank.vue'

export default defineComponent({
    components: { MissionCard, Blank },
    props: {
        status: {
            type: String,
            default: '1/0',
        },
    },
    setup(props, { expose }) {
        const wsUrl = `ws://${window.location.host}/ws`
        const ws = new Websocket(wsUrl)
        let timer = null
        const message = useMessage()
        const dialog = useDialog()
        const state = reactive({
            list: [],
        })
        const missionList = computed(() => state.list.filter(i => props.status.includes(i.status)))
        ws.on((data) => {
            if (data.key === 'connected') {
                getMissionList()
            } else if (data.key === 'list') {
                state.list = data.data.map(i => ({
                    ...i,
                    percent: parseInt(i.percent),
                }))
            }
        })
        const delMission = async ({ uid }) => {
            const res = await deleteMission(uid)
            if (res.code === 0) {
                message.success('删除成功')
                ws.send('list')
                // await getMissionList()
            }
        }
        const getMissionList = () => {
            if (timer) clearInterval(timer)
            ws.send('list')
            timer = setInterval(() => {
                ws.send('list')
            }, 1000)
        }

        const delAllMission = () => {
            const uids = missionList.value.map(i => i.uid)
            delMission({ uid: uids.join(',') })
        }
        // clear all mission
        const clearAllMission = () => {
            dialog.warning({
                title: '警告',
                content: '清空所有任务？',
                positiveText: '确定',
                negativeText: '取消',
                onPositiveClick: () => {
                    delAllMission()
                },
            })
        }
        const resume = async ({ uid, status }) => {
            if (status === '2') {
                await resumeMission(uid)
            } else {
                await pauseMission(uid)
            }
        }
        expose({
            getMissionList,
            clearAllMission,
        })
        return {
            delMission,
            resume,
            missionList,
            ...toRefs(state),
        }
    },
})
</script>
