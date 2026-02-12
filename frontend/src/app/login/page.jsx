'use client';

import LogInForm from "../components/Auth/LogInForm";

export default function Page() {
  return (
    <div className="auth-page d-flex align-items-center justify-content-center">
        <h1 className="educhat">EduChat</h1>
      <LogInForm />
    </div>
  );
}
