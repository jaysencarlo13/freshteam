import { Nav } from 'react-bootstrap';

export default function Sidebar({ trigger, compose }) {
    const handleClick = (e) => {
        e.preventDefault();
        const { rbEventKey } = e.target.dataset;
        trigger(rbEventKey);
    };
    const handleCompose = (e) => {
        e.preventDefault();
        compose(true);
    };
    return (
        <Nav variant="tabs" defaultActiveKey="all" className="flex-column align-content-center">
            <ul className="list-unstyled">
                <li>
                    <Nav.Link eventKey="all" onClick={handleClick}>
                        All
                    </Nav.Link>
                </li>
                <li>
                    <Nav.Link eventKey="candidates" onClick={handleClick}>
                        Candidates
                    </Nav.Link>
                </li>
                <li>
                    <Nav.Link eventKey="work" onClick={handleClick}>
                        Work
                    </Nav.Link>
                </li>
                <li>
                    <Nav.Link eventKey="compose" onClick={handleCompose}>
                        Compose
                    </Nav.Link>
                </li>
            </ul>
        </Nav>
    );
}
