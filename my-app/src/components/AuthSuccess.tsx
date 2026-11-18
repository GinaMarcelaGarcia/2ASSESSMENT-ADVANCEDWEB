// AuthSuccess.tsx
// Shown inside the Sign In / Register modal for a moment after it works:
// a red circle and a check mark that draw themselves, plus a welcome message.

type AuthSuccessProps = {
    title: string;    // e.g. "Welcome back, emily!"
    subtitle: string; // e.g. "You are signed in."
};

function AuthSuccess({ title, subtitle }: AuthSuccessProps) {
    return (
        <div className="text-center py-4">
            <svg className="auth-check" viewBox="0 0 52 52" aria-hidden="true">
                <circle className="auth-check-circle" cx="26" cy="26" r="24" fill="none" />
                <path className="auth-check-mark" fill="none" d="M15 27 l7 7 15-15" />
            </svg>
            <h2 className="h5 fw-bold mt-3 mb-1">{title}</h2>
            <p className="text-muted small mb-0">{subtitle}</p>
        </div>
    );
}

export default AuthSuccess;