<template>
    <div class="controller-panel">
        <!-- header -->
        <div class="header">
            <!-- status manage -->
            <div class="header-top">
                <Icon name="setting" />
                <div class="logo">ffandown</div>
                <Icon name="add" />
            </div>
            <div class="header-bar">
                <!-- 过滤条件 -->
            </div>
            <!-- 任务：添加/管理 -->
            <!-- 状态筛选 -->
        </div>
        <div class="container"></div>
    </div>
</template>
<script>
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'MobileHome',
    components: {
    },
})
</script>
<style lang="scss" scoped>
.controller-panel {
    width: 100%;
    height: 100%;
    background-color: #f2f2f2;

    .header {
        width: 100%;
        height: 4rem;
        background-color: #ffff;

        &-top {
            box-sizing: border-box;
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
            padding: 2rem 1rem;

            .logo {
                font-family: "Oleo Script", Arial, sans-serif;
            }
        }
    }
}
</style>
