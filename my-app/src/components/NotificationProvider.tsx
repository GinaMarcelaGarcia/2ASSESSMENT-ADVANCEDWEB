// NotificationProvider.tsx
// Wraps the whole site (in App.tsx) and draws a small message at the top of the screen.
// Pages call useNotify() (from notification.ts) to show it, e.g. after logging out.

import { useEffect, useState, type ReactNode } from 'react';
import { NotificationContext } from '../notification';
import './Notification.css';

type ToastMessage = { id: number; text: string };

function NotificationProvider({ children }: { children: ReactNode }) {
    const [toast, setToast] = useState<ToastMessage | null>(null);

    function notify(text: string) {
        setToast({ id: Date.now(), text }); // new id = the animation starts again
    }

    // Hide the message after 2.5 seconds (a new message restarts the timer)
    useEffect(() => {
        if (!toast) {
            return;
        }
        const timer = setTimeout(() => setToast(null), 2500);
        return () => clearTimeout(timer);
    }, [toast]);

    return (
        <NotificationContext.Provider value={notify}>
            {children}

            {toast && (
                <div key={toast.id} className="tb-toast" role="status">
                    <span className="tb-toast-icon"><i className="bi bi-check-lg"></i></span>
                    <span>{toast.text}</span>
                </div>
            )}
        </NotificationContext.Provider>
    );
}

export default NotificationProvider;