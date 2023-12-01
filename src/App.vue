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

const themeOverrides = {
    common: {
        primaryColor: '#B78AFF',
        primaryColorHover: '#5C5B84', 
    },
    Button: {
        backgroundColor: '#B78AFF',
        textCOlor: '#B78AFF',
    },
    Select: {},
}

const language = navigator.language
const localLocale = computed(() => (language === 'zh-CN' ? zhCN : enUS))
const dataLocale = computed(() => (language === 'zh-CN' ? dateZhCN : dateEnUS))
</script>
<style lang='scss'>
@import "./assets/css/reset.css";
</style>
