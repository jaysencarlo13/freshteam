import { Card, InputGroup, FormControl, Button } from 'react-bootstrap';
import { useState } from 'react';
import './manageaccount.css';
import axios from 'axios';
import { ServerAuth } from '../../Auth';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment';

export default function PersonalInfo({ personal_info, callback }) {
    const ticket = JSON.parse(localStorage.getItem('data'));

    const {
        name: _name,
        birthdate: _birthdate,
        home: _home,
        email: _email,
        contact: _contact,
    } = personal_info;

    const initialState = {
        name: _name,
        birthdate: moment(_birthdate).format('YYYY-MM-DD'),
        home: _home,
        email: _email,
        contact: _contact,
    };

    const [{ name, birthdate, home, email, contact }, setState] = useState(initialState);

    const arrayLeft = [
        { name: 'name', value: name, type: 'text', label: 'Name' },
        { name: 'email', value: email, type: 'email', label: 'Email' },
        { name: 'contact', value: contact, type: 'text', label: 'Contact' },
    ];

    const arrayRight = [
        { name: 'home', value: home, type: 'text', label: 'Home' },
        { name: 'birthdate', value: birthdate, type: 'date', label: 'Birthdate' },
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setState((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleUpdate = () => {
        axios
            .post('/api/applicant/update/personal_info', {
                ...ticket,
                update: {
                    name,
                    birthdate: moment(birthdate).toDate(),
                    home,
                    email,
                    contact,
                },
            })
            .then((res) => {
                if (res.data.isSuccess === true) {
                    toast.success(res.data.message, {
                        position: toast.POSITION.TOP_LEFT,
                        autoClose: 3000,
                    });
                    setState(initialState);
                    callback('update');
                } else if (res.data.isAuthenticated === false) {
                    <ServerAuth />;
                }
            })
            .catch((err) => {
                toast.error(err.response.data.message, {
                    position: toast.POSITION.TOP_LEFT,
                    autoClose: 3000,
                });
            });
    };

    return (
        <Card className="mb-3">
            <Card.Header className="applicant-personalinfo-header">Personal Information</Card.Header>
            <Card.Body className="applicant-personalinfo-body">
                <div className="row justify-content-center">
                    <div className="col-md-5">
                        {arrayLeft.map(({ name, value, type, label }, index) => {
                            return (
                                <InputGroup key={index} className="mb-2">
                                    <InputGroup.Text>{label}</InputGroup.Text>
                                    <FormControl
                                        name={name}
                                        value={value}
                                        type={type}
                                        onChange={handleChange}
                                    />
                                </InputGroup>
                            );
                        })}
                    </div>
                    <div className="col-md-5">
                        {arrayRight.map(({ name, value, type, label }, index) => {
                            return (
                                <InputGroup key={index} className="mb-2">
                                    <InputGroup.Text>{label}</InputGroup.Text>
                                    <FormControl
                                        name={name}
                                        value={value}
                                        type={type}
                                        onChange={handleChange}
                                    />
                                </InputGroup>
                            );
                        })}
                    </div>
                </div>
            </Card.Body>
            <Card.Footer>
                <Button variant="info" onClick={handleUpdate}>
                    Update
                </Button>
            </Card.Footer>
        </Card>
    );
}
