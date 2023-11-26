<template>
    <n-config-provider :theme-overrides="themeOverrides">
        <n-message-provider>
            <n-dialog-provider>
                <router-view></router-view>
            </n-dialog-provider>
        </n-message-provider>
    </n-config-provider>
</template>
<script setup>
import { NConfigProvider, NMessageProvider, NDialogProvider } from 'naive-ui'

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
</script>
<style lang='scss'>
@import "./assets/css/reset.css";
</style>
