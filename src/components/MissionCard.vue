<template>
    <div :class="{'mission-card': true}">
        <div v-show="mission.percent == 0 && mission.protocolType === 'live'" class="badge">{{ $t('live') }}</div>
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
                        v-if="mission.status === '1'"
                        size="small"
                    >
                        <template #avatar>
                            <Icon name="speed" size="15" />
                        </template>
                        {{ mission.speed }}
                    </n-tag>

                    <n-tag
                        v-if="!['0', '5'].includes(mission.status)"
                        size="small"
                    >
                        <template #avatar>
                            <Icon name="fileSize" size="15" />
                        </template>
                        {{ mission.size }}
                    </n-tag>

                    <n-tag
                        v-if="mission.status === '0'"
                        size="small"
                    >
                        {{ $t('initial') }}
                    </n-tag>

                    <n-tag
                        size="small"
                    >
                        <template #avatar>
                            <Icon name="date" size="15" />
                        </template>
                        {{ mission.crt_tm }}
                    </n-tag>
                </div>
                <!-- delete mission -->
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
                <!-- resume mission -->
                <!-- <n-tooltip
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
                </n-tooltip> -->
                <!-- pause mission -->
                <!-- <n-tooltip
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
                </n-tooltip> -->
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
                            @click="stop(mission)"
                        >
                            <n-icon :component="Forbid"></n-icon>
                        </n-button>
                    </template>
                    <span>{{ $t('stop_download') }}</span>
                </n-tooltip>
                <!-- copy mission url -->
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
                :color="changeColor(themeVars.primaryColor, 0.6)"
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
import { Close, LinkTwo, ShuffleOne, Pause, Forbid } from '@icon-park/vue-next'
import { copyToClipboard } from '@/utils/index.js'
import i18n from '@/lang'

export default defineComponent({
    components: { NTooltip, NPopconfirm },
    props: {
        mission: {
            type: Object,
            default: () => ({}),
        },
    },
    emits: ['delMission', 'resume', 'stop'],
    setup(_, ctx) {
        const message = useMessage()
        const copyLink = (url) => {
            copyToClipboard(url)
            message.success(i18n.global.t('copyed_link'))
        }
        const delMission = (mission) => {
            ctx.emit('delMission', mission)
        }
        const resume = (mission) => {
            ctx.emit('resume', mission)
        }
        // stop mission
        const stop = (mission) => {
            ctx.emit('stop', mission)
        }
        const showError = ref(false)
        return {
            changeColor,
            themeVars: useThemeVars(),
            Close,
            LinkTwo,
            ShuffleOne,
            Pause,
            Forbid,
            copyLink,
            delMission,
            showError,
            resume,
            stop,
        }
    },
})
</script>
<style lang="scss" scoped>
@media screen and (max-width: 768px) {
    .mission-card-top {
        flex-direction: column;

        .mission-name {
            width: 100%;
            overflow: hidden;
            text-wrap: nowrap;
        }

        .btns {
            width: 100% !important;
        }

        .btns .tags {
            flex-wrap: wrap;
            width: 100% !important;
            padding: 0 !important;
        }

        .btns .tags > * {
            margin-top: 10px;
        }
    }
}

.mission-card {
    position: relative;
    box-sizing: border-box;
    padding: 20px;
    margin-bottom: 20px;
    overflow: hidden;
    border: 1px solid #e2e2e3;
    border-radius: 5px;

    .badge {
        position: absolute; /* 绝对定位 */
        top: -25px; /* 控制垂直位置 */
        right: -25px; /* 控制水平位置 */
        box-sizing: border-box;
        display: flex;
        align-items: flex-end;
        justify-content: center;
        width: 50px;
        height: 50px;
        padding-bottom: 5px;
        font-size: 10px;
        color: white;
        background-color: #7f7f7f;
        transform: rotate(45deg);
    }

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

            .tags {
                display: flex;
                align-items: center;
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
