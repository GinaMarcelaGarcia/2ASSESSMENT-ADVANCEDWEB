// SiteNavbar.tsx
// Top bar shown on every page.
// - Genre menu comes from the database (api/genres.php)
// - Right side changes with the login: "Sign In" / "Register", or the username + "Log out"

import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Button from 'react-bootstrap/Button';
import { apiGet, apiPost } from '../api';
import { useNotify } from '../notification';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

type Genre = { id: number; name: string };
type User = { id: number; username: string };

function SiteNavbar() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [searchText, setSearchText] = useState("");

  const location = useLocation(); // current page, changes on every navigation
  const navigate = useNavigate(); // lets us change page from code
  const notify = useNotify();     // message at the top of the screen
  
  // Hamburger menu (small screens): open or closed.
  // It closes by itself when the page changes.
  const [expanded, setExpanded] = useState(false);
  const [menuPage, setMenuPage] = useState(location.pathname);
  if (menuPage !== location.pathname) {
    setMenuPage(location.pathname);
    setExpanded(false);
  }

  // Load the genres once, when the navbar first appears.
  // If it fails, the menu is just empty: the rest of the site still works.
  useEffect(() => {
    apiGet<Genre[]>('genres.php')
      .then(setGenres)
      .catch(() => setGenres([]));
  }, []);

  // Ask PHP who is logged in every time the page changes.
  // So after Login sends the user to another page, the navbar updates by itself.
  // location.key changes on every navigation, even to the same URL
  // (e.g. after changing the username on the account page).
  useEffect(() => {
    apiGet<User | null>('me.php')
      .then(setUser)
      .catch(() => setUser(null));
    }, [location.key]);

  async function handleLogout() {
    try {
      await apiPost('logout.php');
      setUser(null);
      notify('Logged out successfully.');
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }

  return (
    <Navbar expand="lg" className="tb-navbar" data-bs-theme="dark" expanded={expanded} onToggle={setExpanded}>
      <Container>
        <Navbar.Brand as={Link} to="/">TrackBack</Navbar.Brand>

        {/* Hamburger button, only visible on small screens */}
        <Navbar.Toggle aria-controls="main-nav" />

        <Navbar.Collapse id="main-nav">
          {/* Left side */}
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/" end>Home</Nav.Link>

            <NavDropdown title="Genres" id="genres-menu">
              {genres.map((genre) => (
                <NavDropdown.Item key={genre.id} as={Link} to={`/?genre=${genre.id}`}>
                  {genre.name}
                </NavDropdown.Item>
              ))}
            </NavDropdown>
          </Nav>

          
{/* Search bar in the centre */}
<Form
  className="tb-search-form"
  onSubmit={(event) => {
  event.preventDefault();

  const query = searchText.trim();
  const params = new URLSearchParams(location.search);

  if (query) {
    params.set("search", query);
  } else {
    params.delete("search");
  }

  navigate(params.toString() ? `/?${params.toString()}` : "/");
}}
>
  <InputGroup>
    <Form.Control
      type="search"
      placeholder="Search albums, artists..."
      aria-label="Search albums and artists"
      value={searchText}
      onChange={(event) => setSearchText(event.target.value)}
    />
    <Button type="submit" variant="light" aria-label="Search">
      <i className="bi bi-search"></i>
    </Button>
  </InputGroup>
</Form>
 

          {/* Right side: changes with the login */}
          <Nav className="align-items-lg-center gap-2">
            {user ? (
              <NavDropdown title={user.username} id="user-menu" align="end">
                <NavDropdown.Item as={Link} to="/account">My account</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>Log out</NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <Nav.Link as={NavLink} to="/register">Register</Nav.Link>
                <Button as={Link as any} to="/login" variant="light" className="tb-btn-light rounded-pill px-4">
                  Sign In
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default SiteNavbar;
