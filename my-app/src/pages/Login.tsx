import { useState, type FormEvent } from 'react';
import { Link } from 'react-router';
import Modal from 'react-bootstrap/Modal';
import PasswordInput from '../components/PasswordInput';
import './auth.css';

type LoginErrors = {
    email?: string;
    password?: string;
};

type LoginProps = {
    onClose: () => void; // app tells the App what to do when the modal is closed
};

function Login({ onClose }: LoginProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<LoginErrors>({});

    function validate(): LoginErrors {
        const newErrors: LoginErrors = {};
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email.trim())) {
            newErrors.email = 'Please enter a valid e-mail.';
        }
        // password only needs to be filled: the PHP API checks if it's correct
        if (password === '') {
            newErrors.password = 'Please enter your password.';
        }
        return newErrors;
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault(); // does not reload the page

        const newErrors = validate();
        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            // next step: send the data to the PHP API
            console.log('Form is valid:', { email });
        }
    }

    return (
        <Modal show onHide={onClose} centered dialogClassName="auth-modal">
            <Modal.Header closeButton closeVariant="white">
                <Modal.Title as="span" className="fs-6 fw-bold">TrackBack</Modal.Title>
            </Modal.Header>

            <Modal.Body className="p-4">
                <h1 className="h4 text-center fw-bold mb-4">Sign In</h1>

                <form onSubmit={handleSubmit} noValidate>
                    <div className="mb-3">
                        <input
                            type="email"
                            id="email"
                            className={`form-control rounded-pill ${errors.email ? 'is-invalid' : ''}`}
                            placeholder="email@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                    </div>

                    <div className="mb-1">
                        <PasswordInput
                            id="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            error={errors.password}
                        />
                    </div>

                    <div className="text-end mb-4">
                        <a href="#" className="small text-decoration-none" style={{ color: 'var(--tb-primary)' }}>Forgot password?</a>
                    </div>

                    <div className="text-center">
                        <button type="submit" className="btn text-white rounded-pill px-5" style={{ backgroundColor: 'var(--tb-primary)' }}>
                            Sign In
                        </button>
                    </div>
                </form>

                <p className="text-center small text-muted my-2">Or</p>

                <div className="text-center">
                    <button type="button" className="btn rounded-pill px-4" style={{ border: '1px solid var(--tb-primary)', color: 'var(--tb-primary)' }} onClick={onClose}>
                        Continue as guest
                    </button>
                </div>

                <p className="text-center small mt-4 mb-0">
                    Don't have an account? <Link to="/register" className="fw-bold text-decoration-none" style={{ color: 'var(--tb-primary)' }}>Sign Up</Link>
                </p>
            </Modal.Body>
        </Modal>
    );
}

export default Login;