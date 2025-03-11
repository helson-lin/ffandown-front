<template>
    <div class="plugin">
        <div class="plugin-header">
            <add
                theme="filled"
                size="24"
                fill="#333"
                @click="addPluginShow = !addPluginShow"
            />
        </div>
        <div class="plugin-content">
            <n-data-table
                :bordered="true"
                :single-line="false"
                :columns="columns"
                :data="data"
            />
        </div>
    </div>
</template>
<script>
import { ref } from 'vue'
import { Add } from '@icon-park/vue-next'

export default {
    components: {
        Add,
    },
    setup() {
        const addPluginShow = ref(false)
        const columns = [
            {
                title: '插件名称',
                key: 'name',
            },
            {
                title: '插件作者',
                key: 'author',
            },
            {
                title: '描述',
                key: 'description',
            },
            {
                title: '启用',
                key: 'status',
            },
            {
                title: '操作',
                key: 'actions',
            },
        ]
        const data = ref([])
        return {
            columns,
            data,
            addPluginShow,
        }
    },
}
</script>
<style lang="scss" scoped>
.plugin {
    box-sizing: border-box;
    background: #fff;

    &-header {
        position: relative;
        box-sizing: border-box;
        width: 100%;
        padding: 10px 10px 20px;

        &::after {
            position: absolute;
            right: 10px;
            bottom: 10px;
            left: 10px;
            display: block;

            // width: 100%;
            height: 0;
            content: "";
            border-bottom: 1px solid #b6b2b271;
        }
    }

    &-content {
        padding: $pd;
    }
}
</style>
