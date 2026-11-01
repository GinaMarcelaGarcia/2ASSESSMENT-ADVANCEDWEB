// SiteFooter.tsx
// Bottom bar shown on every page.

import { Link } from 'react-router';
import Container from 'react-bootstrap/Container';

function SiteFooter() {
  const year = new Date().getFullYear(); // updates by itself every year

  return (
    <footer className="tb-footer py-4 mt-auto">
      <Container className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">
        <span>&copy; {year} TrackBack. Made by Dragonfruit.</span>

        <nav className="d-flex gap-3">
          {/* Footer links go back to the top of the page (the modals keep the page behind them) */}
          <Link to="/" onClick={() => window.scrollTo(0, 0)}>Home</Link>
          <Link to="/login" onClick={() => window.scrollTo(0, 0)}>Sign In</Link>
          <Link to="/register" onClick={() => window.scrollTo(0, 0)}>Register</Link>
        </nav>
      </Container>
    </footer>
  );
}

export default SiteFooter;
