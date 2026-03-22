import axios from 'axios'

const API = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
})

export const getTests = (type = '') =>
  API.get(`/assessments/tests/${type ? `?type=${type}` : ''}`)

export const getTestDetail = (id) =>
  API.get(`/assessments/tests/${id}/`)

export const submitTest = (id, data) =>
  API.post(`/assessments/tests/${id}/submit/`, data)

export const getResult = (attemptId) =>
  API.get(`/assessments/results/${attemptId}/`)

export default API