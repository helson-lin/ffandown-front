import axios from 'axios'

const baseURL = window.CONFIG.BASEURL || ''

const instance = axios.create({
    baseURL,
    // timeout: 30000,
    headers: {
        post: {
            'Content-Type': 'application/x-www-form;charset=utf-8',
        },
    },
})
// 请求拦截
instance.interceptors.request.use((config) => {
    const configBackup = config
    if (window.localStorage.getItem('token')) {
        configBackup.headers.Authorization = window.localStorage.getItem('token')
    }
    return configBackup
})
// 响应拦截
instance.interceptors.response.use(
    (response) => {
        const data = response.data
        if (typeof data.data === 'string') {
            data.data = JSON.parse(data.data)
        }
        return data
    },
    (error) => {
        if (error && error.response) {
            switch (error.response.status) {
                case 400:
                    error.response.message = '错误请求'
                    break
                case 401:
                    error.response.message = '未授权，请重新登录'
                    break
                case 403:
                    error.response.message = '拒绝访问'
                    break
                case 404:
                    error.response.message = '请求错误,未找到该资源'
                    break
                default:
                    break
            }
        } else {
            error.response.message = '连接到服务器失败'
        }
        console.error(error)
        return Promise.resolve(error.response)
    },
)

export default instance
