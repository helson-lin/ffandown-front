<template>
    <n-config-provider :theme-overrides="themeOverrides" :locale="locale" :date-locale="dateLocale">
        <n-message-provider>
            <n-dialog-provider>
                <router-view></router-view>
            </n-dialog-provider>
        </n-message-provider>
    </n-config-provider>
</template>
<script setup>
import { NConfigProvider, NMessageProvider, NDialogProvider, zhCN, dateZhCN, enUS, dateEnUS } from 'naive-ui'
import { useStore } from './store'
import { useRouter } from 'vue-router'
import { watch } from 'vue'
/**
   * js 文件下使用这个做类型提示
   * @type import('naive-ui').GlobalThemeOverrides
   */
const themeOverrides = {
    common: {
        primaryColor: '#b78aff',
        primaryColorHover: '#a8a4ff', 
        iconColor: '#b78aff',
        pressedColor: '#a8a4ff',
        warningColor: '#cd3f01',
        warningColorHover: '#b41901',
        warningColorPressed: '#cd1d01',
        warningColorSuppl: '#b41901',
    },
    Button: {
        backgroundColor: '#b78aff',
        activeColor: '#b78aff',
        colorPressedPrimary: '#a8a4ff',
        borderPressedPrimary: '#a8a4ff',
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
    Select: {},
}

const language = navigator.language
const locale = computed(() => (language === 'zh-CN' ? zhCN : enUS))
const dateLocale = computed(() => (language === 'zh-CN' ? dateZhCN : dateEnUS))
const store = useStore()
const router = useRouter()

watch(() => store.authed, (newValue) => {
    if (!newValue) {
        router.push({ path: '/login' }) // 跳转到登录页
    }
}, {
    immediate: true,
})
</script>
<style lang='scss'>
@import "./assets/css/reset.css";

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

.n-button:active {
    color: #b78aff !important;
}

.n-config-provider {
    width: 100%;
    height: 100%;
}
</style>
