import { createApp } from 'vue'
import naive from 'naive-ui'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import { createPinia } from 'pinia'
import { loadConfig } from './utils'
import i18n from './lang'
import 'virtual:svg-icons-register'
import Icon from './components/Icon.vue'

loadConfig()
const app = createApp(App)
app.component('Icon', Icon)

app.use(createPinia())
.use(router)
.use(naive)
.use(i18n)
.mount('#app')
