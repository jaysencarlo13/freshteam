import React, { useState } from 'react';
import Input from '../register/Input';

import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { server } from '../config';
import { Redirect } from 'react-router-dom';
import './login.css';
import Nav from '../homepage/Nav';

const input = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().required(),
});

function Login() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(input),
    });

    const [alert, setAlert] = useState({
        message: '',
        error: false,
    });
    const [dashboard, setDashboard] = useState(false);

    const onSubmit = async (data) => {
        await axios
            .post(server + '/login', data)
            .then((res) => {
                setAlert({
                    message: res.data.message,
                    error: false,
                });
                if (res.data && res.data.data.user && res.data.data.sessionID) {
                    localStorage.setItem('data', JSON.stringify(res.data.data));
                    setDashboard(true);
                }
            })
            .catch((err) => {
                if (err && err.response && err.response.data) {
                    setAlert({
                        message: err.response.data.message,
                        error: true,
                    });
                }
            });
    };

    if (dashboard) return <Redirect from="/login" to="/" />;

    return (
        <div>
            <Nav />
            <div className="container login-form" style={{ maxWidth: '500px' }}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <h1>Login</h1>
                    <h5>FOR Employers or Employed</h5>
                    <Alert alert={alert} />
                    <Input
                        text="Email"
                        err={errors}
                        handle={register}
                        name="email"
                        value={input.email}
                        type="email"
                        placeholder="Enter your Email"
                    />
                    <Input
                        text="Password"
                        err={errors}
                        handle={register}
                        name="password"
                        value={input.password}
                        type="password"
                        placeholder="Enter your Password"
                    />
                    <div className="mb-3 form-button-register">
                        <button type="submit" className="btn btn-outline-info">
                            Login
                        </button>
                    </div>
                </form>
                <div className="mb-3 login-link">
                    Create an account? <a href="/register">Register Here</a>
                </div>
            </div>
        </div>
    );
}

function Alert({ alert }) {
    if (alert.message) {
        if (alert.error || alert.message === 'Incorrect password' || alert.message === 'User not found') {
            return (
                <div className="alert alert-danger" role="alert">
                    {alert.message}
                </div>
            );
        }
        return (
            <div className="alert alert-success" role="alert">
                {alert.message}
            </div>
        );
    } else {
        return '';
    }
}

export default Login;
