<template>
    <n-config-provider 
        :theme="theme"
        :theme-overrides="themeOverrides" 
        :locale="locale" 
        :date-locale="dateLocale"
    >
        <n-message-provider>
            <n-dialog-provider>
                <router-view></router-view>
            </n-dialog-provider>
        </n-message-provider>
    </n-config-provider>
</template>
<script setup>

import { 
    NConfigProvider, 
    NMessageProvider, 
    NDialogProvider, 
    zhCN, 
    dateZhCN, 
    enUS, 
    dateEnUS,
    darkTheme,
} from 'naive-ui'
import { useStore } from './store'
import { useRouter, useRoute } from 'vue-router'
import { watch, ref, onMounted, onUnmounted } from 'vue'

// 主题配置
const theme = ref(null)

// 检测系统主题
const checkSystemTheme = () => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        theme.value = darkTheme
    } else {
        theme.value = null
    }
}

// 监听系统主题变化
let mediaQuery = null

onMounted(() => {
    checkSystemTheme()
    
    if (window.matchMedia) {
        mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
        mediaQuery.addEventListener('change', checkSystemTheme)
    }
})

onUnmounted(() => {
    if (mediaQuery) {
        mediaQuery.removeEventListener('change', checkSystemTheme)
    }
})

/**
   * js 文件下使用这个做类型提示
   * @type import('naive-ui').GlobalThemeOverrides
   */
const themeOverrides = {
    common: {
        primaryColor: '#b78affff',
        primaryColorHover: '#a8a4ffff', 
        iconColor: '#b78affff',
        pressedColor: '#a8a4ff',
        warningColor: '#cd3f01',
        warningColorHover: '#b41901',
        warningColorPressed: '#cd1d01',
        warningColorSuppl: '#b41901',
        primaryColorSuppl: '#b78aff',
        textColorPressedPrimary: '#a8a4ff',
        infoColor: '#70c0e8',
        successColor: '#63e2b7',
        errorColor: '#e88080',
    },
    Button: {
        backgroundColor: '#b78aff',
        activeColor: '#b78aff',
        colorPressedPrimary: '#a8a4ff',
        borderPressedPrimary: '#a8a4ff',
        // 暗色模式下的按钮样式
        textColorGhost: '#b78aff',
        textColorGhostHover: '#a8a4ff',
        textColorPressed: '#a8a4ff',
        textColorTextPressed: '#a8a4ff',
        textColorGhostPressed: '#9d95ff',
        textColorGhostPressedPrimary: '#a8a4ff',
        // 按钮边框优化
        border: '1px solid rgba(0, 0, 0, 0.12)',
        borderHover: '1px solid #b78aff',
        borderPressed: '1px solid #a8a4ff',
        borderFocus: '1px solid #b78aff',
        // 幽灵按钮边框
        borderGhost: '1px solid rgba(0, 0, 0, 0.15)',
        borderGhostHover: '1px solid #b78aff',
        borderGhostPressed: '1px solid #a8a4ff',
        borderGhostFocus: '1px solid #b78aff',
        // 圆角优化
        borderRadius: '6px',
        borderRadiusSmall: '4px',
        borderRadiusLarge: '8px',
        // 阴影效果
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
        boxShadowHover: '0 2px 4px rgba(0, 0, 0, 0.1)',
        boxShadowPressed: '0 1px 2px rgba(0, 0, 0, 0.1)',
        boxShadowFocus: '0 0 0 2px rgba(183, 138, 255, 0.2)',
        // 文字颜色
        textColorPrimary: '#ffffff',
        textColorHoverPrimary: '#ffffff',
        textColorPressedPrimary: '#ffffff',
        textColorFocusPrimary: '#ffffff',
        // 默认按钮
        colorHover: 'rgba(0, 0, 0, 0.02)',
        colorPressed: 'rgba(0, 0, 0, 0.05)',
        colorFocus: 'rgba(0, 0, 0, 0.02)',
        // 高度和内边距
        heightTiny: '24px',
        heightSmall: '28px',
        heightMedium: '32px',
        heightLarge: '36px',
        paddingTiny: '0 8px',
        paddingSmall: '0 12px',
        paddingMedium: '0 16px',
        paddingLarge: '0 20px',
    },
    Dialog: {
        backgroundColor: '#b78aff',
        activeColor: '#b78aff',
        peers: {
            InternalSelection: {
                backgroundColor: '#b78aff',
                textCOlor: '#b78aff',
            },
            InternalSelectMenu: {
                borderRadius: '6px',
            },
        },
    },
    Card: {
        borderRadius: '8px',
    },
    Input: {
        borderRadius: '6px',
    },
    Select: {
        peers: {
            InternalSelection: {
                borderRadius: '6px',
            },
        },
    },
    Dropdown: {
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    },
    Popover: {
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    },
    Modal: {
        borderRadius: '12px',
    },
    Notification: {
        borderRadius: '8px',
    },
    Message: {
        borderRadius: '6px',
    },
    Progress: {
        railColor: 'rgba(0, 0, 0, 0.08)',
        fillColor: '#b78aff',
    },
    Tag: {
        borderRadius: '6px',
    },
}

