const API_URL = import.meta.env.VITE_API_URL
console.log("API_URL:", API_URL)

export const api = {

    // Auth
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

    // Chats
    loadChats: (token) => fetch(`${API_URL}/api/chats/`, {
        headers: { "Authorization": `Bearer ${token}` }
    }),

    createChat: (token, subject) => fetch(`${API_URL}/api/chats/create/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ subject })
    }),

    deleteChat: (token, chatId) => fetch(`${API_URL}/api/chats/${chatId}/`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
    }),

    // Messages
    loadMessages: (token, chatId) => fetch(`${API_URL}/api/messages/?chat=${chatId}`, {
        headers: { "Authorization": `Bearer ${token}` }
    }),

    sendMessage: (token, chatId, message) => fetch(`${API_URL}/api/ai/chat/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ chat_id: chatId, message })
    })
}