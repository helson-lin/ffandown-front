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
                    <!-- 视频质量--> 
                    <n-tag
                        size="small"
                    >
                        <template #avatar>
                            <Icon name="preset" :size="15" />
                        </template>
                        {{ mission.preset }}
                    </n-tag>
                    <!-- 视频格式--> 
                    <n-tag
                        size="small"
                    >
                        <template #avatar>
                            <Icon name="video" :size="17" />
                        </template>
                        {{ mission.outputformat }}
                    </n-tag>
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
                            <Icon name="storage" :size="12" />
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
                        {{ transformTm(mission.crt_tm) }}
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
                            <n-icon :component="Close" class="icon-park-icon"></n-icon>
                        </n-button>
                    </template>
                    <span>  {{ $t('delete') }}</span>
                </n-tooltip>
                <!-- resume mission -->
                <!-- <n-tooltip
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
                            @click.stop="stop(mission)"
                        >
                            <n-icon :component="Forbid" class="icon-park-icon"></n-icon>
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
                            <n-icon :component="LinkTwo" class="icon-park-icon">
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
import { Close, LinkTwo, ShuffleOne, Pause, Forbid, PlayOne } from '@icon-park/vue-next'
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
        // 转换时间戳
        const transformTm = (tmStr) => new Date(tmStr).toLocaleString()
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
            PlayOne,
            showError,
            copyLink,
            delMission,
            transformTm,
            resume,
            stop,
        }
    },
})
</script>