const language = navigator.language
const locale = computed(() => (language === 'zh-CN' ? zhCN : enUS))
const dateLocale = computed(() => (language === 'zh-CN' ? dateZhCN : dateEnUS))
const store = useStore()
const router = useRouter()
const route = useRoute()

watch(() => store.authed, (newValue) => {
    if (!newValue) {
        router.push({ 
            path: '/login', 
            query: {
                redirect: route.path,
            },
        }) // 跳转到登录页,并且携带当前路由参数
    }
}, {
    immediate: true,
})
</script>
<style lang='scss'>
@import "./assets/css/reset.css";

// 全局样式
.n-config-provider {
    width: 100%;
    height: 100%;
}

:host {
    --n-text-color-pressed: #a8a4ff !important;
}

// 亮色模式样式
.n-dialog .n-dialog__icon {
    color: #b78aff !important;
}

.n-dialog .n-button--success-type {
    background-color: #b78aff !important;
    border: 0 solid #b78aff !important;
    outline: none;
}

.n-button--success-type .n-button__border {
    border: 1px solid #b78aff !important;
}

.n-button .n-button__state-border {
    color: #b78aff !important;
    border: 1px solid #efefef !important;
}

// 暗色模式样式
@media (prefers-color-scheme: dark) {
    // 全局背景和文字颜色
    body {
        color: rgb(255 255 255 / 82%);
        background-color: #101014;
    }

    // 对话框暗色模式
    .n-dialog {
        background-color: rgb(255 255 255 / 9%) !important;

        .n-dialog__title {
            color: rgb(255 255 255 / 90%) !important;
        }

        .n-dialog__content {
            color: rgb(255 255 255 / 82%) !important;
        }
    }

    // 按钮暗色模式
    .n-button {
        &--ghost {
            border-color: rgb(255 255 255 / 24%) !important;

            &:hover {
                border-color: #b78aff !important;
            }
        }
    }

    // 输入框暗色模式
    .n-input {
        background-color: rgb(255 255 255 / 9%) !important;
        border-color: rgb(255 255 255 / 24%) !important;

        &:hover {
            border-color: rgb(255 255 255 / 36%) !important;
        }

        &:focus-within {
            border-color: #b78aff !important;
        }
    }

    // 选择器暗色模式
    .n-select {
        .n-base-selection {
            background-color: rgb(255 255 255 / 9%) !important;
            border-color: rgb(255 255 255 / 24%) !important;

            &:hover {
                border-color: rgb(255 255 255 / 36%) !important;
            }

            &.n-base-selection--focus {
                border-color: #b78aff !important;
            }
        }
    }

    // 下拉菜单暗色模式
    .n-dropdown-menu {
        background-color: rgb(72 72 78 / 90%) !important;
        backdrop-filter: blur(12px);
        border: 1px solid rgb(255 255 255 / 18%) !important;

        .n-dropdown-option {
            color: rgb(255 255 255 / 82%) !important;

            &:hover {
                background-color: rgb(255 255 255 / 9%) !important;
            }

            &--active {
                color: #b78aff !important;
                background-color: rgb(184 138 255 / 15%) !important;
            }
        }
    }

    // 弹出框暗色模式
    .n-popover {
        background-color: rgb(72 72 78 / 90%) !important;
        backdrop-filter: blur(12px);
        border: 1px solid rgb(255 255 255 / 18%) !important;

        .n-popover__content {
            color: rgb(255 255 255 / 82%) !important;
        }
    }

    // 工具提示暗色模式
    .n-tooltip {
        .n-tooltip__content {
            color: rgb(255 255 255 / 82%) !important;
            background-color: rgb(72 72 78 / 90%) !important;
            border: 1px solid rgb(255 255 255 / 18%) !important;
            backdrop-filter: blur(12px);
        }
    }

    // 消息暗色模式
    .n-message {
        color: rgb(255 255 255 / 82%) !important;
        background-color: rgb(72 72 78 / 90%) !important;
        border: 1px solid rgb(255 255 255 / 18%) !important;
        backdrop-filter: blur(12px);
    }

    // 通知暗色模式
    .n-notification {
        background-color: rgb(72 72 78 / 90%) !important;
        backdrop-filter: blur(12px);
        border: 1px solid rgb(255 255 255 / 18%) !important;

        .n-notification__content {
            color: rgb(255 255 255 / 82%) !important;
        }

        .n-notification__title {
            color: rgb(255 255 255 / 90%) !important;
        }
    }

    // 模态框暗色模式
    .n-modal {
        .n-card {
            background-color: rgb(255 255 255 / 9%) !important;
            border: 1px solid rgb(255 255 255 / 18%) !important;
        }
    }

    // 分页器暗色模式
    .n-pagination {
        .n-pagination-item {
            color: rgb(255 255 255 / 82%) !important;
            background-color: rgb(255 255 255 / 9%) !important;
            border-color: rgb(255 255 255 / 24%) !important;

            &:hover {
                background-color: rgb(255 255 255 / 16%) !important;
            }

            &--active {
                color: #fff !important;
                background-color: #b78aff !important;
                border-color: #b78aff !important;
            }
        }
    }

    // 进度条暗色模式
    .n-progress {
        .n-progress-rail {
            background-color: rgb(255 255 255 / 16%) !important;
        }
    }

    // 标签暗色模式
    .n-tag {
        color: rgb(255 255 255 / 82%) !important;
        background-color: rgb(255 255 255 / 9%) !important;
        border-color: rgb(255 255 255 / 24%) !important;
    }
}

