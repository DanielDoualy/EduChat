export default function InputField({ label, placeholder, type='text', className, name, value, onChange, onKeyDown, inputRef }) {
    return (
        <div className="form-group">
            {label && (
                <label>
                    <strong>{label}</strong>
                </label>
            )}
            <input
                ref={inputRef}
                type={type}
                className={className}
                placeholder={placeholder}
                name={name}
                value={value}
                onChange={onChange}
                onKeyDown={onKeyDown}
            />
        </div>
    )
}