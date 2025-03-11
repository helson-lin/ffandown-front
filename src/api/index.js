import axiosAPI from '../axios'

// get download mission list
export const getDownloadList = (params) => axiosAPI.get('/list', params)
// delete mission
export const deleteMission = (uid) => axiosAPI.delete('/del', { uid })
// create download mission
export const createMission = (data) => axiosAPI.post('/down', data)
// 继续下载
export const resumeMission = (uid) => axiosAPI.get('/resume', { uid })
// 暂停下载
export const pauseMission = (uid) => axiosAPI.get('/pause', { uid })
// 停止下载
export const stopMission = (uid) => axiosAPI.post(`/stop?uid=${uid}`)
// 获取系统配置
export const getSystemConfig = () => axiosAPI.get('/sys/config')
// 更新系统配置
export const updateSytemConfig = (data) => axiosAPI.post('/sys/config', data)
// 获取系统的版本信息
export const getSystemVersion = () => axiosAPI.get('/sys/version')
// 升级前端版本
export const upgradeVersion = () => axiosAPI.get('/sys/upgrade')
// 测试 webhook 是否正常
export const testWebhook = (params) => axiosAPI.get('/sys/testWebhook', params)
// 登录
export const userLogin = (data) => axiosAPI.post('/user/login', data)
// 获取媒体目录
export const getDir = () => axiosAPI.get('/sys/dir')
// 登出
export const userLogout = () => axiosAPI.get('/user/logout')
