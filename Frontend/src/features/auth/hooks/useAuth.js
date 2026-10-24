import { useContext } from "react";
import { AuthContext } from "../auth.context";
import { login, register, logout } from "../services/auth.api";

export const useAuth = () => {
    const context = useContext(AuthContext)
    const { user, setUser, loading, setLoading, setError } = context

    const handleLogin = async ({ email, password }) => {
        setLoading(true)
        setError(null)

        try {
            const data = await login({ email, password })
            sessionStorage.setItem("token", data.token)
            setUser(data.user)
            return true

        } catch (error) {
            sessionStorage.removeItem("token")
            setUser(null)
            setError(error.response?.data?.message || error.message || "Unable to log in. Please try again.")
            return false
        } finally {

            setLoading(false)
        }


    }

    const handleRegister = async ({ username, email, password }) => {
        setLoading(true)
        setError(null)

        try {
            const data = await register({ username, email, password })
            sessionStorage.setItem("token", data.token)
            setUser(data.user)
            return true
        } catch (error) {
            setError(error.response?.data?.message || error.message || "Unable to register. Please try again.")
            return false
        } finally {
            setLoading(false)
        }

    }

    const handleLogout = async () => {
        setLoading(true)

        try {
            await logout()
            sessionStorage.removeItem("token")
            setUser(null)

        } catch (error) {
            setError(error.response?.data?.message || error.message || "Unable to log out. Please try again.")
        } finally {
            setLoading(false)
        }

    }

    return { user, loading, error: context.error, handleLogin, handleLogout, handleRegister }
}