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
        if (response && response.data) {
            if (response.data.code === 401) {
                window.vm.$router.push({ path: '/login' })
            }
        }
        const data = response.data
        // console.log(data, "response");
        if (typeof data.data === 'string') {
            data.data = JSON.parse(data.data)
        }
        return data
    },
    (error) => {
        const err = error
        if (error && error.response) {
            switch (error.response.status) {
                // case 400:
                //     err.message = '错误请求';
                //     break;
                // case 401:
                //     err.message = '未授权，请重新登录';
                //     break;
                case 403:
                    err.message = '拒绝访问'
                    window.vm.$router.push({ path: '/403' })
                    break
                case 404:
                    err.message = '请求错误,未找到该资源'
                    window.vm.$router.push({ path: '/404' })
                    break
                // case 405:
                //     err.message = '请求方法未允许';
                //     break;
                // case 408:
                //     err.message = '请求超时';
                //     break;
                // case 500:
                //     err.message = '服务器端出错';
                //     break;
                // case 501:
                //     err.message = '网络未实现';
                //     break;
                // case 502:
                //     err.message = '网络错误';
                //     break;
                // case 503:
                //     err.message = '服务不可用';
                //     break;
                // case 504:
                //     err.message = '网络超时';
                //     break;
                // case 505:
                //     err.message = 'http版本不支持该请求';
                //     break;
                default:
                    // err.message = `连接错误${error.response.status}`;
                    window.vm.$router.push({ path: '/400' })
            }
        } else {
            err.message = '连接到服务器失败'
        }
        return Promise.resolve(error.response)
    },
)

export default instance
