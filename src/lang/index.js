import { createI18n } from 'vue-i18n'
import EN from './en'
import ZH from './zh'

const messages = {
    zh: {
        ...ZH,
    },
    en: {
        ...EN,
    },
}
const language = (navigator.language || 'en').toLocaleLowerCase() 
const i18n = createI18n({
    locale: localStorage.getItem('lang') || language, // 设置当前语言类型
    legacy: false,
    globalInjection: true,
    messages,
})

export default i18n
