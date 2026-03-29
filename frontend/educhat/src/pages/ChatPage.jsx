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
    const [subject, setSubject] = useState(
        localStorage.getItem("current_subject") || "maths"
    )
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [serverLoading, setServerLoading] = useState(false)

    const navigate = useNavigate()
    const username = localStorage.getItem("username") || "Username"
    const level = localStorage.getItem("level") || "College"
    const token = localStorage.getItem("token")

    // Detecte si on est sur mobile au chargement
    useEffect(() => {
        const isMobile = window.innerWidth <= 768
        setSidebarOpen(!isMobile)
    }, [])

    const handleApiError = (response) => {
        if (response.status === 401) {
            localStorage.removeItem("token")
            localStorage.removeItem("refresh_token")
            localStorage.removeItem("username")
            localStorage.removeItem("level")
            localStorage.removeItem("current_subject")
            navigate("/login")
            return true
        }
        return false
    }

    const handleFetchError = () => {
        setServerLoading(true)
        setTimeout(() => setServerLoading(false), 60000)
    }

    const updateSubject = (newSubject) => {
        setSubject(newSubject)
        localStorage.setItem("current_subject", newSubject)
    }

    const createChat = async (selectedSubject) => {
        try {
            const response = await api.createChat(selectedSubject)
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
            handleFetchError()
            return null
        }
    }

    const loadChats = async () => {
        try {
            const response = await api.loadChats()
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
            handleFetchError()
        }
    }

    const loadMessages = async (selectedChatId) => {
        setMessages([])
        setLoading(true)
        try {
            const response = await api.loadMessages(selectedChatId)
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
            handleFetchError()
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (!token) { navigate("/"); return }

        const init = async () => {
            await loadChats()
            await createChat(subject)
        }

        init()
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    const handleSelectSubject = async (selectedSubject) => {
        updateSubject(selectedSubject)
        await createChat(selectedSubject)
        // Ferme la sidebar sur mobile apres selection
        if (window.innerWidth <= 768) setSidebarOpen(false)
    }

    const handleSelectChat = async (selectedChatId) => {
        setChatId(selectedChatId)
        await loadMessages(selectedChatId)
        const selectedChat = chats.find(c => c.id === selectedChatId)
        if (selectedChat) updateSubject(selectedChat.subject)
        // Ferme la sidebar sur mobile apres selection d'un chat
        if (window.innerWidth <= 768) setSidebarOpen(false)
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
            const response = await api.sendMessage(activeChatId, messageText)
            const data = await response.json()
            if (handleApiError(response)) return
            if (!response.ok) { setError("Erreur IA"); return }

            setServerLoading(false)
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
                updateSubject(newSubject)
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
                updateSubject(data.subject)
            }

        } catch {
            handleFetchError()
        } finally {
            setLoading(false)
        }
    }

    const renameChat = (id, newTitle) => {
        setChats(prev => prev.map(c =>
            c.id === id ? { ...c, title: newTitle } : c
        ))
    }

    const deleteChat = async (deletedChatId) => {
        try {
            const response = await api.deleteChat(deletedChatId)
            if (handleApiError(response)) return
            if (!response.ok) { setError("Erreur suppression"); return }

            setChats(prev => prev.filter(c => c.id !== deletedChatId))
            if (deletedChatId === chatId) {
                setChatId(null)
                setMessages([])
            }
        } catch {
            handleFetchError()
        }
    }

    const handleToggleSidebar = () => setSidebarOpen(prev => !prev)
    const handleCloseSidebar = () => setSidebarOpen(false)

    return (
        <div className="chat-page">

            {/* Overlay mobile — ferme la sidebar en cliquant dehors */}
            {sidebarOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={handleCloseSidebar}
                />
            )}

            <Sidebar
                chats={chats}
                activeChatId={chatId}
                onNewChat={() => {
                    createChat(subject)
                    if (window.innerWidth <= 768) setSidebarOpen(false)
                }}
                onSelectSubject={handleSelectSubject}
                onSelectChat={handleSelectChat}
                username={username}
                level={level}
                isOpen={sidebarOpen}
                onToggle={handleToggleSidebar}
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
                serverLoading={serverLoading}
                onMenuOpen={handleToggleSidebar}
            />
        </div>
    )
}