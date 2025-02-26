<template>
    <div class="mission-card" @click="showDetail = !showDetail">
        <div v-show="mission.percent == 0 && mission.protocolType === 'live'" class="badge">{{ $t('live') }}</div>
        <!-- top -->
        <div class="mission-card-top">
            <div class="mission-name">
                {{ mission.name }}
            </div>
            <div class="btns">
                <div class="tags" @click.stop>
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
                            <n-button size="small" @click.stop="showError = false">
                                {{ $t('confirm') }}
                            </n-button>
                        </template>
                    </n-popconfirm>
                    <!-- 下载速度标签 --> 
                    <n-tag
                        v-if="mission.status === '1'"
                        size="small"
                    >
                        <template #avatar>
                            <Icon name="speed" :size="15" />
                        </template>
                        {{ mission.speed }}
                    </n-tag>
                    <!-- 文件大小标签 --> 
                    <n-tag
                        v-if="!['0', '5'].includes(mission.status) && mission.size"
                        size="small"
                    >
                        <template #avatar>
                            <Icon name="fileSize" :size="15" />
                        </template>
                        {{ mission.size }}
                    </n-tag>
                    <!-- 初始化状态标签 --> 
                    <n-tag
                        v-if="mission.status === '0'"
                        size="small"
                    >
                        {{ $t('initial') }}
                    </n-tag>
                    <!-- 创建时间标签 --> 
                    <n-tag
                        size="small"
                    >
                        <template #avatar>
                            <Icon name="date" :size="15" />
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
                            @click.stop="delMission(mission)"
                        >
                            <n-icon :component="Close"></n-icon>
                        </n-button>
                    </template>
                    <span>  {{ $t('delete') }}</span>
                </n-tooltip>
                <!-- resume mission -->
                <n-tooltip
                    v-if="mission.status === '4'"
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
                            @click.stop="stop(mission)"
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
                            @click.stop="copyLink(mission.url)"
                        >
                            <n-icon :component="LinkTwo">
                            </n-icon>
                        </n-button>
                    </template>
                    <span>{{ $t('copy_link') }}</span>
                </n-tooltip>
            </div>
        </div>
        <!-- bottom 卡片底部信息 -->
        <div class="mission-card-bottom">
            <!-- progress 进度条 -->
            <n-progress
                type="line"
                :color="changeColor(themeVars.primaryColor, 0.6)"
                :rail-color="changeColor(themeVars.primaryColor, { alpha: 0.2 })"
                :percentage="mission.percent"
                :indicator-text-color="themeVars.textColorBase"
            />
        </div>
        <n-collapse-transition :show="showDetail">
            <div class="mission-info" @click.stop>
                <div v-for="detailKey in detailKeys" :key="detailKey" class="mission-info-item">
                    <div class="mission-info-item-label">{{ $t(detailKey) }}: </div>
                    <div class="mission-info-item-value">{{ mission[detailKey] || '' }}</div>
                </div>
            </div>
        </n-collapse-transition>
    </div>
</template>
<script>
import { defineComponent, ref } from 'vue'
import { useThemeVars, useMessage, NTooltip, NPopconfirm, NCollapseTransition } from 'naive-ui'
import { changeColor } from 'seemly'
import { Close, LinkTwo, ShuffleOne, Pause, Forbid } from '@icon-park/vue-next'
import { copyToClipboard } from '@/utils/index.js'
import i18n from '@/lang'

export default defineComponent({
    components: { NTooltip, NPopconfirm, NCollapseTransition },
    props: {
        mission: {
            type: Object,
            default: () => ({}),
        },
    },
    emits: ['delMission', 'resume', 'stop'],
    setup(_, ctx) {
        const message = useMessage()
        // 展示更多信息
        const showDetail = ref(false)
        const detailKeys = ['outputformat', 'preset', 'useragent', 'timemark', 'filePath']
        // 复制
        const copyLink = (url) => {
            copyToClipboard(url)
            message.success(i18n.global.t('copyed_link'))
        }
        // 删除任务
        const delMission = (mission) => {
            ctx.emit('delMission', mission)
        }
        // 恢复下载任务
        const resume = (mission) => {
            ctx.emit('resume', mission)
        }
        // stop mission 暂停任务
        const stop = (mission) => {
            ctx.emit('stop', mission)
        }
        // 显示错误信息
        const showError = ref(false)
        return {
            changeColor,
            themeVars: useThemeVars(),
            showDetail,
            detailKeys,
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
    .msg {
        max-width: 100%;
        line-height: 22px;
        white-space: wrap;
    }

    .mission-card-top {
        flex-direction: column;

        .mission-name {
            width: 100%;
        }

        .btns {
            width: 100% !important;
            padding: 0 !important;
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

.msg {
    max-width: 500px;
    line-height: 22px;
    white-space: wrap;
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
            overflow: hidden;
            line-height: 1.3em;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .tags {

            :deep .n-tag { margin-right: 10px; }
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

    .mission-info {

        // padding: 10px 0;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        margin-top: 10px;
        border-top: 1px solid #eee;
        border-bottom: 1px solid #eee;

        &-item {
            display: flex;
            align-items: center;
            width: 100%;
            padding: 10px 0;
            border-bottom: 1px solid #eee;

            &:last-child {
                border-bottom: none;
            }

            &-label {
                width: 70px;
                margin-right: 20px;
            }

            &-value {
                flex: 1;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }
    }
}
</style>
