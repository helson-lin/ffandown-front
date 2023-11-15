<template>
    <n-config-provider :theme-overrides="themeOverrides">
        <n-message-provider>
            <router-view></router-view>
        </n-message-provider>
    </n-config-provider>
</template>
<script setup>
import { NConfigProvider, NMessageProvider } from 'naive-ui'

const themeOverrides = {
    common: {
        primaryColor: '#B78AFF',
        primaryColorHover: '#5C5B84', 
    },
    Button: {
    },
    Select: {},
    // ...
}
</script>
<style lang='scss'>
@import "./assets/css/reset.css";
</style>
