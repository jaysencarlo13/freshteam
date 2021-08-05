import React from 'react';
import './register.css';
import Input from './Input';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { server } from '../config';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Nav from '../homepage/Nav';

toast.configure();

const input = yup.object().shape({
    name: yup.string().min(3).required(),
    email: yup.string().email().required(),
    password: yup.string().min(7).required(),
    repeat_password: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match'),
});

function Register() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(input),
    });

    const onSubmit = (data, e) => {
        return axios
            .post(server + '/register', data)
            .then((res) => {
                toast.success(res.data.message, {
                    position: toast.POSITION.TOP_LEFT,
                    autoClose: 10000,
                });
                e.target.reset();
            })
            .catch((err) => {
                return toast.error(err.response.data.message, {
                    position: toast.POSITION.TOP_LEFT,
                    autoClose: 10000,
                });
            });
    };

    return (
        <div>
            <Nav />
            <div className="container register-form" style={{ maxWidth: '500px' }}>
                <h1>Register</h1>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Input
                        err={errors}
                        handle={register}
                        text="Name"
                        name="name"
                        type="text"
                        value={input.name}
                        placeholder="Enter Your Name"
                    />
                    <Input
                        err={errors}
                        handle={register}
                        text="Email Address"
                        name="email"
                        type="email"
                        value={input.email}
                        placeholder="Enter Your Email"
                    />
                    <Input
                        err={errors}
                        handle={register}
                        text="Birth Date"
                        name="birthdate"
                        type="date"
                        value={input.birthdate}
                        placeholder="Enter your birthdate"
                    />
                    <Input
                        err={errors}
                        handle={register}
                        text="Password"
                        name="password"
                        type="password"
                        value={input.password}
                        placeholder="Enter Your Password"
                    />
                    <Input
                        err={errors}
                        handle={register}
                        text="Repeat Password"
                        name="repeat_password"
                        type="password"
                        value={input.repeat_password}
                        placeholder="Repeat Your Password"
                    />

                    <div className="mb-3 form-button-register">
                        <button type="submit" className="btn btn-outline-info">
                            Submit
                        </button>
                    </div>
                </form>

                <div className="mb-3 login-link">
                    Have already an account?
                    <a href="/login">Login Here</a>
                </div>
            </div>
        </div>
    );
}

export default Register;
