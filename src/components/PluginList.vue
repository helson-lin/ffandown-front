<template>
    <div class="plugin-list">
        <n-checkbox-group v-model:value="checkList">
            <div v-for="plugin in data" :key="plugin.uid" class="plugin">
                <div class="plugin-left">
                    <n-checkbox :value="plugin.uid" size="large"></n-checkbox>
                    <div class="plugin-left-logo">
                        <img :src="DefaultPluginLogo" alt="" srcset="">
                    </div>
                    <div class="plugin-left-baseinfo">
                        <div class="plugin-name">{{ plugin.name }}</div>
                        <div class="plugin-desc">{{ plugin.description }}</div>
                    </div>
                </div>
                <div class="plugin-right">
                    <div class="author leading">@{{ plugin.author }}</div>
                    <div class="crt leading">{{ plugin.crt_tm }}</div>
                    <n-switch 
                        v-model:value="plugin.status" 
                        checked-value="1" 
                        unchecked-value="0" 
                        @update:value="(status) => updateStatus(plugin?.uid, status)" 
                    />
                </div>
            </div>
        </n-checkbox-group>
    </div>
</template>
<script>
import { computed, defineComponent } from 'vue'
import DefaultPluginLogo from '@/assets/imgs/plugin_default.png'

export default defineComponent({
    props: {
        data: {
            type: Array,
            default: () => ([]),
        },
        modelValue: {
            type: Array,
            default: () => ([]),
        },
    },
    emits: ['update:modelValue', 'updateStatus'],
    setup(props, ctx) {
        const checkList = computed({
            get() {
                return props.modelValue
            },
            set(value) {
                ctx.emit('update:modelValue', value)
            },
        })
        const updateStatus = (uid, status) => {
            ctx.emit('updateStatus', { uid, status })
        }
        return {
            DefaultPluginLogo,
            checkList,
            updateStatus,
        }
    },
})
</script>
<style lang="scss" scoped>
.plugin-list {
    display: flex;
    flex-direction: column;
    border-bottom: 1px solid #e2e2e3;

    .plugin {
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 0;

        // border-bottom: 1px solid #e2e2e3;
        border-top: 1px solid #e2e2e3;

        &-left {
            display: flex;
            align-items: center;

            &-logo {
                width: 40px;
                height: 40px;
                margin-left: 10px;
                background: #ccc;
                border-radius: 10px;

                img {
                    width: 100%;
                    height: 100%;
                }
            }

            &-baseinfo {
                margin-left: 10px;

                .plugin-name {
                    font-weight: 500;
                    line-height: 1.5;
                }

                .plugin-desc {
                    font-size: 12px;
                    line-height: 1.5;
                    color: #999;
                }
            }
        }

        &-right {
            display: flex;
            align-items: center;

            .leading {
                margin-right: 10px;
                font-size: 12px;
                line-height: 1.5;
                color: #999;
            }
        }
    }
}
</style>
