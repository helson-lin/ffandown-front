<template>
    <n-config-provider :theme-overrides="themeOverrides">
        <router-view></router-view>
    </n-config-provider>
</template>
<script setup>
import { NConfigProvider } from 'naive-ui'

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
