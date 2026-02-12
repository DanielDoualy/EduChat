export default function Button ({type='submit', label}) {
    return (
        <div>
            <button type={type}>{label}</button>
        </div>
    );
}