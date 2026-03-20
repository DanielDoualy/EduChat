import { useEffect, useRef } from "react"
import Message from "./Message"
import MessageInput from "./MessageInput"

export default function ChatWindow({ messages, loading, input, onInputChange, onSend, username }) {

    const bottomRef = useRef(null)

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    return (
        <div className="chat-window">

            <div className="chat-header">
                <h2>EduChat</h2>
            </div>

            <div className="chat-messages">

                <Message
                    sender="bot"
                    content={`Bonjour ${username || ""}, je suis votre assistant IA EduChat. En quoi puis-je vous aider ?`}
                />

                {messages.map((msg, index) => (
                    <Message key={index} sender={msg.sender} content={msg.content} />
                ))}

                {loading && <Message sender="bot" content="L'IA réfléchit..." />}

                <div ref={bottomRef} />
            </div>

            <MessageInput
                value={input}
                onChange={(e) => onInputChange(e.target.value)}
                onSend={onSend}
                loading={loading}
            />

        </div>
    )
}