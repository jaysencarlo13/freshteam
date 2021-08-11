import { Navbar, Nav, Container } from 'react-bootstrap';
import { useState } from 'react';

export default function Menubar({ callback }) {
    const initialState = {
        active: 'directories',
    };

    const [{ active }, setState] = useState(initialState);

    const handleChange = (e) => {
        const { rbEventKey } = e.target.dataset;
        setState((prevState) => ({ ...prevState, active: rbEventKey }));
        callback(rbEventKey);
    };

    return (
        <Navbar bg="dark" variant="dark" style={{ zIndex: 0 }}>
            <Container>
                <Nav className="me-auto" defaultActiveKey={active}>
                    <Nav.Link eventKey="directories" onClick={handleChange}>
                        Employee Directory
                    </Nav.Link>
                    <Nav.Link eventKey="onboarding" onClick={handleChange}>
                        Onboarding
                    </Nav.Link>
                    <Nav.Link eventKey="offboarding" onClick={handleChange}>
                        Offboarding
                    </Nav.Link>
                </Nav>
            </Container>
        </Navbar>
    );
}
