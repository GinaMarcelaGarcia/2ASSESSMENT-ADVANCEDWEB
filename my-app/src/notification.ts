// notification.ts
// Lets any page show a small green message (toast), e.g. "Signed in successfully".
// Use it like this:  const notify = useNotify();  notify('Logged out successfully.');
// The toast itself is drawn by <NotificationProvider> (components/NotificationProvider.tsx).

import { createContext, useContext } from 'react';

export type Notify = (message: string) => void;

// The default does nothing, in case a page is used outside the provider
export const NotificationContext = createContext<Notify>(() => {});

export function useNotify(): Notify {
    return useContext(NotificationContext);
}