import axiosAPI from '../axios'

// get download mission list
export const getDownloadList = (params) => axiosAPI.get('/list', params)

// delete mission
export const deleteMission = (uid) => axiosAPI.delete('/del', { uid })

// create download mission
export const createMission = (data) => axiosAPI.post('/down', data)

export const resumeMission = (uid) => axiosAPI.get('/resume', { uid })

export const pauseMission = (uid) => axiosAPI.get('/pause', { uid })

export const getSystemConfig = () => axiosAPI.get('/config')

export const updateSytemConfig = (data) => axiosAPI.post('/config', data)

export const getSystemVersion = () => axiosAPI.get('/version')

export const upgradeVersion = () => axiosAPI.get('/upgrade')