// 平滑过渡动画
* {
    transition: background-color .3s ease, border-color .3s ease, color .3s ease;
}

// icon-park 图标暗黑模式适配
.icon-park-icon {
    transition: fill .3s ease, stroke .3s ease, color .3s ease;
}

// 暗色模式下的图标颜色调整
@media (prefers-color-scheme: dark) {
    // icon-park 图标自动适配
    .icon-park-icon,
    [class*="icon-park"] {
        color: rgb(255 255 255 / 65%) !important;

        // 默认图标颜色
        fill: rgb(255 255 255 / 65%) !important;
        stroke: rgb(255 255 255 / 65%) !important;

        // 悬停状态
        &:hover {
            color: rgb(255 255 255 / 85%) !important;
            fill: rgb(255 255 255 / 85%) !important;
            stroke: rgb(255 255 255 / 85%) !important;
        }
    }

    // 主色调图标（保持品牌色）
    .icon-park-primary,
    .icon-park-icon--primary {
        color: #b78aff !important;
        fill: #b78aff !important;
        stroke: #b78aff !important;

        &:hover {
            color: #a8a4ff !important;
            fill: #a8a4ff !important;
            stroke: #a8a4ff !important;
        }
    }

    // 成功状态图标
    .icon-park-success,
    .icon-park-icon--success {
        color: #63e2b7 !important;
        fill: #63e2b7 !important;
        stroke: #63e2b7 !important;
    }

    // 警告状态图标
    .icon-park-warning,
    .icon-park-icon--warning {
        color: #f2c97d !important;
        fill: #f2c97d !important;
        stroke: #f2c97d !important;
    }

    // 错误状态图标
    .icon-park-error,
    .icon-park-icon--error {
        color: #e88080 !important;
        fill: #e88080 !important;
        stroke: #e88080 !important;
    }

    // 信息状态图标
    .icon-park-info,
    .icon-park-icon--info {
        color: #70c0e8 !important;
        fill: #70c0e8 !important;
        stroke: #70c0e8 !important;
    }

    // 按钮中的图标
    .n-button {
        .icon-park-icon,
        [class*="icon-park"] {
            color: currentcolor !important;
            fill: currentcolor !important;
            stroke: currentcolor !important;
        }

        // 主要按钮中的图标
        &--primary {
            .icon-park-icon,
            [class*="icon-park"] {
                color: #fff !important;
                fill: #fff !important;
                stroke: #fff !important;
            }
        }

        // 幽灵按钮中的图标
        &--ghost {
            .icon-park-icon,
            [class*="icon-park"] {
                color: rgb(255 255 255 / 65%) !important;
                fill: rgb(255 255 255 / 65%) !important;
                stroke: rgb(255 255 255 / 65%) !important;
            }

            &:hover {
                .icon-park-icon,
                [class*="icon-park"] {
                    color: #b78aff !important;
                    fill: #b78aff !important;
                    stroke: #b78aff !important;
                }
            }
        }
    }

    // 导航和菜单中的图标
    .n-menu {
        .icon-park-icon,
        [class*="icon-park"] {
            color: rgb(255 255 255 / 65%) !important;
            fill: rgb(255 255 255 / 65%) !important;
            stroke: rgb(255 255 255 / 65%) !important;
        }

        .n-menu-item--selected {
            .icon-park-icon,
            [class*="icon-park"] {
                color: #b78aff !important;
                fill: #b78aff !important;
                stroke: #b78aff !important;
            }
        }
    }

    // 标签中的图标
    .n-tag {
        .icon-park-icon,
        [class*="icon-park"] {
            color: rgb(255 255 255 / 65%) !important;
            fill: rgb(255 255 255 / 65%) !important;
            stroke: rgb(255 255 255 / 65%) !important;
        }
    }

    // 输入框中的图标
    .n-input {
        .icon-park-icon,
        [class*="icon-park"] {
            color: rgb(255 255 255 / 45%) !important;
            fill: rgb(255 255 255 / 45%) !important;
            stroke: rgb(255 255 255 / 45%) !important;
        }
    }

    // 下拉菜单中的图标
    .n-dropdown-menu {
        .icon-park-icon,
        [class*="icon-park"] {
            color: rgb(255 255 255 / 65%) !important;
            fill: rgb(255 255 255 / 65%) !important;
            stroke: rgb(255 255 255 / 65%) !important;
        }

        .n-dropdown-option--active {
            .icon-park-icon,
            [class*="icon-park"] {
                color: #b78aff !important;
                fill: #b78aff !important;
                stroke: #b78aff !important;
            }
        }
    }
}

