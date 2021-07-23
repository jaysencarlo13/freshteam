import { Nav } from 'react-bootstrap';
export default function Navigation({ active }) {
    return (
        <Nav className="recruitment-nav" fill variant="tabs" activeKey={active}>
            <Nav.Item>
                <Nav.Link eventKey="jobs" href="/recruitment">
                    Jobs
                </Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link eventKey="candidates" href="/recruitment/candidates">
                    Candidates
                </Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link eventKey="talent_pool" href="/recruitment/talentpool">
                    Talent Pool
                </Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link eventKey="conversation" href="/recruitment/conversation">
                    Conversation
                </Nav.Link>
            </Nav.Item>
        </Nav>
    );
}
