import './App.css';
import './theme.css';
import { Routes, Route } from 'react-router';
import Container from 'react-bootstrap/Container';
import SiteNavbar from './components/SiteNavbar';
import SiteFooter from './components/SiteFooter';
import Home from './pages/Home';


// Layout: navbar on top, page in the middle, footer at the bottom.
// The <Route> lines are placeholders: each person swaps theirs for the real page component.
function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <SiteNavbar />

      <main className="flex-grow-1">
        <Container fluid className="p-0">
          <Routes>
            <Route path="/" element={<Home />} />                     {/* Gina */}
            <Route path="/album/:id" element={<h1>Album Detail</h1>} />    {/* Gina */}
            <Route path="/login" element={<h1>Sign In</h1>} />             {/* Emily */}
            <Route path="/register" element={<h1>Create Account</h1>} />  {/* Emily */}
            <Route path="*" element={<h1>Page not found</h1>} />
          </Routes>
        </Container>
      </main>

      <SiteFooter />
    </div>
  );
}

export default App;