// 按钮样式优化
.n-button {
    font-weight: 500;
    box-shadow: 0 1px 2px rgb(0 0 0 / 5%);
    transition: all .2s cubic-bezier(.4, 0, .2, 1);

    &:hover {
        box-shadow: 0 2px 4px rgb(0 0 0 / 10%);
        transform: translateY(-1px);
    }

    &:active {
        box-shadow: 0 1px 2px rgb(0 0 0 / 10%);
        transform: translateY(0);
    }

    &:focus {
        box-shadow: 0 0 0 2px rgb(183 138 255 / 20%);
    }

    // 主要按钮
    &--primary {
        background: linear-gradient(135deg, #b78aff 0%, #a8a4ff 100%);
        border-color: #b78aff;
        box-shadow: 0 2px 4px rgb(183 138 255 / 30%);

        &:hover {
            background: linear-gradient(135deg, #a8a4ff 0%, #9d95ff 100%);
            border-color: #a8a4ff;
            box-shadow: 0 4px 8px rgb(183 138 255 / 40%);
        }

        &:active {
            background: linear-gradient(135deg, #9d95ff 0%, #9289ff 100%);
            box-shadow: 0 2px 4px rgb(183 138 255 / 30%);
        }
    }

    // 幽灵按钮
    &--ghost {
        color: rgb(0 0 0 / 85%);
        background: transparent;
        border-color: rgb(0 0 0 / 15%);

        &:hover {
            color: #b78aff;
            background: rgb(183 138 255 / 5%);
            border-color: #b78aff;
        }

        &:active {
            background: rgb(183 138 255 / 10%);
            border-color: #a8a4ff;
        }
    }

    // 默认按钮
    &--default {
        color: rgb(0 0 0 / 85%);
        background: #fff;
        border-color: rgb(0 0 0 / 12%);

        &:hover {
            background: rgb(0 0 0 / 2%);
            border-color: #b78aff;
        }

        &:active {
            background: rgb(0 0 0 / 5%);
        }
    }

    // 错误按钮
    &--error {
        background: linear-gradient(135deg, #e88080 0%, #e06666 100%);
        border-color: #e88080;
        box-shadow: 0 2px 4px rgb(232 128 128 / 30%);

        &:hover {
            background: linear-gradient(135deg, #e06666 0%, #d85555 100%);
            box-shadow: 0 4px 8px rgb(232 128 128 / 40%);
        }
    }

    // 成功按钮
    &--success {
        background: linear-gradient(135deg, #63e2b7 0%, #52d9a7 100%);
        border-color: #63e2b7;
        box-shadow: 0 2px 4px rgb(99 226 183 / 30%);

        &:hover {
            background: linear-gradient(135deg, #52d9a7 0%, #41d097 100%);
            box-shadow: 0 4px 8px rgb(99 226 183 / 40%);
        }
    }

    // 警告按钮
    &--warning {
        background: linear-gradient(135deg, #f2c97d 0%, #f0c366 100%);
        border-color: #f2c97d;
        box-shadow: 0 2px 4px rgb(242 201 125 / 30%);

        &:hover {
            background: linear-gradient(135deg, #f0c366 0%, #eb5 100%);
            box-shadow: 0 4px 8px rgb(242 201 125 / 40%);
        }
    }

    // 圆形按钮
    &--circle {
        border-radius: 50%;

        &.n-button--tiny {
            width: 24px;
            height: 24px;
        }

        &.n-button--small {
            width: 28px;
            height: 28px;
        }

        &.n-button--medium {
            width: 32px;
            height: 32px;
        }

        &.n-button--large {
            width: 36px;
            height: 36px;
        }
    }

    // 禁用状态
    &--disabled {
        cursor: not-allowed;
        box-shadow: none !important;
        opacity: .5;
        transform: none !important;

        &:hover {
            box-shadow: none !important;
            transform: none !important;
        }
    }
}

// 暗色模式下的按钮样式
@media (prefers-color-scheme: dark) {
    .n-button {
        border-color: rgb(255 255 255 / 24%);
        box-shadow: 0 1px 2px rgb(0 0 0 / 20%);

        &:hover {
            box-shadow: 0 2px 4px rgb(0 0 0 / 30%);
        }

        &:focus {
            box-shadow: 0 0 0 2px rgb(183 138 255 / 30%);
        }

        // 主要按钮暗色模式
        &--primary {
            background: linear-gradient(135deg, #b78aff 0%, #a8a4ff 100%);
            border-color: #b78aff;
            box-shadow: 0 2px 4px rgb(183 138 255 / 40%);

            &:hover {
                background: linear-gradient(135deg, #c49bff 0%, #b9b5ff 100%);
                box-shadow: 0 4px 8px rgb(183 138 255 / 50%);
            }
        }

        // 幽灵按钮暗色模式
        &--ghost {
            color: rgb(255 255 255 / 85%);
            background: transparent;
            border-color: rgb(255 255 255 / 24%);

            &:hover {
                color: #b78aff;
                background: rgb(183 138 255 / 10%);
                border-color: #b78aff;
            }

            &:active {
                background: rgb(183 138 255 / 15%);
            }
        }

        // 默认按钮暗色模式
        &--default {
            color: rgb(255 255 255 / 85%);
            background: rgb(255 255 255 / 4%);
            border-color: rgb(255 255 255 / 24%);

            &:hover {
                background: rgb(255 255 255 / 8%);
                border-color: #b78aff;
            }

            &:active {
                background: rgb(255 255 255 / 12%);
            }
        }

        // 错误按钮暗色模式
        &--error {
            background: linear-gradient(135deg, #e88080 0%, #e06666 100%);
            box-shadow: 0 2px 4px rgb(232 128 128 / 40%);

            &:hover {
                background: linear-gradient(135deg, #eb9999 0%, #e87777 100%);
                box-shadow: 0 4px 8px rgb(232 128 128 / 50%);
            }
        }

        // 成功按钮暗色模式
        &--success {
            background: linear-gradient(135deg, #63e2b7 0%, #52d9a7 100%);
            box-shadow: 0 2px 4px rgb(99 226 183 / 40%);

            &:hover {
                background: linear-gradient(135deg, #7ce6c4 0%, #6bddb4 100%);
                box-shadow: 0 4px 8px rgb(99 226 183 / 50%);
            }
        }

        // 警告按钮暗色模式
        &--warning {
            background: linear-gradient(135deg, #f2c97d 0%, #f0c366 100%);
            box-shadow: 0 2px 4px rgb(242 201 125 / 40%);

            &:hover {
                background: linear-gradient(135deg, #f4d194 0%, #f2cd7d 100%);
                box-shadow: 0 4px 8px rgb(242 201 125 / 50%);
            }
        }
    }
}
</style>
