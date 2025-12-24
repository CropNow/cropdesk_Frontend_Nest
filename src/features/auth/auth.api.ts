import { http } from '@/services/http';
import type { LoginRequest, LoginResponse, User } from './auth.types';

/**
 * Authenticate a user with email and password.
 *
 * @param data - Login payload containing user credentials
 * @param data.email - User's email address
 * @param data.password - User's password
 *
 * @returns A promise that resolves to:
 * - accessToken: JWT or session token
 * - user: authenticated user object
 *
 * @example
 * ```ts
 * const response = await login({
 *   email: 'user@example.com',
 *   password: 'secret'
 * })
 *
 * console.log(response.user.email)
 * ```
 */
export const login = (data: LoginRequest): Promise<LoginResponse> => {
  return http.post('/auth/login', data);
};

/**
 * Register a new user.
 *
 * @param data - Registration payload
 * @param data.email - User's email address
 * @param data.password - User's password
 *
 * @returns A promise that resolves to:
 * - accessToken: JWT or session token
 * - user: newly created user object
 */
export const register = (data: LoginRequest): Promise<LoginResponse> => {
  return http.post('/auth/register', data);
};

/**
 * Logout the currently authenticated user.
 *
 * This endpoint typically clears the session or authentication cookies.
 *
 * @returns A promise that resolves when logout is successful
 */
export const logout = (): Promise<void> => {
  return http.post('/auth/logout');
};

/**
 * Fetch the currently authenticated user's profile.
 *
 * Used to:
 * - restore auth state on page refresh
 * - verify active session
 *
 * @returns A promise that resolves to the authenticated user object
 *
 * @example
 * ```ts
 * const user = await getMe()
 * console.log(user.name)
 * ```
 */
export const getMe = (): Promise<User> => {
  return http.get('/auth/me');
};
