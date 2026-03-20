export default function Button({ text, type='button', className, onClick }) {
    return (
        <button type={type} className={className} onClick={onClick}>
            {text}
        </button>
    )
}