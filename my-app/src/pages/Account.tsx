// Account.tsx
// "My Account" page, only for users who are logged in.
// It has 3 tabs: My reviews (Vinny), My favourites (Gina) and Account Settings (Emily).
// The open tab is saved in the URL (?tab=settings), so a refresh keeps the same tab.

import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import Container from 'react-bootstrap/Container';
import { apiGet } from '../api';
import AccountSettings from '../components/AccountSettings';
import MyReviews from '../components/MyReviews';
import './Account.css';

type User = { id: number; username: string };

type AccountProps = {
    modalOpen: boolean; // true while the Sign In / Register modal is open on top of this page
};

// Each tab: the value in the URL and the text on the button / title
const TABS = [
    { key: 'reviews', label: 'My reviews', title: 'Reviews' },
    { key: 'favourites', label: 'My favourites', title: 'Favourites' },
    { key: 'settings', label: 'Account Settings', title: 'Settings' },
];

function Account({ modalOpen }: AccountProps) {
    const [searchParams, setSearchParams] = useSearchParams();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true); // true while we ask PHP who is logged in

    // Which tab is open. If the URL has no valid tab, open "My reviews".
    const tabInUrl = searchParams.get('tab');
    const activeTab = TABS.find((tab) => tab.key === tabInUrl) ?? TABS[0];

    // Only logged-in users can see this page: ask PHP who is logged in.
    // It asks again when the Sign In modal closes, so after logging in the account shows up.
    useEffect(() => {
        apiGet<User | null>('me.php')
            .then(setUser)
            .catch(() => setUser(null))
            .finally(() => setLoading(false));
    }, [modalOpen]);

    // While we wait for PHP, show nothing (avoids a flash of the page)
    if (loading) {
        return null;
    }

    // Nobody logged in: ask them to sign in
    if (!user) {
        return (
            <Container className="py-5 text-center">
                <h1 className="h4 fw-bold">My Account</h1>
                <p className="text-muted">Please sign in to see your account.</p>
                <Link to="/login" className="btn text-white rounded-pill px-5" style={{ backgroundColor: 'var(--tb-primary)' }}>
                    Sign In
                </Link>
            </Container>
        );
    }

    return (
        <Container className="py-4">
            <h1 className="h3 fw-bold mb-1">My Account - {activeTab.title}</h1>
            <p className="account-subtitle small mb-4">Manage your reviews, favourites and account details</p>

            {/* Tabs */}
            <div className="d-flex flex-wrap gap-2 mb-4">
                {TABS.map((tab) => (
                    <button
                        key={tab.key}
                        type="button"
                        className={`btn rounded-pill px-4 account-tab ${tab.key === activeTab.key ? 'active' : ''}`}
                        onClick={() => setSearchParams({ tab: tab.key })}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content of the open tab */}
            {/* My reviews: Vinny */}
            {activeTab.key === 'reviews' && (
                <MyReviews />
            )}

            {/* My favourites: Gina */}
            {activeTab.key === 'favourites' && (
                <p className="text-muted">Your favourite albums will appear here.</p>
            )}

            {/* Account Settings: Emily */}
            {activeTab.key === 'settings' && (
                <AccountSettings />
            )}
        </Container>
    );
}

export default Account;