import InputField from "./InputField"
import Button from "./Button"
import sendIcon from "../assets/send_icon.svg"

export default function MessageInput({ value, onChange, onSend, loading }) {

    const handleKeyDown = (e) => {
        if (e.key === "Enter") onSend()
    }

    return (
        <div className="message-input-wrapper">
            <InputField
                placeholder="Poser une question"
                className="message-input"
                name="messageinput"
                value={value}
                onChange={onChange}
                onKeyDown={handleKeyDown}
            />
            
            <Button
                text={
                    loading ? "..." : (
                        <span className="send-btn-content">
                            Envoyer
                            <img src={sendIcon} alt="send" className="send-icon" />
                        </span>
                    )
                }
                type="button"
                className="message-send-btn"
                onClick={onSend}
            />
        </div>
    )
}