<style lang="scss" scoped>
.mission-card {
    position: relative;
    box-sizing: border-box;
    padding: 20px;
    margin-bottom: 16px;
    overflow: hidden;
    background: #fff;
    border: 1px solid rgb(0 0 0 / 6%);
    border-radius: 8px;
    box-shadow: 0 1px 3px rgb(0 0 0 / 2%);
    transition: all .2s ease;

    .badge {
        position: absolute;
        top: -24px;
        right: -24px;
        box-sizing: border-box;
        display: flex;
        align-items: flex-end;
        justify-content: center;
        width: 48px;
        height: 48px;
        padding-bottom: 4px;
        font-size: 11px;
        font-weight: 500;
        color: white;
        background-color: #666;
        box-shadow: 0 1px 2px rgb(0 0 0 / 8%);
        transform: rotate(45deg);
    }

    &:hover {
        border-color: $primary-color;
        box-shadow: 0 2px 6px rgb(0 0 0 / 4%);
        transform: translateY(-1px);
    }

    .hover {
        cursor: pointer;
        transition: opacity .2s ease;

        &:hover {
            opacity: .8;
        }
    }

    &.error {
        background: rgb(255 77 79 / 2%);
        box-shadow: inset 0 0 0 1px rgb(255 77 79 / 15%);
    }

    &-top {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        width: 100%;
        margin-bottom: 12px;

        .mission-name {
            flex: 1;
            margin-right: 16px;
            overflow: hidden;
            font-size: 15px;
            font-weight: 500;
            line-height: 1.4;
            color: rgb(0 0 0 / 85%);
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .tags {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;

            :deep .n-tag {
                height: 22px;
                padding: 0 6px;
                margin: 0;
                font-size: 12px;
                line-height: 20px;
                background: rgb(0 0 0 / 3%);
                border: none;
                border-radius: 4px;

                &:hover {
                    background: rgb(0 0 0 / 6%);
                }
            }
        }

        .btns {
            box-sizing: border-box;
            display: flex;
            gap: 4px;
            align-items: center;
            padding: 2px;
            background: rgb(0 0 0 / 2%);
            border-radius: 6px;

            :deep button {
                width: 26px;
                height: 26px;
                margin: 0;
                transition: all .2s ease;

                &:hover {
                    color: #fff;
                    background-color: $primary-color;
                    transform: scale(1.05);
                }
            }

            .tags {
                display: flex;
                align-items: center;
            }

            :deep svg {
                font-weight: 500;
            }
        }
    }

    &-bottom {
        box-sizing: border-box;
        display: flex;
        width: 100%;
        padding: 8px 0;

        :deep .n-progress {
            .n-progress-rail {
                height: 4px;
                border-radius: 2px;
            }

            .n-progress-fill {
                border-radius: 2px;
            }
        }
    }

    .mission-info {
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        padding: 12px;
        margin-top: 12px;
        background: rgb(0 0 0 / 2%);
        border-radius: 6px;

        &-item {
            display: flex;
            align-items: center;
            width: 100%;
            padding: 8px 0;
            border-bottom: 1px solid rgb(0 0 0 / 4%);

            &:last-child {
                padding-bottom: 0;
                border-bottom: none;
            }

            &:first-child {
                padding-top: 0;
            }

            &-label {
                width: 80px;
                margin-right: 16px;
                font-size: 12px;
                color: rgb(0 0 0 / 45%);
            }

            &-value {
                flex: 1;
                overflow: hidden;
                font-size: 12px;
                color: rgb(0 0 0 / 85%);
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }
    }
}

@media screen and (max-width: 768px) {
    .mission-card {
        padding: 14px;
        margin-bottom: 12px;
        border-radius: 6px;

        .badge {
            top: -16px;
            right: -16px;
            width: 32px;
            height: 32px;
            font-size: 10px;
        }

        .msg {
            max-width: 100%;
            padding: 8px;
            font-size: 12px;
            line-height: 1.4;
            white-space: normal;
        }

        .mission-card-top {
            flex-direction: column;
            gap: 10px;
            margin-bottom: 10px;

            .mission-name {
                width: 100%;
                margin-bottom: 0;
                font-size: 14px;
                line-height: 1.4;
            }

            .btns {
                flex-wrap: wrap;
                gap: 6px;
                justify-content: space-between;
                width: 100%;
                padding: 6px 0;
                background: none;

                .tags {
                    gap: 4px;
                    justify-content: flex-start;
                    width: 100%;
                    margin-bottom: 6px;

                    :deep .n-tag {
                        height: 20px;
                        padding: 0 4px;
                        font-size: 11px;
                        line-height: 18px;
                    }
                }

                :deep button {
                    width: 22px;
                    height: 22px;
                }
            }
        }

        .mission-card-bottom {
            padding: 6px 0;

            :deep .n-progress {
                .n-progress-rail {
                    height: 3px;
                }
            }
        }

        .mission-info {
            padding: 10px;
            margin-top: 10px;
            border-radius: 4px;

            &-item {
                flex-wrap: wrap;
                padding: 6px 0;

                &-label {
                    margin-right: 0;
                    margin-bottom: 2px;
                    font-size: 11px;
                }

                &-value {
                    padding-left: 0;
                    font-size: 11px;
                }
            }
        }
    }
}

// 暗色模式支持
@media (prefers-color-scheme: dark) {
    .mission-card {
        background: rgb(255 255 255 / 2%);
        border-color: rgb(255 255 255 / 6%);
        box-shadow: 0 1px 3px rgb(0 0 0 / 20%);

        &:hover {
            background: rgb(255 255 255 / 3%);
            border-color: $primary-color;
            box-shadow: 0 2px 6px rgb(0 0 0 / 30%);
        }

        .badge {
            background-color: #4a4a4a;
            box-shadow: 0 1px 2px rgb(0 0 0 / 20%);
        }

        &.error {
            background: rgb(255 77 79 / 4%);
            box-shadow: inset 0 0 0 1px rgb(255 77 79 / 25%);
        }

        .mission-card-top {
            .mission-name {
                color: rgb(255 255 255 / 90%);
            }

            .tags {
                :deep .n-tag {
                    color: rgb(255 255 255 / 85%);
                    background: rgb(255 255 255 / 4%);

                    &:hover {
                        background: rgb(255 255 255 / 8%);
                    }

                    .n-tag__avatar {
                        color: rgb(255 255 255 / 65%);
                    }
                }
            }

            .btns {
                background: rgb(255 255 255 / 3%);

                :deep button {
                    color: rgb(255 255 255 / 65%);
                    border-color: rgb(255 255 255 / 10%);

                    &:hover {
                        color: #fff;
                        background-color: $primary-color;
                        border-color: $primary-color;
                    }
                }

                :deep svg {
                    color: rgb(255 255 255 / 65%);
                }
            }
        }

        .mission-card-bottom {
            :deep .n-progress {
                .n-progress-rail {
                    background-color: rgb(255 255 255 / 6%);
                }

                .n-progress-fill {
                    background-color: $primary-color;
                }

                .n-progress-indicator {
                    color: rgb(255 255 255 / 65%);
                }
            }
        }

        .mission-info {
            background: rgb(255 255 255 / 2%);
            border: 1px solid rgb(255 255 255 / 4%);

            &-item {
                border-bottom-color: rgb(255 255 255 / 4%);

                &:last-child {
                    border-bottom: none;
                }

                &-label {
                    color: rgb(255 255 255 / 45%);
                }

                &-value {
                    color: rgb(255 255 255 / 85%);
                }
            }
        }

        .hover {
            &:hover {
                opacity: .9;
            }
        }
    }

    // 错误提示弹窗样式
    :deep(.n-popconfirm) {
        .n-popconfirm__content {
            background-color: #1a1a1a;
            border: 1px solid rgb(255 255 255 / 6%);
            box-shadow: 0 2px 6px rgb(0 0 0 / 30%);
        }

        .msg {
            color: rgb(255 255 255 / 85%);
        }

        .n-button {
            color: rgb(255 255 255 / 85%);
            background-color: rgb(255 255 255 / 4%);
            border-color: rgb(255 255 255 / 10%);

            &:hover {
                background-color: rgb(255 255 255 / 8%);
            }
        }
    }

    // 工具提示样式
    :deep(.n-tooltip) {
        .n-tooltip__content {
            color: rgb(255 255 255 / 85%);
            background-color: #1a1a1a;
            border: 1px solid rgb(255 255 255 / 6%);
            box-shadow: 0 2px 6px rgb(0 0 0 / 30%);
        }
    }
}

// 移动端暗色模式适配
@media screen and (max-width: 768px) {
    @media (prefers-color-scheme: dark) {
        .mission-card {
            .mission-card-top {
                .btns {
                    background: none;

                    :deep button {
                        background: rgb(255 255 255 / 4%);
                    }
                }
            }

            .mission-info {
                background: rgb(255 255 255 / 2%);
            }
        }
    }
}
</style>
