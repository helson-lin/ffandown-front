<template>
    <div class="mission-card">
        <!-- top -->
        <div class="mission-card-top">
            <div class="mission-name">{{ mission.name }}</div>
            <div class="btns">
                <n-tooltip
                    :show-arrow="false"
                    placement="top"
                    trigger="hover"
                    class="m20"
                >
                    <template #trigger>
                        <n-button
                            circle
                            ghost
                            size="tiny"
                        >
                            <n-icon :component="Close"></n-icon>
                        </n-button>
                    </template>
                    <span>删除</span>
                </n-tooltip>
                <n-tooltip
                    :show-arrow="false"
                    placement="top"
                    trigger="hover"
                    class="m20"
                >
                    <template #trigger>
                        <n-button
                            circle
                            ghost
                            size="tiny"
                            @click="copyLink(mission.url)"
                        >
                            <n-icon :component="LinkTwo">
                            </n-icon>
                        </n-button>
                    </template>
                    <span>复制链接</span>
                </n-tooltip>
            </div>
        </div>
        <!-- bottom -->
        <div class="mission-card-bottom">
            <!-- progress -->
            <n-progress
                type="line"
                :color="themeVars.primaryColor"
                :rail-color="changeColor(themeVars.primaryColor, { alpha: 0.2 })"
                :percentage="mission.percent"
                :indicator-text-color="themeVars.textColorBase"
            />
        </div>
    </div>
</template>
<script>
import { defineComponent } from 'vue'
import { useThemeVars, useMessage, NTooltip } from 'naive-ui'
import { changeColor } from 'seemly'
import { Close, LinkTwo } from '@icon-park/vue-next'
import { copyToClipboard } from '@/utils/index.js'

export default defineComponent({
    components: { NTooltip },
    props: {
        mission: {
            type: Object,
            default: () => ({
                name: 'Jenkinsside 71477 Shemar Unions,Jenkinsside 71477 Shemar Unions,Jenkinsside 71477 Shemar Unions,Jenkinsside 71477 Shemar Unions,Jenkinsside 71477 Shemar UnionsJenkinsside 71477 Shemar UnionsJenkinsside 71477 Shemar UnionsJenkinsside 71477 Shemar UnionsJenkinsside 71477 Shemar Unions',
            }),
        },
    },
    setup() {
        const message = useMessage()
        const copyLink = (url) => {
            copyToClipboard(url)
            message.success('copyed link')
        }
        return {
            changeColor,
            themeVars: useThemeVars(),
            Close,
            LinkTwo,
            copyLink,
        }
    },
})
</script>
<style lang="scss" scoped>
.mission-card {
    box-sizing: border-box;
    padding: 20px;
    margin-bottom: 20px;
    border: 1px solid #e2e2e3;
    border-radius: 5px;

    &-top {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        width: 100%;

        .mission-name {
            flex: 1;
            line-height: 1.3em;
            text-overflow: wrap;
            white-space: wrap;
        }

        .btns {
            box-sizing: border-box;
            width: max-content;
            padding: 0 10px;

            // border: 1px solid #e3e3e3;
            border-radius: 999px;

            ::v-deep button {
                margin: 0 5px;

                &:hover {
                    color: #e2e2e3;
                    background-color: $primary-color;
                    border: none;
                }
            }

            ::v-deep svg {
                font-weight: bolder;
            }
        }
    }

    &-bottom {
        box-sizing: border-box;
        display: flex;
        width: 100%;
        padding: 10px 0;
    }
}
</style>
