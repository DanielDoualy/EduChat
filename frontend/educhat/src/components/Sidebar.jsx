import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Button from "./Button"
import InputField from "./InputField"
import SubjectSelector from "./SubjectSelector"
import botIcon from "../assets/white_bot_icon.svg"
import plusIcon from "../assets/plus_icon.svg"
import subjectIcon from "../assets/subject_icon.svg"
import searchIcon from "../assets/search_icon.svg"
import switchIcon from "../assets/switch_sidebar_icon.svg"
import ellipsisIcon from "../assets/ellipsis_icon.svg"
import whiteUserIcon from "../assets/white_user_icon.svg"

export default function Sidebar({ onNewChat, onSelectSubject, chats = [], activeChatId, onSelectChat, username, level, isOpen, onToggle, onRenameChat, onDeleteChat, currentSubject }) {

    const [subjectOpen, setSubjectOpen] = useState(true)
    const [openMenuId, setOpenMenuId] = useState(null)
    const [editingId, setEditingId] = useState(null)
    const [editingTitle, setEditingTitle] = useState("")
    const [searchQuery, setSearchQuery] = useState("")
    const menuRef = useRef(null)
    const searchRef = useRef(null)
    const navigate = useNavigate()

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpenMenuId(null)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const handleLogout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("refresh_token")
        localStorage.removeItem("username")
        localStorage.removeItem("level")
        navigate("/")
    }

    const handleEllipsisClick = (e, chatId) => {
        e.stopPropagation()
        setOpenMenuId(prev => prev === chatId ? null : chatId)
    }

    const handleRename = (e, chat) => {
        e.stopPropagation()
        setEditingId(chat.id)
        setEditingTitle(chat.title || chat.subject)
        setOpenMenuId(null)
    }

    const handleRenameSubmit = (e, chatId) => {
        if (e.key === "Enter" && editingTitle.trim()) {
            onRenameChat(chatId, editingTitle.trim())
            setEditingId(null)
        }
        if (e.key === "Escape") {
            setEditingId(null)
        }
    }

    const handleDelete = (e, chatId) => {
        e.stopPropagation()
        onDeleteChat(chatId)
        setOpenMenuId(null)
    }

    const handleCollapsedNewChat = () => {
        onToggle()
        onNewChat()
    }

    const handleCollapsedSubject = () => {
        setSubjectOpen(true)
        onToggle()
    }

    const handleCollapsedSearch = () => {
        onToggle()
        setTimeout(() => {
            if (searchRef.current) searchRef.current.focus()
        }, 350)
    }

    const visibleChats = chats
        .filter(chat => chat.title)
        .filter(chat =>
            searchQuery.trim() === "" ||
            chat.title.toLowerCase().includes(searchQuery.toLowerCase())
        )

    return (
        <div className={`sidebar ${isOpen ? "sidebar--open" : "sidebar--closed"}`}>

            <div className="sidebar-header">
                <img src={botIcon} alt="bot" className="sidebar-bot-icon" />
                {isOpen && (
                    <div className="sidebar-toggle-wrapper">
                        <img
                            src={switchIcon}
                            alt="toggle"
                            className="sidebar-toggle-icon"
                            onClick={onToggle}
                        />
                        <span className="sidebar-toggle-tooltip">Fermer la barre latérale</span>
                    </div>
                )}
            </div>

            {!isOpen && (
                <div className="sidebar-tooltip-wrapper">
                    <img
                        src={switchIcon}
                        alt="toggle"
                        className="sidebar-toggle-icon sidebar-toggle-icon--collapsed"
                        onClick={onToggle}
                    />
                    <span className="sidebar-tooltip">Ouvrir la sidebar</span>
                </div>
            )}

            {isOpen ? (
                <>
                    <Button
                        text={
                            <span className="sidebar-btn-content">
                                <img src={plusIcon} alt="plus" />
                                Nouveau chat
                            </span>
                        }
                        type="button"
                        className="sidebar-new-chat"
                        onClick={onNewChat}
                    />

                    <Button
                        text={
                            <span className="sidebar-btn-content">
                                <img src={subjectIcon} alt="subject" />
                                Selection de matiere
                            </span>
                        }
                        type="button"
                        className="sidebar-section-title"
                        onClick={() => setSubjectOpen(prev => !prev)}
                    />

                    {subjectOpen && (
                        <SubjectSelector
                            onSelect={onSelectSubject}
                            currentSubject={currentSubject}
                        />
                    )}

                    <div className="sidebar-search-row">
                        <img src={searchIcon} alt="search" />
                        <InputField
                            placeholder="Rechercher des chats"
                            className="sidebar-search-input"
                            name="search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            inputRef={searchRef}
                        />
                    </div>

                    <div className="sidebar-chats-label">
                        Vos Chats
                        {searchQuery && (
                            <span className="sidebar-search-count">
                                {visibleChats.length} résultat{visibleChats.length !== 1 ? "s" : ""}
                            </span>
                        )}
                    </div>

                    <div className="sidebar-chats-list">
                        {visibleChats.length === 0 && searchQuery ? (
                            <div className="sidebar-no-results">Aucun chat trouvé</div>
                        ) : (
                            visibleChats.map(chat => (
                                <div
                                    key={chat.id}
                                    className={`sidebar-chat-item ${chat.id === activeChatId ? "sidebar-chat-item--active" : ""}`}
                                    onClick={() => onSelectChat(chat.id)}
                                >
                                    {editingId === chat.id ? (
                                        <input
                                            className="sidebar-chat-rename-input"
                                            value={editingTitle}
                                            onChange={(e) => setEditingTitle(e.target.value)}
                                            onKeyDown={(e) => handleRenameSubmit(e, chat.id)}
                                            onClick={(e) => e.stopPropagation()}
                                            autoFocus
                                        />
                                    ) : (
                                        <span
                                            dangerouslySetInnerHTML={{
                                                __html: searchQuery
                                                    ? chat.title.replace(
                                                        new RegExp(`(${searchQuery})`, "gi"),
                                                        '<mark class="search-highlight">$1</mark>'
                                                    )
                                                    : chat.title
                                            }}
                                        />
                                    )}

                                    <div className="sidebar-chat-menu-wrapper" ref={openMenuId === chat.id ? menuRef : null}>
                                        <img
                                            src={ellipsisIcon}
                                            alt="options"
                                            className="sidebar-chat-dots-icon"
                                            onClick={(e) => handleEllipsisClick(e, chat.id)}
                                        />

                                        {openMenuId === chat.id && (
                                            <div className="sidebar-chat-menu">
                                                <div
                                                    className="sidebar-chat-menu-item"
                                                    onClick={(e) => handleRename(e, chat)}
                                                >
                                                    Renommer
                                                </div>
                                                <div
                                                    className="sidebar-chat-menu-item sidebar-chat-menu-item--delete"
                                                    onClick={(e) => handleDelete(e, chat.id)}
                                                >
                                                    Supprimer
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="sidebar-user">
                        <img src={whiteUserIcon} alt="user" className="sidebar-user-avatar" />
                        <div className="sidebar-user-info">
                            <span className="sidebar-user-name">{username || "Username"}</span>
                            <span className="sidebar-user-level">{level || "College"}</span>
                        </div>
                        <div className="sidebar-logout-wrapper">
                            <Button
                                text="⏻"
                                type="button"
                                className="sidebar-logout-btn"
                                onClick={handleLogout}
                            />
                            <span className="sidebar-logout-tooltip">Se déconnecter</span>
                        </div>
                    </div>
                </>
            ) : (
                <div className="sidebar-icons-only">

                    <div className="sidebar-tooltip-wrapper">
                        <img
                            src={plusIcon}
                            alt="nouveau chat"
                            className="sidebar-icon-collapsed"
                            onClick={handleCollapsedNewChat}
                        />
                        <span className="sidebar-tooltip">Nouveau chat</span>
                    </div>

                    <div className="sidebar-tooltip-wrapper">
                        <img
                            src={subjectIcon}
                            alt="matiere"
                            className="sidebar-icon-collapsed"
                            onClick={handleCollapsedSubject}
                        />
                        <span className="sidebar-tooltip">Selection de matiere</span>
                    </div>

                    <div className="sidebar-tooltip-wrapper">
                        <img
                            src={searchIcon}
                            alt="recherche"
                            className="sidebar-icon-collapsed"
                            onClick={handleCollapsedSearch}
                        />
                        <span className="sidebar-tooltip">Rechercher des chats</span>
                    </div>

                    <div className="sidebar-icons-only-bottom">
                        <div className="sidebar-tooltip-wrapper">
                            <img
                                src={whiteUserIcon}
                                alt="user"
                                className="sidebar-icon-collapsed"
                                onClick={onToggle}
                            />
                            <span className="sidebar-tooltip">Profil</span>
                        </div>
                        <div className="sidebar-tooltip-wrapper">
                            <Button
                                text="⏻"
                                type="button"
                                className="sidebar-icon-collapsed sidebar-logout-collapsed"
                                onClick={handleLogout}
                            />
                            <span className="sidebar-tooltip">Se déconnecter</span>
                        </div>
                    </div>

                </div>
            )}
        </div>
    )
}