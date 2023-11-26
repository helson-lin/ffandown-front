import axiosAPI from '../axios'

// get download mission list
export const getDownloadList = () => axiosAPI.get('/list')

// delete mission
export const deleteMission = (uid) => axiosAPI.delete('/del', { uid })

// create download mission
export const createMission = (data) => axiosAPI.post('/down', data)

export const resumeMission = (uid) => axiosAPI.get('/resume', { uid })

export const pauseMission = (uid) => axiosAPI.get('/pause', { uid })
