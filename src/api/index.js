import axiosAPI from '../axios'

// 获取状态
export const getStat = () => axiosAPI.rpc('aria2.getGlobalStat', [])

// 发送下载任务
export const sendDownload = (params) => axiosAPI.rpc('aria2.addUri', params)

// 发送下载magnet
export const sendDownloadByMagnet = (params) => axiosAPI.rpc('aria2.addTorrent', params)