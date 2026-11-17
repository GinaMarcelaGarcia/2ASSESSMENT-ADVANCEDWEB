// AccountSettings.tsx
// "Account Settings" tab of the My Account page.
// - Change username and e-mail (one at a time, with the edit icon)
// - Change password (asks for the current password)
// - Sign out
// Talks to api/account.php and api/logout.php.

import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router';
import PasswordInput from './PasswordInput';
import { apiGet, apiPost } from '../api';

type AccountDetails = { id: number; username: string; email: string };

// ---------- One field that can be edited (used for Username and Email) ----------

type EditableFieldProps = {
    id: string;
    label: string;
    type: 'text' | 'email';
    value: string;                                // value saved in the database
    onSave: (newValue: string) => Promise<void>;  // sends the new value to PHP
};

function EditableField({ id, label, type, value, onSave }: EditableFieldProps) {
    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState(value);    // what the user is typing
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);

    function startEditing() {
        setDraft(value);
        setError('');
        setEditing(true);
    }

    function cancelEditing() {
        setEditing(false);
        setError('');
    }

    async function handleSave() {
        setSaving(true);
        setError('');
        try {
            await onSave(draft.trim());
            setEditing(false);
        } catch (err) {
            // e.g. "This username is already taken."
            setError(err instanceof Error ? err.message : 'Something went wrong.');
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="mb-3">
            <label htmlFor={id} className="form-label small mb-1">{label}</label>
            <div className="d-flex align-items-center gap-2">
                <input
                    type={type}
                    id={id}
                    className={`form-control rounded-pill ${error ? 'is-invalid' : ''}`}
                    value={editing ? draft : value}
                    readOnly={!editing}
                    onChange={(e) => setDraft(e.target.value)}
                />

                {editing ? (
                    <>
                        <button type="button" className="btn btn-sm text-white rounded-pill px-3" style={{ backgroundColor: 'var(--tb-primary)' }} onClick={handleSave} disabled={saving}>
                            {saving ? 'Saving...' : 'Save'}
                        </button>
                        <button type="button" className="btn btn-sm btn-outline-secondary rounded-pill px-3" onClick={cancelEditing} disabled={saving}>
                            Cancel
                        </button>
                    </>
                ) : (
                    <button type="button" className="btn btn-link p-1" style={{ color: 'var(--tb-primary)' }} onClick={startEditing} aria-label={`Edit ${label}`}>
                        <i className="bi bi-pencil-square fs-5"></i>
                    </button>
                )}
            </div>
            {error && <div className="text-danger small mt-1">{error}</div>}
        </div>
    );
}

// ---------- The Account Settings tab ----------

function AccountSettings() {
    const navigate = useNavigate();
    const [account, setAccount] = useState<AccountDetails | null>(null);
    const [loadError, setLoadError] = useState('');
    const [message, setMessage] = useState(''); // green message after a change

    // Change password form
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [savingPassword, setSavingPassword] = useState(false);

    // Load the username and e-mail when the tab opens
    useEffect(() => {
        apiGet<AccountDetails>('account.php')
            .then(setAccount)
            .catch((err) => setLoadError(err instanceof Error ? err.message : 'Could not load your account.'));
    }, []);

    async function saveUsername(username: string) {
        await apiPost('account.php', { action: 'username', username });
        setAccount((old) => (old ? { ...old, username } : old));
        setMessage('Username updated.');
        // Same URL again: the navbar asks PHP who is logged in and shows the new name
        navigate('/account?tab=settings', { replace: true });
    }

    async function saveEmail(email: string) {
        await apiPost('account.php', { action: 'email', email });
        setAccount((old) => (old ? { ...old, email } : old));
        setMessage('E-mail updated.');
    }

    function closePasswordForm() {
        setShowPasswordForm(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setPasswordError('');
    }

    async function handlePasswordSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setPasswordError('');

        // Same rules as the Register page, checked here before calling PHP
        if (currentPassword === '' || newPassword === '' || confirmPassword === '') {
            setPasswordError('Please fill in all the password fields.');
            return;
        }
        if (newPassword.length < 8) {
            setPasswordError('New password must have at least 8 characters.');
            return;
        }
        if (newPassword !== confirmPassword) {
            setPasswordError('Passwords do not match.');
            return;
        }

        setSavingPassword(true);
        try {
            await apiPost('account.php', { action: 'password', currentPassword, newPassword });
            closePasswordForm();
            setMessage('Password changed.');
        } catch (err) {
            // e.g. "Current password is incorrect."
            setPasswordError(err instanceof Error ? err.message : 'Something went wrong.');
        } finally {
            setSavingPassword(false);
        }
    }

    async function handleSignOut() {
        try {
            await apiPost('logout.php');
            navigate('/');
        } catch {
            setLoadError('Could not sign out. Please try again.');
        }
    }

    if (loadError) {
        return <div className="alert alert-danger py-2 small">{loadError}</div>;
    }
    if (!account) {
        return <p className="text-muted">Loading...</p>;
    }

        return (
        <>
            {message && <div className="alert alert-success py-2 small">{message}</div>}

            <div className="row g-4">
                {/* Left card: profile details */}
                <div className="col-6">
                    <section className="account-card h-100">
                        <h2 className="h5 fw-bold mb-1">Profile details</h2>
                        <p className="text-muted small mb-4">Click the pencil to change your username or e-mail.</p>

                        <EditableField
                            id="account-username"
                            label="Username"
                            type="text"
                            value={account.username}
                            onSave={saveUsername}
                        />

                        <EditableField
                            id="account-email"
                            label="Email"
                            type="email"
                            value={account.email}
                            onSave={saveEmail}
                        />
                    </section>
                </div>

                {/* Right card: password and sign out */}
                <div className="col-6">
                    <section className="account-card h-100">
                        <h2 className="h5 fw-bold mb-1">Password and security</h2>
                        <p className="text-muted small mb-4">You need your current password to set a new one.</p>

                        {/* Change password: the button opens a small form */}
                        {showPasswordForm ? (
                            <form onSubmit={handlePasswordSubmit} noValidate>
                                {passwordError && <div className="alert alert-danger py-2 small">{passwordError}</div>}

                                <div className="mb-2">
                                    <PasswordInput id="currentPassword" placeholder="Current password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                                </div>
                                <div className="mb-2">
                                    <PasswordInput id="newPassword" placeholder="New password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                                </div>
                                <div className="mb-3">
                                    <PasswordInput id="confirmNewPassword" placeholder="Repeat new password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                                </div>

                                <div className="d-flex gap-2">
                                    <button type="submit" className="btn text-white rounded-pill px-4" style={{ backgroundColor: 'var(--tb-primary)' }} disabled={savingPassword}>
                                        {savingPassword ? 'Saving...' : 'Save password'}
                                    </button>
                                    <button type="button" className="btn btn-outline-secondary rounded-pill px-4" onClick={closePasswordForm} disabled={savingPassword}>
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <button type="button" className="btn text-white rounded-pill px-4" style={{ backgroundColor: 'var(--tb-primary)' }} onClick={() => { setMessage(''); setShowPasswordForm(true); }}>
                                Change password
                            </button>
                        )}

                        <hr className="my-4" />

                        <button type="button" className="btn rounded-pill px-4" style={{ border: '1px solid var(--tb-primary)', color: 'var(--tb-primary)' }} onClick={handleSignOut}>
                            Sign out
                        </button>
                    </section>
                </div>
            </div>
        </>
    );
}

export default AccountSettings;