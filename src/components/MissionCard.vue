<template>
    <div :class="{'mission-card': true}">
        <!-- top -->
        <div class="mission-card-top">
            <div class="mission-name">
                {{ mission.name }}
            </div>
            <div class="btns">
                <div class="tags">
                    <n-popconfirm v-if="mission.status === '4'" v-model:show="showError">
                        <template #trigger>
                            <n-tag
                                v-if="mission.status === '4'"
                                :bordered="false"
                                type="error"
                                size="small"
                                class="hover"
                                round
                            >
                                {{ $t('downlod_failed') }}
                            </n-tag>
                        </template>
                        <div class="msg">
                            {{ mission.message }}
                        </div>
                        <template #action>
                            <n-button size="small" @click="showError = false">
                                ok
                            </n-button>
                        </template>
                    </n-popconfirm>
                    <n-tag
                        v-if="['1', '3'].includes(mission.status)"
                        :bordered="false"
                        type="success"
                        size="small"
                        round
                    >
                        <template #avatar>
                            <n-avatar
                                src="https://file.helson-lin.cn/picgo-icons8-hdd-96.png"
                            />
                        </template>
                        {{ mission.size }}
                    </n-tag>

                    <n-tag
                        v-if="mission.status === '1'"
                        :bordered="false"
                        type="success"
                        size="small"
                        round
                    >
                        <template #avatar>
                            <n-avatar
                                src="https://file.helson-lin.cn/picgo-icons8-fan-speed-96.png"
                            />
                        </template>
                        {{ mission.speed }}
                    </n-tag>
                    <n-tag
                        v-if="mission.status === '0'"
                        :bordered="false"
                        size="small"
                        round
                    >
                        {{ $t('initial') }}
                    </n-tag>
                </div>
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
                            @click="delMission(mission)"
                        >
                            <n-icon :component="Close"></n-icon>
                        </n-button>
                    </template>
                    <span>  {{ $t('delete') }}</span>
                </n-tooltip>
                <n-tooltip
                    v-if="mission.status === '2'"
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
                            @click="resume(mission)"
                        >
                            <n-icon :component="ShuffleOne"></n-icon>
                        </n-button>
                    </template>
                    <span>{{ $t('resume_download') }}</span>
                </n-tooltip>
                <n-tooltip
                    v-if="mission.status === '1'"
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
                            @click="resume(mission)"
                        >
                            <n-icon :component="Pause"></n-icon>
                        </n-button>
                    </template>
                    <span>{{ $t('pause_download') }}</span>
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
                    <span>{{ $t('copy_link') }}</span>
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
import { defineComponent, ref } from 'vue'
import { useThemeVars, useMessage, NTooltip, NPopconfirm } from 'naive-ui'
import { changeColor } from 'seemly'
import { Close, LinkTwo, ShuffleOne, Pause } from '@icon-park/vue-next'
import { copyToClipboard } from '@/utils/index.js'

export default defineComponent({
    components: { NTooltip, NPopconfirm },
    props: {
        mission: {
            type: Object,
            default: () => ({}),
        },
    },
    emits: ['delMission', 'resume'],
    setup(_, ctx) {
        const message = useMessage()
        const copyLink = (url) => {
            copyToClipboard(url)
            message.success('copyed link')
        }
        const delMission = (mission) => {
            ctx.emit('delMission', mission)
        }
        const resume = (mission) => {
            ctx.emit('resume', mission)
        }
        const showError = ref(false)
        return {
            changeColor,
            themeVars: useThemeVars(),
            Close,
            LinkTwo,
            ShuffleOne,
            Pause,
            copyLink,
            delMission,
            showError,
            resume,
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

    &:hover {
        border: 1px solid $primary-color;
    }

    .hover {
        cursor: pointer;
    }

    &.error {
        box-shadow: inset 0 0 7px 1px #ffbf0098;
    }

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

        .tags {

            :deep .n-tag { margin-right: 10px; }
        }

        .msg {
            width: 200px;
            white-space: wrap;
        }

        .btns {
            box-sizing: border-box;
            display: flex;
            align-items: center;
            width: max-content;
            padding: 0 10px;

            // border: 1px solid #e3e3e3;
            border-radius: 999px;

            :deep button {
                margin: 0 5px;

                &:hover {
                    color: #e2e2e3;
                    background-color: $primary-color;
                    border: none;
                }
            }

            :deep svg {
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
