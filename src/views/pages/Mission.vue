<template>
    <div class="mission-page">
        <!-- 快捷工具 -->
        <Quick @refresh="refresh" @clear="clearAllMission" />
        <!--- 数据列表 -->
        <MissionList ref="mission" :status="status" />
    </div>
</template>
<script>
import { defineComponent, computed, ref } from 'vue'
import Quick from '../../components/Quick.vue'
import MissionList from '../../components/MissionList.vue'
import { useStore } from '../../store'

export default defineComponent({
    components: { Quick, MissionList },
    setup() {
        const mission = ref(null)
        const store = useStore()
        const refresh = () => {
            mission.value?.getData(true)
        }
        const clearAllMission = () => {
            mission.value?.clearAllMission()
        }
        const status = computed(() => store?.status)
        return {
            refresh,
            clearAllMission,
            status,
            mission,
        }
    },
})
</script>
<style lang="scss" scoped>
.mission-page {
    box-sizing: border-box;
}
</style>