import { useState, type FormEvent } from 'react';
import { Link } from 'react-router';
import Modal from 'react-bootstrap/Modal';
import PasswordInput from '../components/PasswordInput';
import './auth.css';

type RegisterErrors = {
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
};

type RegisterProps = {
    onClose: () => void; // o App diz o que fazer quando fecha o modal
};

function Register({ onClose }: RegisterProps) {
    // Um state para cada campo do formulário
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState<RegisterErrors>({});

    function validate(): RegisterErrors {
        const newErrors: RegisterErrors = {};
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (username.trim() === '') {
            newErrors.username = 'Please enter a username.';
        }
        if (!emailPattern.test(email.trim())) {
            newErrors.email = 'Please enter a valid e-mail.';
        }
        if (password.length < 8) {
            newErrors.password = 'Password must have at least 8 characters.';
        }
        if (confirmPassword === '' || confirmPassword !== password) {
            newErrors.confirmPassword = 'Passwords do not match.';
        }
        return newErrors;
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault(); // não recarrega a página

        const newErrors = validate();
        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            // Próximo passo: enviar os dados para a API em PHP
            console.log('Form is valid:', { username, email });
        }
    }

    return (
                <Modal show onHide={onClose} centered dialogClassName="auth-modal">
                <Modal.Header closeButton closeVariant="white">
                    <Modal.Title as="span" className="fs-6 fw-bold">TrackBack</Modal.Title>
                </Modal.Header>

                <Modal.Body className="p-4">
                    <h1 className="h4 text-center fw-bold">Create Account</h1>
                    <p className="text-center small">
                        Already have an account? <Link to="/login" style={{ color: 'var(--tb-primary)' }}>Sign in</Link>
                    </p>

                    <form onSubmit={handleSubmit} noValidate>
                        <div className="mb-3">
                            <input
                                type="text"
                                id="username"
                                className={`form-control rounded-pill ${errors.username ? 'is-invalid' : ''}`}
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            {errors.username && <div className="invalid-feedback">{errors.username}</div>}
                        </div>

                        <div className="mb-3">
                            <input
                                type="email"
                                id="email"
                                className={`form-control rounded-pill ${errors.email ? 'is-invalid' : ''}`}
                                placeholder="E-mail"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                        </div>

                        <div className="mb-3">
                            <PasswordInput
                                id="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                error={errors.password}
                            />
                        </div>

                        <div className="mb-4">
                            <PasswordInput
                                id="confirmPassword"
                                placeholder="Repeat password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                error={errors.confirmPassword}
                            />
                        </div>

                        <div className="text-center">
                            <button type="submit" className="btn text-white rounded-pill px-5" style={{ backgroundColor: 'var(--tb-primary)' }}>
                                Sign Up
                            </button>
                        </div>
                    </form>
                </Modal.Body>
        </Modal>
    );
}

export default Register;