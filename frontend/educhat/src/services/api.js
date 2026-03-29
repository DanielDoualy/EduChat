const API_URL = import.meta.env.VITE_API_URL
console.log("API_URL:", API_URL)

const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem("refresh_token")
    if (!refreshToken) return null

    try {
        const response = await fetch(`${API_URL}/api/token/refresh/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh: refreshToken })
        })

        if (!response.ok) {
            localStorage.removeItem("token")
            localStorage.removeItem("refresh_token")
            localStorage.removeItem("username")
            localStorage.removeItem("level")
            localStorage.removeItem("current_subject")
            window.location.href = "/login"
            return null
        }

        const data = await response.json()
        localStorage.setItem("token", data.access)
        return data.access
    } catch {
        return null
    }
}

const fetchWithAuth = async (url, options = {}) => {
    const token = localStorage.getItem("token")

    const response = await fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            "Authorization": `Bearer ${token}`
        }
    })

    if (response.status === 401) {
        const newToken = await refreshAccessToken()
        if (!newToken) return response

        return fetch(url, {
            ...options,
            headers: {
                ...options.headers,
                "Authorization": `Bearer ${newToken}`
            }
        })
    }

    return response
}

export const api = {

    login: (data) => fetch(`${API_URL}/api/token/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    }),

    profile: (token) => fetch(`${API_URL}/api/profile/`, {
        headers: { "Authorization": `Bearer ${token}` }
    }),

    register: (data) => fetch(`${API_URL}/api/register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    }),

    loadChats: () => fetchWithAuth(`${API_URL}/api/chats/`),

    createChat: (subject) => fetchWithAuth(`${API_URL}/api/chats/create/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject })
    }),

    deleteChat: (chatId) => fetchWithAuth(`${API_URL}/api/chats/${chatId}/`, {
        method: "DELETE",
    }),

    loadMessages: (chatId) => fetchWithAuth(`${API_URL}/api/messages/?chat=${chatId}`),

    sendMessage: (chatId, message) => fetchWithAuth(`${API_URL}/api/ai/chat/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, message })
    })
}