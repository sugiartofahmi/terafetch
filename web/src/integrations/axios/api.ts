import axios from 'axios'
import { normalizeError } from './error'
import type { AxiosRequestConfig } from 'axios'

const configAPI: AxiosRequestConfig = {
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3100/api/v1',
  timeout: 30000,
}

export const api = axios.create(configAPI)

api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(normalizeError(error)),
)
