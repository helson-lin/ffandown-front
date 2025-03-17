import axios from 'axios'
import { useStore } from '../store'

const baseURL = window.CONFIG?.BASEURL || ''

const instance = axios.create({
    baseURL,
    // timeout: 30000,
    headers: {
        post: {
            'Content-Type': 'application/x-www-form;charset=utf-8',
        },
    },
})
// 响应拦截
instance.interceptors.response.use(
    (response) => response.data,
    (error) => {
        if (error && error.response) {
            const store = useStore()
            switch (error.response.status) {
                case 400:
                    error.response.message = '错误请求'
                    break
                case 401:
                    error.response.message = '未授权，请重新登录'
                    store.logout()
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
        return Promise.reject(error.response)
    },
)

export default instance
