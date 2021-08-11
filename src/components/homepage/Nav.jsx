import { Navbar, Nav, Container } from 'react-bootstrap';
export default function Navigation() {
    return (
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
            <Container>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto"></Nav>
                    <Nav>
                        <Nav.Link href="/homepage">Home</Nav.Link>
                        <Nav.Link href="/login_applicant">Applicant</Nav.Link>
                        <Nav.Link eventKey={2} href="/login">
                            Employers/Employed
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
