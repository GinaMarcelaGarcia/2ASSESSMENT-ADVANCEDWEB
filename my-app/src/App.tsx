import './App.css'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

function App() {
  return ( 
    <>
    <Navbar expand="lg" className="bg-body-tertiary" data-bs-theme="dark">
      <Container>
    <Navbar.Brand>Sample Website</Navbar.Brand>
    <Navbar.Toggle aria-controls="main-nav" />
    <Navbar.Collapse id="main-nav">
    </Navbar.Collapse>
    </Container>
    <nav>
      <Nav.Link href="/"> Home </Nav.Link>
      <Nav.Link href="/Album"> Album Detail </Nav.Link>
    </nav>

    </Navbar>
    <Container> 
      <h1> 
        Hello world
      </h1>


    </Container>
    </>
  )
}

export default App
