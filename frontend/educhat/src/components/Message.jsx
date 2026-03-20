import botIcon from "../assets/dark_bot_icon.svg"
import userIcon from "../assets/user_icon.svg"

export default function Message({ sender, content }) {
    const isUser = sender === "user"

    return (
        <div className={`message-wrapper ${isUser ? "message-wrapper--user" : "message-wrapper--bot"}`}>
            {!isUser && (
                <img src={botIcon} alt="bot" className="message-avatar-icon" />
            )}
            <div className={`message-bubble ${isUser ? "message-bubble--user" : "message-bubble--bot"}`}>
                {content}
            </div>
            {isUser && (
                <img src={userIcon} alt="user" className="message-avatar-icon" />
            )}
        </div>
    )
}