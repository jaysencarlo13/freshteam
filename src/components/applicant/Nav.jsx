import { Navbar, Nav, Container } from 'react-bootstrap';
export default function Navigation({ name }) {
    return (
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
            <Container>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto"></Nav>
                    <Nav>
                        <Nav.Link as="h5" style={{ marginRight: '100px' }}>
                            Welcome {name}
                        </Nav.Link>
                        <Nav.Link href="/applicant/homepage">Home</Nav.Link>
                        <Nav.Link href="/applicant/manage_account">Manage Account</Nav.Link>
                        <Nav.Link eventKey={2} href="/logout">
                            Logout
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
