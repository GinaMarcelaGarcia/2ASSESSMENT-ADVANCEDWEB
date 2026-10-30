import './App.css';
import './theme.css';
import { useState } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router';
import Container from 'react-bootstrap/Container';
import SiteNavbar from './components/SiteNavbar';
import SiteFooter from './components/SiteFooter';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import AlbumDetail from './pages/AlbumDetail';

// Layout: navbar on top, page in the middle, footer at the bottom.
// The <Route> lines are placeholders: each person swaps theirs for the real page component.

// Pages that open as a modal on top of the page the user was on
const MODAL_PAGES = ['/login', '/register'];

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const isModal = MODAL_PAGES.includes(location.pathname);

  // Last normal page visited (stays behind the modal). Starts at Home.
  const [backgroundPage, setBackgroundPage] = useState('/');
  const currentPage = location.pathname + location.search;

  // On a normal page, remember it as the background
  if (!isModal && backgroundPage !== currentPage) {
    setBackgroundPage(currentPage);
  }

  // Closing the modal goes back to the page behind it
  function closeModal() {
    navigate(backgroundPage);
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <SiteNavbar />

      <main className="flex-grow-1">
        {/* Full width, no padding: each page wraps its own content in <Container className="py-4">.
    Only full width parts (e.g. Home banner) stay outside a Container. */}
        <Container fluid className="p-0">
          {/* While a modal is open, keep showing the page behind it */}
          <Routes location={isModal ? backgroundPage : location}>
            <Route path="/" element={<Home />} />                     {/* Gina */}
           <Route path="/album/:id" element={<AlbumDetail />} />    {/* Gina */}
            <Route path="*" element={<Container className="py-4"><h1>Page not found</h1></Container>} />
          </Routes>

          {/* Login and Register open as a modal */}
          {isModal && (
            <Routes>
              <Route path="/login" element={<Login onClose={closeModal} />} /> {/* Emily */}
              <Route path="/register" element={<Register onClose={closeModal} />} />  {/* Emily */}
            </Routes>
          )}
        </Container>
      </main>

      <SiteFooter />
    </div>
  );
}

export default App;