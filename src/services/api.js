import axios from 'axios'

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api',
})

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Tests
export const getTests = (type = '') =>
  API.get(`/assessments/tests/${type ? `?type=${type}` : ''}`)
export const getTestDetail = (id) =>
  API.get(`/assessments/tests/${id}/`)
export const submitTest = (id, data) =>
  API.post(`/assessments/tests/${id}/submit/`, data)
export const getResult = (attemptId) =>
  API.get(`/assessments/results/${attemptId}/`)

// Auth
export const registerUser = (data) => API.post('/auth/register/', data)
export const loginUser = (data) => API.post('/auth/login/', data)
export const getProfile = () => API.get('/auth/profile/')

export default API