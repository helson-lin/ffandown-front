<template>
    <div class="plugin">
        <div class="plugin-header">
            <div class="plugin-header-left flex">
                <n-button 
                    v-if="checked.length"
                    icon-placement="left"
                    class="mr1" 
                    @click="addPluginShow = !addPluginShow"
                >
                    {{ $t('enable_plugin') }}
                </n-button>
                <n-button 
                    v-if="checked.length"
                    icon-placement="left"
                    class="mr1" 
                    @click="addPluginShow = !addPluginShow"
                >
                    {{ $t('disabled_plugin') }}
                </n-button>
                <!-- 删除插件 -->
                <n-button 
                    v-if="checked.length"
                    icon-placement="left" 
                    type="error"
                    @click="addPluginShow = !addPluginShow"
                >
                    <template #icon>
                        <DeleteOne
                            size="18"
                            fill="#fff"
                        />
                    </template>
                    {{ $t('delete_plugin') }}
                </n-button>
                <n-button 
                    v-show="checked.length === 0"
                    icon-placement="left" 
                    class="flex"
                    @click="addPluginShow = !addPluginShow"
                >
                    <template #icon>
                        <AddOne
                            size="18"
                            fill="#333"
                        />
                    </template>
                    {{ $t('create_plugin') }}
                </n-button>
            </div>
            <div class="plugin-header-right">
                <div class="filter-item">
                    <n-dropdown trigger="hover" :options="statusOptions" @select="handleSelect">
                        <n-button ghost>
                            状态：{{ statusNameMap[status] }}
                            <down-one theme="filled" size="15" fill="#333" />
                        </n-button>
                    </n-dropdown>
                </div>
            </div>
        </div>
        <div class="plugin-content">
            <!-- <n-data-table
                :bordered="true"
                :single-line="false"
                :columns="columns"
                :data="data"
            /> -->
            <PluginList v-model="checked" :data="data" />
            <div class="pg-box">
                <n-pagination v-model:page="page.current" :page-count="page.count" :on-update:page="updatePg" />
            </div>
        </div>
        <NewPlugin 
            :show="addPluginShow"
            @update:show="addPluginShow = $event" 
        />
    </div>
</template>
<script>
import { ref, defineComponent, onMounted, reactive } from 'vue'
import { AddOne, DeleteOne, DownOne } from '@icon-park/vue-next'
import { getAllPlugins } from '../../api'
import NewPlugin from '../../components/NewPlugin.vue'
import PluginList from '../../components/PluginList.vue'
import { useMessage, NPagination } from 'naive-ui'
import i18n from '../../lang/index'

export default defineComponent({
    components: {
        AddOne,
        DownOne,
        NewPlugin,
        NPagination,
        PluginList,
        DeleteOne,
    },
    setup() {
        const message = useMessage()
        const addPluginShow = ref(false)
        const checked = ref([])
        const filters = reactive({
            status: 'all',
        })
        const statusOptions = [{
            label: i18n.global.t('filter_none'),
            key: 'all',
        }, {
            label: i18n.global.t('enable_plugin'),
            key: '1',
        }, {
            label: i18n.global.t('disabled_plugin'),
            key: '0',
        }]
        const statusNameMap = statusOptions.reduce((pre, val) => {
            pre[val.key] = val.label
            return pre
        }, {})
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
        const page = ref({
            current: 1,
            pageSize: 6,
            count: 1,
        })
        // 获取数据
        const getData = async () => {
            const res = await getAllPlugins(page.value)
            if (res.code === 0) {
                const { rows, count } = res.data
                data.value = rows
                page.value.count = count
            } else {
                message.error(res.msg)
            }
        }
        const handleSelect = (key) => {
            filters.status = key
        }
        onMounted(() => {
            getData()
        })
        return {
            columns,
            data,
            statusOptions,
            handleSelect,
            ...toRefs(filters),
            page,
            message,
            checked,
            addPluginShow,
            statusNameMap,
        }
    },
})
</script>
<style lang="scss" scoped>
.plugin {
    box-sizing: border-box;
    background: #fff;

    &-header {
        position: relative;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: space-between;
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
        padding: 10px;

        .pg-box {
            padding-top: 30px;
        }
    }
}
</style>
