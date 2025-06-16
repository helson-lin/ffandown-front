<template>
    <div class="plugin">
        <div class="plugin-header">
            <div class="plugin-header-left flex">
                <n-button 
                    v-if="checked.length"
                    icon-placement="left"
                    class="mr1" 
                    @click="changePluginStatus('1')"
                >
                    {{ $t('enable_plugin') }}
                </n-button>
                <n-button 
                    v-if="checked.length"
                    icon-placement="left"
                    class="mr1" 
                    @click="changePluginStatus('0')"
                >
                    {{ $t('disabled_plugin') }}
                </n-button>
                <!-- 删除插件 -->
                <n-button 
                    v-if="checked.length"
                    icon-placement="left" 
                    type="error"
                    @click="deletePlugin"
                >
                    <template #icon>
                        <DeleteOne
                            size="18"
                            class="icon-park-icon"
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
                            class="icon-park-icon"
                        />
                    </template>
                    {{ $t('create_plugin') }}
                </n-button>
            </div>
            <div class="plugin-header-right">
                <div class="filter-item">
                    <n-dropdown trigger="hover" :options="statusOptions" @select="handleSelect">
                        <n-button ghost>
                            {{ $t('status') }}：{{ statusNameMap[status] }}
                            <down-one theme="filled" size="15" class="icon-park-icon" />
                        </n-button>
                    </n-dropdown>
                </div>
            </div>
        </div>
        <div class="plugin-content">
            <!-- 插件列表 -->
            <PluginList 
                v-model="checked" 
                :data="data" 
                @updateStatus="updateStatus" 
                @refresh="refresh"
            />
            <!-- 分页器-->
            <div class="pg-box">
                <n-pagination v-model:page="page.current" :page-count="page.count" :on-update:page="updatePg" />
            </div>
        </div>
        <!-- 新增插件 -->
        <NewPlugin 
            :show="addPluginShow"
            @update:show="addPluginShow = $event" 
            @refresh="refresh"
        />
    </div>
</template>
<script>
import { ref, defineComponent, onMounted, reactive } from 'vue'
import { AddOne, DeleteOne, DownOne } from '@icon-park/vue-next'
import { getAllPlugins, batchDelete, batchStatus } from '../../api'
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
            status: '1,0',
        })
        const statusOptions = [{
            label: i18n.global.t('filter_none'),
            key: '1,0',
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
            pageSize: 8,
            count: 1,
        })
        // 删除插件
        const deletePlugin = async () => {
            const res = await batchDelete({ uids: checked.value.join(',') })
            if (res.code === 0) {
                message.success(i18n.global.t('delete_success'))
                checked.value = []
                getData()
            }
        }
        // 修改状态
        const changePluginStatus = async (status) => {
            const res = await batchStatus({ uids: checked.value.join(','), status })
            if (res.code === 0) {
                checked.value = []
                message.success(i18n.global.t(status === '1' ? 'enable_plugin_success' : 'disabled_plugin_success'))
                getData()
            }
        }
        // 更新状态插件
        const updateStatus = async ({ uid, status }) => {
            const res = await batchStatus({ uids: uid, status })
            if (res.code === 0) {
                checked.value = []
                message.success(i18n.global.t(status === '1' ? 'enable_plugin_success' : 'disabled_plugin_success'))
                getData()
            } 
        }
        // 获取数据
        const getData = async () => {
            const res = await getAllPlugins({
                ...page.value,
                ...filters,
            })
            if (res.code === 0) {
                const { rows, total } = res.data
                data.value = rows
                page.value.count = total
            } else {
                message.error(res.message)
            }
        }
        // 状态筛选
        const handleSelect = (key) => {
            filters.status = key
            getData()
        }
        // 更新页码
        const updatePg = (currentPage) => {
            page.value.current = currentPage
            getData()
        }
        // 刷新列表
        const refresh = () => {
            getData()
        }
        onMounted(() => {
            getData()
        })
        return {
            columns,
            data,
            statusOptions,
            handleSelect,
            updatePg,
            ...toRefs(filters),
            page,
            message,
            checked,
            addPluginShow,
            statusNameMap,
            deletePlugin,
            refresh,
            updateStatus,
            changePluginStatus,
        }
    },
})
</script>
<style lang="scss" scoped>
.plugin {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    background-color: #fff;

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
            right: 20px;
            bottom: 0;
            left: 20px;
            display: block;
            height: 0;
            content: "";
            border-bottom: 1px solid rgb(0 0 0 / 6%);
            transition: all .3s ease;
        }
    }

    &-content {
        display: flex;
        flex: 1;
        flex-direction: column;

        .plugin-list {
            flex: 1;
        }

        .pg-box {
            padding: 25px 0 16px 20px;
            border-top: 1px solid rgb(0 0 0 / 6%);

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
    }
}

// 暗色模式支持
@media (prefers-color-scheme: dark) {
    .plugin {
        background: rgb(255 255 255 / 2%);
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

// 移动端适配
@media screen and (max-width: 768px) {
    .pg-box {
        padding: 12px;
    }
}

// 平板适配
@media screen and (min-width: 769px) and (max-width: 1024px) {
    .pg-box {
        padding: 14px;
    }
}
</style>
