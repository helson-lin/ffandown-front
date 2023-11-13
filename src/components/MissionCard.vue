<template>
    <div class="mission-card">
        <!-- top -->
        <div class="mission-card-top">
            <div class="mission-name">{{ mission.name }}</div>
            <div class="btns">
                <n-button
                    circle
                    ghost
                    size="tiny"
                    class="m20"
                >
                    <n-icon :component="Close"></n-icon>
                </n-button>
                <n-button circle ghost size="tiny">
                    <n-icon :component="LinkTwo">
                    </n-icon>
                </n-button>
            </div>
        </div>
        <!-- bottom -->
        <div class="mission-card-bottom">
            <!-- progress -->
            <n-progress
                type="line"
                :color="themeVars.primaryColor"
                :rail-color="changeColor(themeVars.primaryColor, { alpha: 0.2 })"
                :percentage="20"
                :indicator-text-color="themeVars.textColorBase"
            />
        </div>
    </div>
</template>
<script>
import { defineComponent } from 'vue'
import { useThemeVars } from 'naive-ui'
import { changeColor } from 'seemly'
import { Close, LinkTwo } from '@icon-park/vue-next'

export default defineComponent({
    props: {
        mission: {
            type: Object,
            default: () => ({
                name: 'Jenkinsside 71477 Shemar Unions,Jenkinsside 71477 Shemar Unions,Jenkinsside 71477 Shemar Unions,Jenkinsside 71477 Shemar Unions,Jenkinsside 71477 Shemar UnionsJenkinsside 71477 Shemar UnionsJenkinsside 71477 Shemar UnionsJenkinsside 71477 Shemar UnionsJenkinsside 71477 Shemar Unions',
            }),
        },
    },
    setup() {
        return {
            changeColor,
            themeVars: useThemeVars(),
            Close,
            LinkTwo,
        }
    },
})
</script>
<style lang="scss" scoped>
.mission-card {
    box-sizing: border-box;
    padding: 20px;
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
