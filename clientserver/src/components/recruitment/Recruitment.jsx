import { useEffect, useState } from 'react';
import Contents from '../container/Contents';
import { Nav, NavLink, Navbar, Card, Button } from 'react-bootstrap';
import './recruitment.css';
import axios from 'axios';

export default function Recruitment() {
    const ticket = JSON.parse(localStorage.getItem('data'));
    const initialState = {
        nav_status: 'jobs',
        responseData: undefined,
    };

    const [{ nav_status, responseData }, setState] = useState(initialState);

    useEffect(() => {
        // if (!responseData) {
        axios.post('/api/recruitment', { ...ticket }).then((res) => {
            if (res.data && res.data.isSuccess === true) {
                console.log(res.data);
                const { jobs } = res.data;
                setState((prevState) => ({ ...prevState, responseData: { jobs } }));
            }
        });
        // }
    }, [nav_status]);
    return (
        <Contents>
            <Nav className="recruitment-nav" fill variant="tabs" activeKey={nav_status}>
                <Nav.Item>
                    <Nav.Link eventKey="jobs" onClick={() => setState((prevState) => ({ ...prevState, nav_status: 'jobs' }))}>
                        Jobs
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link
                        eventKey="candidates"
                        onClick={() =>
                            setState((prevState) => ({
                                ...prevState,
                                nav_status: 'candidates',
                            }))
                        }
                    >
                        Candidates
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link
                        eventKey="talent_pool"
                        onClick={() =>
                            setState((prevState) => ({
                                ...prevState,
                                nav_status: 'talent_pool',
                            }))
                        }
                    >
                        Talent Pool
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link
                        eventKey="conversation"
                        onClick={() =>
                            setState((prevState) => ({
                                ...prevState,
                                nav_status: 'conversation',
                            }))
                        }
                    >
                        Conversation
                    </Nav.Link>
                </Nav.Item>
            </Nav>

            <div className="gy-3" className="div-jobs">
                <div className="col-md-2">
                    <Card
                        // border="primary"
                        // bg="dark"
                        style={{ width: '13rem', height: '20rem', color: 'black' }}
                        className="mb-2 btn-outline-info"
                        as={Button}
                    >
                        <Card.Body>
                            <Card.Title>Junior Developer</Card.Title>
                            <Card.Subtitle style={{ fontSize: '10px', marginTop: '0px' }}>Regular or Permanent</Card.Subtitle>
                            <br />
                            <br />
                            <Card.Text>
                                <h4>3</h4>
                                Candidates
                            </Card.Text>
                            <p
                                style={{
                                    position: 'absolute',
                                    bottom: '0',
                                    right: '0',
                                    width: '100%',
                                    fontSize: '12px',
                                }}
                            >
                                PHP 20000 - PHP 30000
                            </p>
                        </Card.Body>
                    </Card>
                </div>
            </div>
        </Contents>
    );
}
