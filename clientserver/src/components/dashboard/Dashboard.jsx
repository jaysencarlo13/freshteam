import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { Card, Nav } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';

import './dashboard.css';

import Contents from '../container/Contents';
import MyInterviews from './MyInterviews';
import MyReferrals from './MyReferrals';
import BirthdayCorner from './BirthdayCorner';
import NewJoinees from './NewJoinees';
import Spinner from '../container/Spinner';

function Dashboard() {
    const [interviewStatus, setInterviewStatus] = useState('today');
    const [interviewData, setinterviewData] = useState(undefined);
    const [spin, setSpin] = useState(true);

    useEffect(() => {
        if (!interviewData) {
            const ticket = JSON.parse(localStorage.getItem('data'));
            axios
                .post('/api/fetchdashboard', { ...ticket })
                .then((res) => {
                    if (res.data.isSuccess === true) {
                        const { today, missed, upcoming, referrals, birthday_corner, new_joinees } = res.data;
                        setinterviewData({
                            today: today,
                            missed: missed,
                            upcoming: upcoming,
                            referrals: referrals,
                            birthday_corner: birthday_corner,
                            new_joinees: new_joinees,
                        });
                        setSpin(false);
                    } else if (res.data.isAuthenticated === false) {
                        localStorage.clear();
                        return <Redirect path="/login" />;
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    });
    if (!spin)
        return (
            <Contents>
                <div className="gy-3">
                    <div className="col-md-11">
                        <Card>
                            <Card.Header style={{ background: 'lightskyblue' }}>
                                <h3>My Interviews</h3>
                                <Nav variant="tabs" defaultActiveKey="#first">
                                    <Nav.Item>
                                        <Nav.Link
                                            active={interviewStatus === 'missed' ? true : false}
                                            href="#missed"
                                            onClick={() => setInterviewStatus('missed')}
                                        >
                                            Missed Interview
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link
                                            href="#today"
                                            active={interviewStatus === 'today' ? true : false}
                                            onClick={() => setInterviewStatus('today')}
                                        >
                                            Today
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link
                                            active={interviewStatus === 'upcoming' ? true : false}
                                            href="#upcoming"
                                            onClick={() => setInterviewStatus('upcoming')}
                                        >
                                            Upcoming
                                        </Nav.Link>
                                    </Nav.Item>
                                </Nav>
                            </Card.Header>
                            <Card.Body>
                                {interviewData && interviewData[interviewStatus].length !== 0 ? (
                                    <MyInterviews data={interviewData[interviewStatus]} />
                                ) : (
                                    <h3>No Interviews Found!</h3>
                                )}
                            </Card.Body>
                        </Card>
                    </div>
                    <div className="col-md-11">
                        <Card>
                            <Card.Header style={{ background: 'lightskyblue' }}>
                                <h3>My Referrals</h3>
                            </Card.Header>
                            <Card.Body>
                                {interviewData && interviewData['referrals'].length !== 0 ? (
                                    <MyReferrals data={interviewData['referrals']} />
                                ) : (
                                    <h3>No Referrals Found!</h3>
                                )}
                            </Card.Body>
                        </Card>
                    </div>
                    <div className="col-md-11">
                        <Card>
                            <Card.Header style={{ background: 'lightskyblue' }}>
                                <h3>Birthday Corner</h3>
                            </Card.Header>
                            <Card.Body>
                                {interviewData && interviewData['birthday_corner'].length !== 0 ? (
                                    <BirthdayCorner data={interviewData['birthday_corner']} />
                                ) : (
                                    <h3>No upcoming birthdays this month!</h3>
                                )}
                            </Card.Body>
                        </Card>
                    </div>
                    <div className="col-md-11">
                        <Card>
                            <Card.Header style={{ background: 'lightskyblue' }}>
                                <h3>New Joinees</h3>
                            </Card.Header>
                            <Card.Body>
                                {interviewData && interviewData['new_joinees'].length !== 0 ? (
                                    <NewJoinees data={interviewData['new_joinees']} />
                                ) : (
                                    <h3>No New Hires in the past 7days!</h3>
                                )}
                            </Card.Body>
                        </Card>
                    </div>
                </div>
            </Contents>
        );
    else
        return (
            <Contents>
                <Spinner />
            </Contents>
        );
}

export default Dashboard;
