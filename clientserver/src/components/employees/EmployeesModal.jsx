import { Modal, InputGroup, FormControl, Button } from 'react-bootstrap';
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ServerAuth } from '../../Auth';
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment';

export default function EmployeesModal({ view, show, hide }) {
    const role = JSON.parse(localStorage.getItem('data')).user.usertype;
    const ticket = JSON.parse(localStorage.getItem('data'));

    const initialState = view
        ? view
        : {
              _id: '',
              name: '',
              birthdate: '',
              contact: '',
              home: '',
              employee_id: '',
              email: '',
              department: '',
              status: '',
              title: '',
              join_date: '',
          };

    const [
        { _id, name, birthdate, contact, home, employee_id, email, department, status, title, join_date },
        setState,
    ] = useState(initialState);

    const handleHide = () => {
        setState(initialState);
        hide('');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (role === 'hr' || role === 'admin') setState((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        axios
            .post('/api/employees/update', {
                ...ticket,
                employee: {
                    _id,
                    name,
                    birthdate,
                    contact,
                    home,
                    employee_id,
                    email,
                    department,
                    status,
                    title,
                    join_date,
                },
            })
            .then((res) => {
                if (res.data.isSuccess === true) {
                    toast.success(res.data.message, {
                        position: toast.POSITION.TOP_LEFT,
                        autoClose: 5000,
                    });
                } else if (res.data.isAuthenticated === false) {
                    <ServerAuth />;
                }
            })
            .catch((err) => {
                toast.error(err.response.data.message, {
                    position: toast.POSITION.TOP_LEFT,
                    autoClose: 5000,
                });
            });
    };

    if (view !== undefined) {
        const arrayLeft = [
            { title: 'Name', value: name, name: 'name' },
            {
                title: 'Birthdate',
                value: moment(birthdate, 'MMMM DD, YYYY').format('YYYY-MM-DD'),
                name: 'birthdate',
            },
            { title: 'Contact', value: contact, name: 'contact' },
            { title: 'Home', value: home, name: 'home' },
            { title: 'Title', value: title, name: 'title' },
        ];
        const arrayRight = [
            { title: 'Employee ID', value: employee_id, name: 'employee_id' },
            { title: 'Email', value: email },
            { title: 'Department', value: department, name: 'department' },
            { title: 'Status', value: status },
            {
                title: 'Join Date',
                value: moment(join_date, 'MMMM DD, YYYY').format('YYYY-MM-DD'),
                name: 'join_date',
            },
        ];
        return (
            <Modal
                show={show}
                onHide={handleHide}
                dialogClassName="modal-90w"
                aria-labelledby="example-custom-modal-styling-title"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="example-custom-modal-styling-title">{name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row justify-content-center" style={{ textAlign: 'left' }}>
                        <div className="col-6">
                            {arrayLeft.map(({ title, value, name }, index) => {
                                return (
                                    <InputGroup className="mb-3" key={index}>
                                        <InputGroup.Text>{title}</InputGroup.Text>
                                        <FormControl
                                            type={
                                                name === 'birthdate' || name === 'join_date' ? 'date' : 'text'
                                            }
                                            name={name}
                                            value={value}
                                            onChange={handleChange}
                                        />
                                    </InputGroup>
                                );
                            })}
                        </div>
                        <div className="col-6">
                            {arrayRight.map(({ title, value, name }, index) => {
                                return (
                                    <InputGroup className="mb-3" key={index}>
                                        <InputGroup.Text>{title}</InputGroup.Text>
                                        <FormControl
                                            type={
                                                name === 'birthdate' || name === 'join_date' ? 'date' : 'text'
                                            }
                                            name={name}
                                            value={value}
                                            onChange={handleChange}
                                        />
                                    </InputGroup>
                                );
                            })}
                        </div>
                    </div>
                </Modal.Body>
                {role === 'hr' || role === 'admin' ? (
                    <Modal.Footer>
                        <Button variant="info" onClick={handleUpdate}>
                            Update
                        </Button>
                    </Modal.Footer>
                ) : (
                    ''
                )}
            </Modal>
        );
    } else return '';
}
