import axios from 'axios'
import { useStore } from '../store'

const baseURL = window.CONFIG?.BASEURL || ''

const instance = axios.create({
    baseURL,
    timeout: 10000,
    headers: {},
})
// 响应拦截
instance.interceptors.response.use(
    (response) => response.data,
    (error) => {
        if (error && error.response) {
            const store = useStore()
            switch (error.response.status) {
                case 400:
                    error.response.message = error.response.data.message
                    break
                case 401:
                    error.response.message = 'No authorized'
                    store.logout()
                    break
                case 403:
                    error.response.message = 'Resource access denied'
                    break
                case 404:
                    error.response.message = 'Not Found'
                    break
                default:
                    break
            }
        } else {
            error.response.message = '连接到服务器失败'
        }
        return {
            code: -1,
            status: error.response.status,
            message: error.response.message,
        }
    },
)

export default instance
