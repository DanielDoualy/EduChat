'use client';

export default function InputField({ label, placeholder, type = "text" }) {
  return (
    <div className="mb-3">
      <label className="form-label">{label}</label>
      <input
        type={type}
        className="form-control auth-input"
        placeholder={placeholder} 
        required
      />
    </div>
  );
}
