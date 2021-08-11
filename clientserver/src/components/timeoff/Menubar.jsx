import { Navbar, Nav, Container } from 'react-bootstrap';
import { useState } from 'react';

export default function Menubar({ callback }) {
    const initialState = {
        active: 'mytimeoff',
    };

    const [{ active }, setState] = useState(initialState);

    const handleChange = (e) => {
        const { rbEventKey } = e.target.dataset;
        setState((prevState) => ({ ...prevState, active: rbEventKey }));
        callback(rbEventKey);
    };

    return (
        <Navbar className="mb-4" bg="dark" variant="dark" style={{ zIndex: 0 }}>
            <Container>
                <Nav className="me-auto" defaultActiveKey={active}>
                    <Nav.Link eventKey="mytimeoff" onClick={handleChange}>
                        My Timeoff
                    </Nav.Link>
                    <Nav.Link eventKey="employees_timeoff" onClick={handleChange}>
                        Other Employees Timeoff
                    </Nav.Link>
                </Nav>
            </Container>
        </Navbar>
    );
}
