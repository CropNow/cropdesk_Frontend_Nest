import { http } from "@/services/http"

export const login = (data) => http.post("/auth/login", data)
export const register = (data) => http.post("/auth/register", data)
export const logout = () => http.post("/auth/logout")
export const getMe = () => http.get("/auth/me")

