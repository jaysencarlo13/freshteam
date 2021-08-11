import Content from '../container/Contents';
import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { ServerAuth } from '../../Auth';
import { Redirect } from 'react-router-dom';
import Spinner from '../container/Spinner';

export default function Google({ callback, googleMessage }) {
    const ticket = JSON.parse(localStorage.getItem('data'));
    const initialState = {
        email: '',
        password: '',
        spin: false,
        redirect: false,
    };

    const [{ email, password, spin, redirect }, setState] = useState(initialState);

    const onSubmit = (e) => {
        e.preventDefault();
        setState((prevState) => ({ ...prevState, spin: true }));
        axios
            .post('/api/user/update/google', { ...ticket, google: { email, password } })
            .then((res) => {
                if (res.data.isSuccess === true) {
                    setState(initialState);
                    callback('reload');
                } else if (res.data.isAuthenticated === false) {
                    <ServerAuth />;
                }
            })
            .catch((err) => {
                console.log(err.response.data.error);
                setState((prevState) => ({ ...prevState, redirect: true }));
            });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setState((prevState) => ({ ...prevState, [name]: value }));
    };
    if (redirect) return <Redirect to="/" />;
    if (!spin)
        return (
            <Content>
                <div className="row justify-content-center">
                    <div className="col-4">
                        <Form onSubmit={onSubmit}>
                            <h4 style={{ color: 'red' }}>
                                {googleMessage
                                    ? googleMessage
                                    : 'You havent setup your google account. Please input your credentials of your Google Account. And Allow Less Secure Apps in your google account in this link'}
                                <br />
                                <a href="https://myaccount.google.com/lesssecureapps?">
                                    Allow Less Secure App
                                </a>
                            </h4>
                            <Form.Text className="text-muted">
                                We'll never share your credentials with anyone else.
                            </Form.Text>
                            <Form.Group className="mb-3">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    value={email}
                                    placeholder="Enter email"
                                    onChange={handleChange}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="password"
                                    value={password}
                                    placeholder="Password"
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            <Button variant="primary" type="submit">
                                Submit
                            </Button>
                        </Form>
                    </div>
                </div>
            </Content>
        );
    else return <Spinner />;
}
