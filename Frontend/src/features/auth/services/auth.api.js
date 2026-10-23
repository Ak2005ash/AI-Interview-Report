import axios from "axios"

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "http://localhost:3000" : window.location.origin),
    withCredentials: true
})

export async function register({ username, email, password }) {
    try {
        const response = await api.post('/api/auth/register', {
            username, email, password
        })
        return response.data


    } catch (error) {
        console.log(error);

    }
}

export async function login({ email, password }) {
    const response = await api.post('/api/auth/login', {
        email,
        password
    })
    return response.data
}

export async function logout() {
    try {
        const response = await api.get('/api/auth/logout')

        return response.data


    } catch (error) {
        console.log(error);

    }
}

export async function getMe() {
    const response = await api.get('/api/auth/get-me')
    return response.data
}
