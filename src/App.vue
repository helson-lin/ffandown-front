<template>
    <n-config-provider :theme-overrides="themeOverrides" :locale="localLocale" :date-locale="dataLocale">
        <n-message-provider>
            <n-dialog-provider>
                <router-view></router-view>
            </n-dialog-provider>
        </n-message-provider>
    </n-config-provider>
</template>
<script setup>
import { NConfigProvider, NMessageProvider, NDialogProvider, zhCN, dateZhCN, enUS, dateEnUS } from 'naive-ui'
/**
   * js 文件下使用这个做类型提示
   * @type import('naive-ui').GlobalThemeOverrides
   */
const themeOverrides = {
    common: {
        primaryColor: '#B78AFF',
        primaryColorHover: '#a8a4ff', 
        pressedColor: '#a8a4ff',
        warningColor: '#cd3f01',
        warningColorHover: '#b41901',
        warningColorPressed: '#cd1d01',
        warningColorSuppl: '#b41901',
    },
    Button: {
        backgroundColor: '#B78AFF',
        textCOlor: '#B78AFF',
        activeColor: '#B78AFF',
        colorPressedPrimary: '#a8a4ff',
        borderPressedPrimary: '#a8a4ff',
    },
    Select: {},
}

const language = navigator.language
const localLocale = computed(() => (language === 'zh-CN' ? zhCN : enUS))
const dataLocale = computed(() => (language === 'zh-CN' ? dateZhCN : dateEnUS))
</script>
<style lang='scss'>
@import "./assets/css/reset.css";

.n-config-provider {
    width: 100%;
    height: 100%;
}
</style>
