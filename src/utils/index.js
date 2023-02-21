/**
 * @description 加载配置文件，加上时间戳防止缓存
 */
export const loadConfig = () => {
    const path = './config.js?timesmap=' + new Date().getTime()
    const scriptHtml = document.createElement('script')
    scriptHtml.type = 'text/javascript'
    scriptHtml.async = true
    scriptHtml.src = path
    document.head.append(scriptHtml)
}