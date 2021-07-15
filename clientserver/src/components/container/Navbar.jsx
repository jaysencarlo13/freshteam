import React, { useEffect, useState } from 'react';
import './navbar.css';
import { Navbar, Nav, NavDropdown, DropdownButton, Modal, Form, Button, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './modal-content.css';
import moment from 'moment';
import axios from 'axios';

export default function _Navbar() {
	//account-edit-start
	const [show, setShow] = useState(false);
	const handleShow = () => setShow(true);
	const handleClose = () => {
		setShow(false);
		setError(false);
	};
	const ticket = JSON.parse(localStorage.getItem('data'));

	const [user, setUser] = useState(undefined);

	const [name, setName] = useState(undefined);
	const [birthdate, setBirthdate] = useState(undefined);
	const [contact, setContact] = useState(undefined);
	const [email, setEmail] = useState(undefined);
	const [home, setHome] = useState(undefined);

	const [id, setId] = useState(undefined);
	const [status, setStatus] = useState(undefined);
	const [department, setDepartment] = useState(undefined);
	const [title, setTitle] = useState(undefined);
	const [join, setJoin] = useState(undefined);

	const [error, setError] = useState(false);
	const [errorMessage, seterrorMessage] = useState(undefined);
	const [errorVariant, seterrorVariant] = useState(undefined);

	const handleSubmit = (e) => {
		e.preventDefault();
		const userdetails = {
			personal_info: {
				name: name,
				birthdate: moment(birthdate).format('YYYY-MM-DD'),
				contact: contact,
				email: email,
				home: home,
			},
			work_info: {
				employee_id: id,
				employee_status: status,
				department: department,
				title: title,
				join_date: join,
			},
		};
		axios
			.post('/api/userupdate', { ...userdetails, ...ticket })
			.then((res) => {
				if (res.data.isUpdated === true) {
					setUser(undefined);
					setEmail(undefined);
					setError(true);
					seterrorMessage(res.data.message);
					seterrorVariant('success');
				}
			})
			.catch((err) => {
				setError(true);
				seterrorMessage('Something went wrong. Update Failed');
				seterrorVariant('danger');
			});
	};

	function getUserDetails() {
		return axios
			.post('/api/user', { ...ticket })
			.then((res) => {
				setUser(res.data.user);
			})
			.catch((err) => {});
	}

	useEffect(() => {
		if (!user) getUserDetails();
	});

	if (user && !email) {
		setName(user.name);
		setBirthdate(user.birthdate ? moment(user.birthdate).format('YYYY-MM-DD') : undefined);
		setContact(user.contact);
		setEmail(user.email);
		setHome(user.home);
		if (user.work_info) {
			setId(user.work_info.employee_id);
			setStatus(user.work_info.employee_status);
			setDepartment(user.work_info.department);
			setTitle(user.work_info.title);
			setJoin(user.work_info.join_date ? moment(user.work_info.join_date).format('YYYY-MM-DD') : undefined);
		} else {
			setId(undefined);
			setStatus(undefined);
			setDepartment(undefined);
			setTitle(undefined);
			setJoin(undefined);
		}
	}
	//account-edit-end

	//changepassword-start

	const initialState = {
		show_changepassword: false,
		alert_changepassword: false,
		alert_message: undefined,
		alert_variant: undefined,
		oldpassword: undefined,
		newpassword: undefined,
		repeatpassword: undefined,
	};
	const [{ show_changepassword, alert_changepassword, alert_message, alert_variant, oldpassword, newpassword, repeatpassword }, setState] = useState(initialState);

	const onChange = (e) => {
		const { name, value } = e.target;
		setState((prevState) => ({ ...prevState, [name]: value }));
	};

	const handleClose_changepassword = () => {
		setState(initialState);
	};

	const handleShow_changepassword = () => {
		setState((prevState) => ({ ...prevState, show_changepassword: true }));
	};

	const handleSubmit_changepassword = (e) => {
		e.preventDefault();
		if (oldpassword && newpassword === repeatpassword && newpassword.length >= 7) {
			const userdetails = {
				password: oldpassword,
				newpassword: newpassword,
			};
			axios
				.post('/api/changepassword', { ...ticket, ...userdetails })
				.then((response) => {
					if (response.data.isChangePassword === true) {
						setState((prevState) => ({ ...prevState, alert_changepassword: true, alert_message: response.data.message, alert_variant: 'success' }));
					} else {
						setState((prevState) => ({ ...prevState, alert_changepassword: true, alert_message: response.data.message, alert_variant: 'danger' }));
					}
				})
				.catch((err) => {
					setState((prevState) => ({ ...prevState, alert_changepassword: true, alert_message: 'Something Went Wrong', alert_variant: 'danger' }));
				});
		} else {
			if (!oldpassword) setState((prevState) => ({ ...prevState, alert_changepassword: true, alert_message: 'Please Input Your Password', alert_variant: 'danger' }));
			else if (newpassword.length <= 7) setState((prevState) => ({ ...prevState, alert_changepassword: true, alert_message: 'New Password Must be atleast 7characters', alert_variant: 'danger' }));
			else if (newpassword !== oldpassword) setState((prevState) => ({ ...prevState, alert_changepassword: true, alert_message: 'Passwords Must Match', alert_variant: 'danger' }));
		}
	};

	//changepassword-end

	return (
		<>
			<Navbar>
				<Navbar.Toggle aria-controls="basic-navbar-nav" />
				<Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
					<Nav>
						<DropdownButton className="" menuAlign="right" title={<i class="fas fa-user"></i>}>
							<NavDropdown.Item href="/viewaccount">View Account</NavDropdown.Item>
							<NavDropdown.Item href="#edit_account" onClick={handleShow}>
								Edit Account
							</NavDropdown.Item>
							<NavDropdown.Item href="#change_password" onClick={handleShow_changepassword}>
								Change Password
							</NavDropdown.Item>
							<NavDropdown.Item href="/logout">Signout</NavDropdown.Item>
						</DropdownButton>
					</Nav>
				</Navbar.Collapse>
			</Navbar>

			<Modal contentClassName="modal-content" dialogClassName="modal-dialog" show={show} onHide={handleClose} animation={true}>
				<Modal.Header closeButton>
					<Modal.Title>Edit Account</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{error ? (
						<Alert variant={errorVariant}>
							<h2>{errorMessage}</h2>
						</Alert>
					) : (
						''
					)}
					<Form id="modal-form" onSubmit={handleSubmit} className="row gy-3">
						<div className="col-md-6">
							<h3>Personal Info</h3>
							<Form.Group className="mb-3" controlId="name">
								<Form.Label>Name</Form.Label>
								<Form.Control value={name} onChange={(e) => setName(e.target.value)} size="lg" type="text" />
							</Form.Group>
							<Form.Group className="mb-3" controlId="birthdate">
								<Form.Label>Birthdate</Form.Label>
								<Form.Control value={birthdate} onChange={(e) => setBirthdate(e.target.value)} size="lg" type="date" />
							</Form.Group>
							<Form.Group className="mb-3" controlId="contact_number">
								<Form.Label>Contact Number</Form.Label>
								<Form.Control value={contact} onChange={(e) => setContact(e.target.value)} size="lg" type="text" />
							</Form.Group>
							<Form.Group className="mb-3" controlId="email">
								<Form.Label>Email</Form.Label>
								<Form.Control readOnly value={email} onChange={(e) => setEmail(e.target.value)} size="lg" type="email" />
							</Form.Group>
							<Form.Group className="mb-3" controlId="home_address">
								<Form.Label>Home Address</Form.Label>
								<Form.Control value={home} onChange={(e) => setHome(e.target.value)} size="lg" type="text" />
							</Form.Group>
						</div>
						<div className="col-md-6">
							<h3>Work Info</h3>
							<Form.Group className="mb-3" controlId="employee_id">
								<Form.Label>Employee ID</Form.Label>
								<Form.Control value={id} onChange={(e) => setId(e.target.value)} size="lg" type="text" />
							</Form.Group>
							<Form.Group className="mb-3" controlId="employee_status">
								<Form.Label>Employee Status</Form.Label>
								<Form.Control value={status} onChange={(e) => setStatus(e.target.value)} size="lg" type="text" />
							</Form.Group>
							<Form.Group className="mb-3" controlId="Department">
								<Form.Label>Department</Form.Label>
								<Form.Control value={department} onChange={(e) => setDepartment(e.target.value)} size="lg" type="text" />
							</Form.Group>
							<Form.Group className="mb-3" controlId="title">
								<Form.Label>Designation or Title</Form.Label>
								<Form.Control value={title} onChange={(e) => setTitle(e.target.value)} size="lg" type="text" />
							</Form.Group>
							<Form.Group className="mb-3" controlId="date_join">
								<Form.Label>Date Join</Form.Label>
								<Form.Control value={join} onChange={(e) => setJoin(e.target.value)} size="lg" type="date" />
							</Form.Group>
						</div>
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleClose}>
						Close
					</Button>
					<Button variant="primary" form="modal-form" type="Submit">
						Update
					</Button>
				</Modal.Footer>
			</Modal>

			<Modal show={show_changepassword} onHide={handleClose_changepassword} animation={true}>
				<Modal.Header closeButton>
					<Modal.Title>Change Password</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{alert_changepassword ? (
						<Alert variant={alert_variant}>
							<h2>{alert_message}</h2>
						</Alert>
					) : (
						''
					)}
					<Form id="modal-form-changepassword" onSubmit={handleSubmit_changepassword}>
						<Form.Group className="mb-3" controlId="name">
							<Form.Label>Old Password</Form.Label>
							<Form.Control name="oldpassword" required value={oldpassword} onChange={onChange} size="lg" type="password" />
						</Form.Group>
						<Form.Group className="mb-3" controlId="name">
							<Form.Label>New Password</Form.Label>
							<Form.Control name="newpassword" required value={newpassword} onChange={onChange} size="lg" type="password" />
						</Form.Group>
						<Form.Group className="mb-3" controlId="name">
							<Form.Label>Repeat Password</Form.Label>
							<Form.Control name="repeatpassword" required value={repeatpassword} onChange={onChange} size="lg" type="password" />
						</Form.Group>
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleClose_changepassword}>
						Close
					</Button>
					<Button variant="primary" form="modal-form-changepassword" type="Submit">
						Change Password
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
}
