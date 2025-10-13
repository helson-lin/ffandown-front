import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import { createPinia } from 'pinia'
import i18n from './lang'
import 'virtual:svg-icons-register'
import Icon from './components/Icon.vue'

const app = createApp(App)
app.component('Icon', Icon)

// Naive UI 组件由 unplugin-vue-components 自动按需引入
// 无需手动注册，组件会在使用时自动导入并包含样式

app.use(createPinia())
.use(router)
.use(i18n)
.mount('#app')
