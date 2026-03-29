import botIcon from "../assets/dark_bot_icon.svg"
import userIcon from "../assets/user_icon.svg"

export default function Message({ sender, content }) {
    const isUser = sender === "user"

    const formatContent = (text) => {
        const lines = text.split('\n')
        return lines.map((line, index) => {
            const isLast = index === lines.length - 1
            return (
                <span key={index}>
                    {line}
                    {!isLast && <br />}
                </span>
            )
        })
    }

    return (
        <div className={`message-wrapper ${isUser ? "message-wrapper--user" : "message-wrapper--bot"}`}>
            {!isUser && (
                <img src={botIcon} alt="bot" className="message-avatar-icon" />
            )}
            <div className={`message-bubble ${isUser ? "message-bubble--user" : "message-bubble--bot"}`}>
                {isUser ? content : formatContent(content)}
            </div>
            {isUser && (
                <img src={userIcon} alt="user" className="message-avatar-icon" />
            )}
        </div>
    )
}