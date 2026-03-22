import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import ChatWindow from "../components/ChatWindow"
import Sidebar from "../components/Sidebar"
import { api } from "../services/api"
import "../styles/chat.css"

export default function ChatPage() {
    const [messages, setMessages] = useState([])
    const [input, setInput] = useState("")
    const [chatId, setChatId] = useState(null)
    const [loading, setLoading] = useState(false)
    const [, setError] = useState("")
    const [chats, setChats] = useState([])
    const [subject, setSubject] = useState("maths")
    const [sidebarOpen, setSidebarOpen] = useState(true)

    const navigate = useNavigate()
    const username = localStorage.getItem("username") || "Username"
    const level = localStorage.getItem("level") || "College"
    const token = localStorage.getItem("token")

    // Gere les erreurs 401 — token expire
    const handleApiError = (response) => {
        if (response.status === 401) {
            localStorage.removeItem("token")
            localStorage.removeItem("username")
            localStorage.removeItem("level")
            navigate("/login")
            return true
        }
        return false
    }

    const createChat = async (selectedSubject) => {
        try {
            const response = await api.createChat(token, selectedSubject)
            const data = await response.json()
            if (handleApiError(response)) return null
            if (!response.ok) { setError("Erreur création chat"); return null }

            const newChatId = data.chat_id
            setChatId(newChatId)
            setMessages([])
            setChats(prev => {
                const exists = prev.find(c => c.id === newChatId)
                if (exists) return prev
                return [...prev, { id: newChatId, subject: selectedSubject, title: null }]
            })
            return newChatId
        } catch {
            setError("Impossible de se connecter au serveur")
            return null
        }
    }

    const loadChats = async () => {
        try {
            const response = await api.loadChats(token)
            const data = await response.json()
            if (handleApiError(response)) return
            if (!response.ok) return

            const results = data.results || data
            const formatted = results
                .filter(chat => chat.title && chat.title.trim() !== "")
                .map(chat => ({
                    id: chat.id,
                    subject: chat.subject,
                    title: chat.title
                }))
            setChats(formatted)
        } catch {
            setError("Impossible de charger les chats")
        }
    }

    const loadMessages = async (selectedChatId) => {
        setMessages([])
        setLoading(true)
        try {
            const response = await api.loadMessages(token, selectedChatId)
            const data = await response.json()
            if (handleApiError(response)) return
            if (!response.ok) return

            const results = data.results || data
            const formatted = results.map(msg => ({
                sender: msg.sender === "bot" ? "bot" : "user",
                content: msg.content
            }))
            setMessages(formatted)
        } catch {
            setError("Impossible de charger les messages")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (!token) { navigate("/"); return }

        const init = async () => {
            await loadChats()
            await createChat("maths")
        }

        init()
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    const handleSelectSubject = async (selectedSubject) => {
        setSubject(selectedSubject)
        await createChat(selectedSubject)
    }

    const handleSelectChat = async (selectedChatId) => {
        setChatId(selectedChatId)
        await loadMessages(selectedChatId)
        const selectedChat = chats.find(c => c.id === selectedChatId)
        if (selectedChat) setSubject(selectedChat.subject)
    }

    const sendMessage = async () => {
        if (!input.trim()) return

        let activeChatId = chatId
        if (!activeChatId) {
            activeChatId = await createChat(subject)
            if (!activeChatId) return
        }

        const firstMessage = messages.length === 0
        const messageText = input

        setMessages(prev => [...prev, { sender: "user", content: messageText }])
        setInput("")
        setLoading(true)
        setError("")

        if (firstMessage) {
            setChats(prev => prev.map(c =>
                c.id === activeChatId
                    ? { ...c, title: messageText.slice(0, 30) }
                    : c
            ))
        }

        try {
            const response = await api.sendMessage(token, activeChatId, messageText)
            const data = await response.json()
            if (handleApiError(response)) return
            if (!response.ok) { setError("Erreur IA"); return }

            setMessages(prev => [...prev, { sender: "bot", content: data.response }])

            if (data.title) {
                setChats(prev => prev.map(c =>
                    c.id === (data.chat_id || activeChatId)
                        ? { ...c, title: data.title }
                        : c
                ))
            }

            if (data.chat_id && data.chat_id !== activeChatId) {
                const newChatId = data.chat_id
                const newSubject = data.subject

                setChatId(newChatId)
                setSubject(newSubject)

                setChats(prev => {
                    const exists = prev.find(c => c.id === newChatId)
                    if (exists) return prev.map(c =>
                        c.id === newChatId ? { ...c, title: data.title || c.title } : c
                    )
                    return [...prev, {
                        id: newChatId,
                        subject: newSubject,
                        title: data.title || messageText.slice(0, 30)
                    }]
                })
            } else if (data.subject && data.subject !== subject) {
                setSubject(data.subject)
            }

        } catch {
            setError("Impossible de joindre le serveur")
        } finally {
            setLoading(false)
        }
    }

    const renameChat = (chatId, newTitle) => {
        setChats(prev => prev.map(c =>
            c.id === chatId ? { ...c, title: newTitle } : c
        ))
    }

    const deleteChat = async (deletedChatId) => {
        try {
            const response = await api.deleteChat(token, deletedChatId)
            if (handleApiError(response)) return
            if (!response.ok) { setError("Erreur suppression"); return }

            setChats(prev => prev.filter(c => c.id !== deletedChatId))
            if (deletedChatId === chatId) {
                setChatId(null)
                setMessages([])
            }
        } catch {
            setError("Impossible de supprimer le chat")
        }
    }

    return (
        <div className="chat-page">
            <Sidebar
                chats={chats}
                activeChatId={chatId}
                onNewChat={() => createChat(subject)}
                onSelectSubject={handleSelectSubject}
                onSelectChat={handleSelectChat}
                username={username}
                level={level}
                isOpen={sidebarOpen}
                onToggle={() => setSidebarOpen(prev => !prev)}
                onRenameChat={renameChat}
                onDeleteChat={deleteChat}
                currentSubject={subject}
            />
            <ChatWindow
                messages={messages}
                loading={loading}
                input={input}
                onInputChange={setInput}
                onSend={sendMessage}
                username={username}
            />
        </div>
    )
}