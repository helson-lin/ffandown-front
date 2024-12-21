<template>
    <n-icon :size="size">
        <svg aria-hidden="true">
            <use :xlink:href="symbolId" />
        </svg>
    </n-icon>
</template>

<script setup>
import { computed, defineProps } from 'vue'

const props = defineProps({
    name: {
        type: String,
        required: true,
    },
    size: {
        type: Number,
        default: 20,
    },
})

const symbolId = computed(() => `#icon-svg-${props.name}`)
const size = computed(() => props.size)
</script>

<style scoped>
    .n-icon {
        :deep(path) {
            fill: red;
            stroke: red;
        }
    }
</style>
