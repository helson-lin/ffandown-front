/**
 * Naive UI 按需引入配置
 * 只引入项目中实际使用的组件，大幅减小打包体积
 * 
 * 注意：NConfigProvider、NMessageProvider、NDialogProvider 
 * 已在 App.vue 中局部导入，不需要全局注册
 */
import {
    // 表单组件
    NForm,
    NFormItem,
    NInput,
    NInputGroup,
    NInputNumber,
    NSelect,
    NSwitch,
    NCheckbox,
    NCheckboxGroup,

    // 按钮和操作
    NButton,
    NDropdown,
    NPopover,
    NTooltip,
    NPopconfirm,

    // 数据展示
    NAvatar,
    NIcon,
    NTag,
    NProgress,
    NPagination,
    NSpin,

    // 反馈组件
    NModal,
    NDrawer,
    NDrawerContent,
    
    // 动画组件
    NCollapseTransition,
} from 'naive-ui'

// 需要全局注册的组件列表
// Provider 组件已在 App.vue 中局部导入，不包含在此列表中
const components = [
    NForm,
    NFormItem,
    NInput,
    NInputGroup,
    NInputNumber,
    NSelect,
    NSwitch,
    NCheckbox,
    NCheckboxGroup,
    NButton,
    NDropdown,
    NPopover,
    NTooltip,
    NPopconfirm,
    NAvatar,
    NIcon,
    NTag,
    NProgress,
    NPagination,
    NSpin,
    NModal,
    NDrawer,
    NDrawerContent,
    NCollapseTransition,
]

/**
 * 注册 Naive UI 组件
 * @param {App} app - Vue 应用实例
 */
export function setupNaiveUI(app) {
    components.forEach((component) => {
        app.component(component.name, component)
    })
}

// 导出常用的 composable API，方便在组件中使用
export { useMessage, useDialog, useNotification, useLoadingBar, useThemeVars } from 'naive-ui'
