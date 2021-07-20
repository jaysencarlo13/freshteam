import React, { useEffect, useState } from 'react';
import './navbar.css';
import {
  Navbar,
  Nav,
  NavDropdown,
  DropdownButton,
  Modal,
  Form,
  Button,
  Alert,
  Dropdown,
  ButtonGroup,
} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './modal-content.css';
import moment from 'moment';
import axios from 'axios';
import { set } from 'mongoose';
import { ServerAuth } from '../../Auth';

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
        } else if (res.data.isAuthenticated === false) {
          return <ServerAuth />;
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
    setBirthdate(
      user.birthdate ? moment(user.birthdate).format('YYYY-MM-DD') : undefined
    );
    setContact(user.contact);
    setEmail(user.email);
    setHome(user.home);
    if (user.work_info) {
      setId(user.work_info.employee_id);
      setStatus(user.work_info.employee_status);
      setDepartment(user.work_info.department);
      setTitle(user.work_info.title);
      setJoin(
        user.work_info.join_date
          ? moment(user.work_info.join_date).format('YYYY-MM-DD')
          : undefined
      );
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
  const [
    {
      show_changepassword,
      alert_changepassword,
      alert_message,
      alert_variant,
      oldpassword,
      newpassword,
      repeatpassword,
    },
    setState,
  ] = useState(initialState);

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
    if (
      oldpassword &&
      newpassword === repeatpassword &&
      newpassword.length >= 7
    ) {
      const userdetails = {
        password: oldpassword,
        newpassword: newpassword,
      };
      axios
        .post('/api/changepassword', { ...ticket, ...userdetails })
        .then((response) => {
          if (response.data.isChangePassword === true) {
            setState((prevState) => ({
              ...prevState,
              alert_changepassword: true,
              alert_message: response.data.message,
              alert_variant: 'success',
            }));
          } else {
            setState((prevState) => ({
              ...prevState,
              alert_changepassword: true,
              alert_message: response.data.message,
              alert_variant: 'danger',
            }));
          }
        })
        .catch((err) => {
          setState((prevState) => ({
            ...prevState,
            alert_changepassword: true,
            alert_message: 'Something Went Wrong',
            alert_variant: 'danger',
          }));
        });
    } else {
      if (!oldpassword)
        setState((prevState) => ({
          ...prevState,
          alert_changepassword: true,
          alert_message: 'Please Input Your Password',
          alert_variant: 'danger',
        }));
      else if (newpassword.length <= 7)
        setState((prevState) => ({
          ...prevState,
          alert_changepassword: true,
          alert_message: 'New Password Must be atleast 7characters',
          alert_variant: 'danger',
        }));
      else if (newpassword !== oldpassword)
        setState((prevState) => ({
          ...prevState,
          alert_changepassword: true,
          alert_message: 'Passwords Must Match',
          alert_variant: 'danger',
        }));
    }
  };

  //changepassword-end

  //Add new dropdown Start
  const addnew_initialState = {
    show_addnew: false,
    newDepartment: undefined,
    show_addDepartment: false,
    alert_addDepartment: false,
    alert_variant_addDepartment: undefined,
    alert_message_addDepartment: undefined,
    show_addEmployee: false,
    alert_addEmployee: false,
    alert_variant_addEmployee: undefined,
    alert_message_addEmployee: undefined,
    newEmployee: undefined,
  };

  const [
    {
      show_addnew,
      newDepartment,
      show_addDepartment,
      alert_addDepartment,
      alert_variant_addDepartment,
      alert_message_addDepartment,
      show_addEmployee,
      alert_addEmployee,
      alert_variant_addEmployee,
      alert_message_addEmployee,
      newEmployee,
    },
    setAddNewState,
  ] = useState(addnew_initialState);

  const enter_addnew_hover = () => {
    setAddNewState((prevState) => ({ ...prevState, show_addnew: true }));
  };

  const leave_addnew_hover = () => {
    setAddNewState((prevState) => ({ ...prevState, show_addnew: false }));
  };

  const handleShow_addDepartment = () => {
    setAddNewState((prevState) => ({ ...prevState, show_addDepartment: true }));
  };

  const handleClose_addDepartment = () => {
    setAddNewState(addnew_initialState);
  };

  const onChange_addnew = (e) => {
    const { name, value } = e.target;
    setAddNewState((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit_addnewdepartment = (e) => {
    e.preventDefault();
    axios
      .post('/api/add/department', { ...ticket, department: newDepartment })
      .then((res) => {
        if (res.data && res.data.isSuccess === true) {
          setAddNewState((prevState) => ({
            ...prevState,
            alert_addDepartment: true,
            alert_variant_addDepartment: 'success',
            alert_message_addDepartment: res.data.message,
          }));
        } else if (res.data && res.data.isAuthenticated === false) {
          return <ServerAuth />;
        }
      })
      .catch((err) => {
        if (
          err &&
          err.response &&
          err.response.data &&
          err.response.data.message
        ) {
          setAddNewState((prevState) => ({
            ...prevState,
            alert_addDepartment: true,
            alert_variant_addDepartment: 'danger',
            alert_message_addDepartment: err.response.data.message,
          }));
        }
      });
  };

  const handleShow_addEmployee = () => {
    setAddNewState((prevState) => ({ ...prevState, show_addEmployee: true }));
  };

  const handleClose_addEmployee = () => {
    setAddNewState(addnew_initialState);
  };

  const handleSubmit_addnewemployee = (e) => {
    e.preventDefault();
    axios
      .post('/api/add/employee', { ...ticket, employee_email: newEmployee })
      .then((res) => {
        if (res.data && res.data.isSuccess === true) {
          setAddNewState((prevState) => ({
            ...prevState,
            alert_addEmployee: true,
            alert_variant_addEmployee: 'success',
            alert_message_addEmployee: res.data.message,
          }));
        }
      });
  };
  //Add new dropdown End

  return (
    <>
      <Navbar>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <DropdownButton
            show={show_addnew}
            onMouseEnter={enter_addnew_hover}
            onMouseLeave={leave_addnew_hover}
            variant="info"
            title={<i class="fas fa-plus"> Add New</i>}
            alignRight={true}
            id="add-new-id"
          >
            <NavDropdown.Item onClick={handleShow_addDepartment}>
              Department
            </NavDropdown.Item>
            <NavDropdown.Item>Job Posting</NavDropdown.Item>
            <NavDropdown.Item onClick={handleShow_addEmployee}>
              Employee
            </NavDropdown.Item>
          </DropdownButton>
          <NavDropdown
            id="account-id"
            alignRight={true}
            title={
              <span>
                <i className="fas fa-user"></i>
              </span>
            }
          >
            <NavDropdown.Item href="/viewaccount">
              View Account
            </NavDropdown.Item>
            <NavDropdown.Item href="#edit_account" onClick={handleShow}>
              Edit Account
            </NavDropdown.Item>
            <NavDropdown.Item
              href="#change_password"
              onClick={handleShow_changepassword}
            >
              Change Password
            </NavDropdown.Item>
            <NavDropdown.Item href="/logout">Signout</NavDropdown.Item>
          </NavDropdown>
        </Navbar.Collapse>
      </Navbar>

      <Modal
        contentClassName="modal-content"
        dialogClassName="modal-dialog"
        show={show}
        onHide={handleClose}
        animation={true}
      >
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
                <Form.Control
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  size="lg"
                  type="text"
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="birthdate">
                <Form.Label>Birthdate</Form.Label>
                <Form.Control
                  value={birthdate}
                  onChange={(e) => setBirthdate(e.target.value)}
                  size="lg"
                  type="date"
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="contact_number">
                <Form.Label>Contact Number</Form.Label>
                <Form.Control
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  size="lg"
                  type="text"
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  readOnly
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  size="lg"
                  type="email"
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="home_address">
                <Form.Label>Home Address</Form.Label>
                <Form.Control
                  value={home}
                  onChange={(e) => setHome(e.target.value)}
                  size="lg"
                  type="text"
                />
              </Form.Group>
            </div>
            <div className="col-md-6">
              <h3>Work Info</h3>
              <Form.Group className="mb-3" controlId="employee_id">
                <Form.Label>Employee ID</Form.Label>
                <Form.Control
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  size="lg"
                  type="text"
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="employee_status">
                <Form.Label>Employee Status</Form.Label>
                <Form.Control
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  size="lg"
                  type="text"
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="Department">
                <Form.Label>Department</Form.Label>
                <Form.Control
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  size="lg"
                  type="text"
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="title">
                <Form.Label>Designation or Title</Form.Label>
                <Form.Control
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  size="lg"
                  type="text"
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="date_join">
                <Form.Label>Date Join</Form.Label>
                <Form.Control
                  value={join}
                  onChange={(e) => setJoin(e.target.value)}
                  size="lg"
                  type="date"
                />
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

      <Modal
        show={show_changepassword}
        onHide={handleClose_changepassword}
        animation={true}
      >
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
          <Form
            id="modal-form-changepassword"
            onSubmit={handleSubmit_changepassword}
          >
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Old Password</Form.Label>
              <Form.Control
                name="oldpassword"
                required
                value={oldpassword}
                onChange={onChange}
                size="lg"
                type="password"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                name="newpassword"
                required
                value={newpassword}
                onChange={onChange}
                size="lg"
                type="password"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Repeat Password</Form.Label>
              <Form.Control
                name="repeatpassword"
                required
                value={repeatpassword}
                onChange={onChange}
                size="lg"
                type="password"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose_changepassword}>
            Close
          </Button>
          <Button
            variant="primary"
            form="modal-form-changepassword"
            type="Submit"
          >
            Change Password
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={show_addDepartment}
        onHide={handleClose_addDepartment}
        animation={true}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Department</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {alert_addDepartment ? (
            <Alert variant={alert_variant_addDepartment}>
              <h2>{alert_message_addDepartment}</h2>
            </Alert>
          ) : (
            ''
          )}
          <Form
            id="modal-form-add-new-department"
            onSubmit={handleSubmit_addnewdepartment}
          >
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Department</Form.Label>
              <Form.Control
                name="newDepartment"
                required
                value={newDepartment}
                onChange={onChange_addnew}
                size="lg"
                type="text"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose_addDepartment}>
            Close
          </Button>
          <Button
            variant="primary"
            form="modal-form-add-new-department"
            type="Submit"
          >
            Add Department
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={show_addEmployee}
        onHide={handleClose_addEmployee}
        animation={true}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Employee</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {alert_addEmployee ? (
            <Alert variant={alert_variant_addEmployee}>
              <h2>{alert_message_addEmployee}</h2>
            </Alert>
          ) : (
            ''
          )}
          <Form
            id="modal-form-add-new-employee"
            onSubmit={handleSubmit_addnewemployee}
          >
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Employee's Email</Form.Label>
              <Form.Control
                name="newEmployee"
                required
                value={newEmployee}
                onChange={onChange_addnew}
                size="lg"
                type="email"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose_addEmployee}>
            Close
          </Button>
          <Button
            variant="primary"
            form="modal-form-add-new-employee"
            type="Submit"
          >
            Add Employee
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
