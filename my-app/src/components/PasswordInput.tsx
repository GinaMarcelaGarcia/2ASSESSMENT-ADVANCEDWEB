import { useState, type ChangeEvent } from 'react';

type PasswordInputProps = {
    id: string;
    placeholder: string;
    value: string;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    error?: string;
};

// Campo de senha com o botão de mostrar/esconder (usado no Register e no Login)
function PasswordInput({ id, placeholder, value, onChange, error }: PasswordInputProps) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="input-group has-validation">
            <input
                type={showPassword ? 'text' : 'password'}
                id={id}
                name={id}
                className={`form-control rounded-start-pill ${error ? 'is-invalid' : ''}`}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
            />
            <button
                type="button"
                className="input-group-text rounded-end-pill bg-white"
                onClick={() => setShowPassword(!showPassword)}
            >
                <i className={showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'}></i>
            </button>
            {error && <div className="invalid-feedback">{error}</div>}
        </div>
    );
}

export default PasswordInput;