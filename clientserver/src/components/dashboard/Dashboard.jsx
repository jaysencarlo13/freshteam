import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { Card, Nav, Button } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';

import './dashboard.css';

import Contents from '../container/Contents';
import MyInterviews from './MyInterviews';
import MyReferrals from './MyReferrals';
import BirthdayCorner from './BirthdayCorner';
import NewJoinees from './NewJoinees';
import Spinner from '../container/Spinner';
import { ServerAuth, Auth } from '../../Auth';
import Superuser from './Superuser';
import AdminFresh from './AdminFresh';
import ModalDone from './MyInterviewsModalDone';
import Logout from '../logout/Logout';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Dashboard() {
	const role = JSON.parse(localStorage.getItem('data')) ? JSON.parse(localStorage.getItem('data')).user.usertype : undefined;
	const ticket = JSON.parse(localStorage.getItem('data'));
	const [interviewStatus, setInterviewStatus] = useState('today');
	const [interviewData, setinterviewData] = useState(undefined);
	const [spin, setSpin] = useState(true);
	const [spin2, setSpin2] = useState(false);
	const [spin3, setSpin3] = useState(false);
	const [transferResponse, setTransferResponse] = useState(undefined);
	const [requestResponse, setRequestResponse] = useState(undefined);
	const [superuser, setSuperuser] = useState(undefined);
	const [spinSuperuser, setSpinSuperUser] = useState(true);
	const [update, setUpdate] = useState(false);
	const [show_modal_done, setShow_modal_done] = useState(false);
	const [modal_done_data, setModal_done_data] = useState(undefined);
	const [messenger, setMessenger] = useState(undefined);
	const [logout, setLogout] = useState(false);

	useEffect(() => {
		if (role !== 'fresh' && role !== 'applicant' && role !== 'superuser' && role !== 'admin_fresh') {
			const ticket = JSON.parse(localStorage.getItem('data'));
			axios
				.post('/api/fetchdashboard', { ...ticket })
				.then((res) => {
					if (res.data.isSuccess === true) {
						const { today, missed, upcoming, referrals, birthday_corner, new_joinees, messenger } = res.data;
						setinterviewData({
							today: today,
							missed: missed,
							upcoming: upcoming,
							referrals: referrals,
							birthday_corner: birthday_corner,
							new_joinees: new_joinees,
						});
						setMessenger(messenger);
						setSpin(false);
					} else if (res.data.isAuthenticated === false) {
						localStorage.clear();
						return <Redirect path="/login" />;
					}
				})
				.catch((err) => {});
		}
		if (role === 'superuser') {
			axios
				.post('/api/superuser', { ...ticket })
				.then((res) => {
					if (res.data.isSuccess === true) {
						setSuperuser(res.data.table);
						setSpinSuperUser(false);
					} else if (res.data.isAuthenticated === false) {
						<ServerAuth />;
					}
				})
				.catch((err) => {
					setSpinSuperUser(false);
				});
		}
	}, [update]);

	const handleTransfer = () => {
		setSpin2(true);
		axios
			.post('/api/user/transfer/applicant', { ...ticket })
			.then((res) => {
				if (res.data.isSuccess === true) {
					setSpin2(false);
					setLogout(true);
				}
			})
			.catch((err) => {
				setSpin2(false);
				toast.error(err.response.data.message, {
					position: toast.POSITION.TOP_LEFT,
					autoClose: 5000,
				});
			});
	};

	const handleRequestAdmin = () => {
		setSpin3(true);
		axios
			.post('/api/user/admin_request', { ...ticket })
			.then((res) => {
				if (res.data.isSuccess === true) {
					setSpin3(false);
					setRequestResponse(res.data.message);
					toast.success(res.data.message, {
						position: toast.POSITION.TOP_LEFT,
						autoClose: 3000,
					});
				} else if (res.data.isSuccess === false) {
					setSpin3(false);
					setRequestResponse(res.data.message);
					toast.error(res.data.message, {
						position: toast.POSITION.TOP_LEFT,
						autoClose: 3000,
					});
				} else if (res.data.isAuthenticated === false) {
					<ServerAuth />;
				}
			})
			.catch((err) => {
				toast.error(err.response.data.message, {
					position: toast.POSITION.TOP_LEFT,
					autoClose: 3000,
				});
				setSpin3(false);
			});
	};

	const handleReload = () => {
		setSuperuser(undefined);
		setSpinSuperUser(true);
		setUpdate(!update);
	};

	const handleShow_modalDone = (e) => {
		setShow_modal_done(true);
		setModal_done_data(e);
	};

	const handleClose_modalDone = () => {
		setinterviewData(undefined);
		setUpdate(!update);
		setShow_modal_done(false);
		setModal_done_data(undefined);
		setSpin(true);
	};

	if (role === 'admin_fresh') {
		return <AdminFresh callback={handleReload} />;
	}

	if (role === 'superuser') {
		if (spinSuperuser) return <Spinner />;
		return <Superuser request={superuser} callback={handleReload} />;
	}

	if (role === 'fresh')
		return logout ? (
			<Logout isTransfer={true} />
		) : (
			<Contents>
				<div className="row justify-content-center">
					<div className="col-8" style={{ textAlign: 'center', color: 'red' }}>
						You don't have an organization yet. Please kindly inform your organization to add you in their members. Thank you.
					</div>
					<hr />
					<div className="col-8" style={{ textAlign: 'center', color: 'red' }}>
						If you are still an applicant and looking for a job. Transfer your account to applicant click this button below.
					</div>
					<div className="col-8" style={{ textAlign: 'center', marginTop: '10px' }}>
						{spin2 ? (
							<Spinner />
						) : transferResponse ? (
							<h3>{transferResponse}</h3>
						) : (
							<Button variant="info" onClick={handleTransfer}>
								Transfer this account to applicant
							</Button>
						)}
					</div>
					<div className="col-8" style={{ textAlign: 'center', color: 'red' }}>
						If you wish to manage an organization click this button below.
					</div>
					<div className="col-8" style={{ textAlign: 'center', marginTop: '10px' }}>
						{spin3 ? (
							<Spinner />
						) : requestResponse ? (
							<h3>{requestResponse}</h3>
						) : (
							<Button variant="info" onClick={handleRequestAdmin}>
								Request to be an admin
							</Button>
						)}
					</div>
				</div>
			</Contents>
		);

	if (!spin)
		return (
			<Contents>
				<div className="gy-3" style={{ marginBottom: '100px' }}>
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
							<Card.Body>
								{interviewData && interviewData[interviewStatus].length !== 0 ? <MyInterviews data={interviewData[interviewStatus]} callback={handleShow_modalDone} /> : <h3>No Interviews Found!</h3>}
							</Card.Body>
						</Card>
					</div>
					<div className="col-md-11">
						<Card>
							<Card.Header style={{ background: 'lightskyblue' }}>
								<h3>My Referrals</h3>
							</Card.Header>
							<Card.Body>{interviewData && interviewData['referrals'].length !== 0 ? <MyReferrals data={interviewData['referrals']} /> : <h3>No Referrals Found!</h3>}</Card.Body>
						</Card>
					</div>
					<div className="col-md-11">
						<Card>
							<Card.Header style={{ background: 'lightskyblue' }}>
								<h3>Birthday Corner</h3>
							</Card.Header>
							<Card.Body>
								{interviewData && interviewData['birthday_corner'].length !== 0 ? <BirthdayCorner data={interviewData['birthday_corner']} /> : <h3>No upcoming birthdays this month!</h3>}
							</Card.Body>
						</Card>
					</div>
					<div className="col-md-11">
						<Card>
							<Card.Header style={{ background: 'lightskyblue' }}>
								<h3>New Joinees</h3>
							</Card.Header>
							<Card.Body>{interviewData && interviewData['new_joinees'].length !== 0 ? <NewJoinees data={interviewData['new_joinees']} /> : <h3>No New Hires in the past 7days!</h3>}</Card.Body>
						</Card>
					</div>
				</div>

				{modal_done_data ? <ModalDone show={show_modal_done} close={handleClose_modalDone} data={{ ...modal_done_data, messenger }} /> : ''}
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
