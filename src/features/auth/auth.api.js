import { http } from '@/services/http'

/**
 * Login user
 *
 * @param {LoginRequest} data - Login payload (email & password)
 * @returns {Promise<LoginResponse>} Auth token and user data
 */
export const login = (data) => {
  return http.post('/auth/login', data)
}
export const register = (data) => {
  return http.post('/auth/register', data)
}
export const logout = () => {
  return http.post('/auth/logout')
}
export const getMe = () => {
  return http.get('/auth/me')
}
