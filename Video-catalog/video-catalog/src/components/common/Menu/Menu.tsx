import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link } from 'react-router';

const Menu = () => {
    return (
        <Navbar collapseOnSelect expand="lg" className="bg-light">
            <Container>
                <Navbar.Brand href="/">Movie List App</Navbar.Brand>

                <Navbar.Toggle aria-controls="responsive-navbar-nav" />

                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                        {/* <Nav.Link href="/">Home</Nav.Link> */}
                        
                        <Nav.Link as={Link} to="/MovieList" >List of Movies</Nav.Link>

                    </Nav>
                    <NavDropdown title="Personalize" id="basic-nav-dropdown">
                        {/* <NavDropdown.Item href="#">
                            Favorites
                        </NavDropdown.Item> */}
                        <NavDropdown.Item href="#">
                            Change Theme
                        </NavDropdown.Item>
                    </NavDropdown>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Menu;