import React, { useEffect, useState } from 'react';
import Contents from '../container/Contents';
import { Card, Nav } from 'react-bootstrap';
import MyInterviews from './MyInterviews';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import './dashboard.css';

function Dashboard() {
	const [interviewStatus, setInterviewStatus] = useState('today');
	const [interviewData, setinterviewData] = useState(undefined);

	useEffect(() => {
		if (!interviewData) {
			const ticket = JSON.parse(localStorage.getItem('data'));
			axios
				.post('/api/fetchdashboard', { ...ticket })
				.then((res) => {
					if (res.data.isSuccess === true) {
						const { today, missed, upcoming } = res.data;
						setinterviewData({ today: today, missed: missed, upcoming: upcoming });
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
	return (
		<>
			<Contents>
				<div className="gy-3">
					<div className="col-md-11">
						<Card>
							<Card.Header style={{ background: 'lightskyblue' }}>
								<h3>My Interviews</h3>
								<Nav variant="tabs" defaultActiveKey="#first">
									<Nav.Item>
										<Nav.Link active={interviewStatus === 'missed' ? true : false} href="#missed" onClick={() => setInterviewStatus('missed')}>
											Missed Interview
										</Nav.Link>
									</Nav.Item>
									<Nav.Item>
										<Nav.Link href="#today" active={interviewStatus === 'today' ? true : false} onClick={() => setInterviewStatus('today')}>
											Today
										</Nav.Link>
									</Nav.Item>
									<Nav.Item>
										<Nav.Link active={interviewStatus === 'upcoming' ? true : false} href="#upcoming" onClick={() => setInterviewStatus('upcoming')}>
											Upcoming
										</Nav.Link>
									</Nav.Item>
								</Nav>
							</Card.Header>
							<Card.Body>{interviewData ? <MyInterviews data={interviewData} trigger={interviewStatus} /> : <h3>No Interviews Found!</h3>}</Card.Body>
						</Card>
					</div>
					<div className="col-md-11">
						<Card>
							<Card.Header style={{ background: 'lightskyblue' }}>
								<h3>My Referrals</h3>
							</Card.Header>
							<Card.Body>{interviewData ? <MyInterviews data={interviewData} trigger={interviewStatus} /> : <h3>No Interviews Found!</h3>}</Card.Body>
						</Card>
					</div>
				</div>
			</Contents>
		</>
	);
}

export default Dashboard;
