import axios from './instance'

const axiosAPI = {
    // get请求
    get(url, param) {
        return new Promise((resolve) => {
            axios({
                method: 'get',
                url,
                params: param,
            }).then((res) => {
                resolve(res)
            })
        })
    },
    // post请求
    post(url, param) {
        return new Promise((resolve) => {
            axios({
                method: 'post',
                url,
                data: param,
            }).then((res) => {
                resolve(res)
            })
        })
    },
}

export default axiosAPI
