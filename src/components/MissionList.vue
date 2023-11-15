<template>
    <div class="mission-list">
        <mission-card v-for="item in list" :key="item.uid" :mission="item" />
    </div>
</template>
<script>
import { defineComponent, toRefs, reactive } from 'vue'
import MissionCard from './MissionCard.vue'

export default defineComponent({
    components: { MissionCard },
    setup() {
        const data = reactive({
            list: [
                {
                    uid: '1',
                    name: 'defineComponent',
                    status: 1,
                    percent: 20,
                    url: 'defineComponent',
                },
                {
                    uid: '2',
                    name: 'toRefs',
                    status: 32,
                    percent: 34,
                    url: 'toRefs',
                },
            ],
        })
        return {
            ...toRefs(data),
        }
    },
})
</script>
