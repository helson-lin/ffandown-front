import { createApp } from 'vue'
import naive from 'naive-ui'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import { createPinia } from 'pinia'
import { loadConfig } from './utils'
import i18n from './lang'

loadConfig()
createApp(App)
.use(createPinia())
.use(router)
.use(naive)
.use(i18n)
.mount('#app')
