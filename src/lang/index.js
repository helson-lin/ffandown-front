import { createI18n } from 'vue-i18n'
import zh from './zh.json'
import en from './en.json'
import ja from './ja.json'

const messages = {
    zh,
    en,
    ja,
}
const language = (navigator.language || 'en').toLocaleLowerCase() 
const i18n = createI18n({
    locale: localStorage.getItem('lang') || language, // 设置当前语言类型
    legacy: false,
    fallbackLocale: 'en',
    fallbackWarn: false,
    missingWarn: false,
    globalInjection: true,
    messages,
})

export default i18n
