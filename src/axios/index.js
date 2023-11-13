import axios from './instance'
import { getOption, UIDGenerator } from '../utils'

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
    // rpc 请求
    rpc(method, params, id = UIDGenerator.generate(20)) {
        return new Promise((resolve, reject) => {
            const { secret, url } = getOption()
            const data = { id, jsonrpc: '2.0', method, params }
            if (data.params && data.params instanceof Array) {
                data.params.unshift(`token:${secret}`)
            }
            axios({
                method: 'post',
                url: url || '',
                data,
            }).then((res) => {
                resolve(res)
            }).catch(e => reject(e))
        })
    },
}

export default axiosAPI
