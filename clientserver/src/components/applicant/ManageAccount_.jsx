import { useEffect, useState } from 'react';
import Nav from './Nav';
import axios from 'axios';
import Spinner from '../container/Spinner';
import { ServerAuth } from '../../Auth';
import { Card, InputGroup, FormControl, Button } from 'react-bootstrap';
import './manageaccount.css';
import moment from 'moment';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ManageAccount() {
    const ticket = JSON.parse(localStorage.getItem('data'));
    const initialState = {
        spin: true,
        spin2: false,
        account: undefined,
        update: false,
        nameEdit: false,
        name: undefined,
        emailEdit: false,
        email: undefined,
        contactEdit: false,
        contact: undefined,
        birthdateEdit: false,
        birthdate: undefined,
        homeEdit: false,
        home: undefined,
    };
    const [
        {
            spin,
            spin2,
            account,
            update,
            nameEdit,
            name,
            emailEdit,
            email,
            contactEdit,
            contact,
            birthdateEdit,
            birthdate,
            homeEdit,
            home,
        },
        setState,
    ] = useState(initialState);
    let current_data = {
        name,
        email,
        contact,
        birthdate,
        home,
    };
    useEffect(() => {
        axios
            .post('/api/applicant', { ...ticket })
            .then((res) => {
                if (res.data.isSuccess === true) {
                    const { applicant } = res.data;
                    setState((prevState) => ({ ...prevState, account: applicant, spin: false }));
                } else if (res.data.isAuthenticated === false) {
                    <ServerAuth />;
                }
            })
            .catch((err) => {});
    }, [update]);

    const handleChange = (e, data) => {
        e.preventDefault();
        const { value } = e.target;
        const { variable } = data;
        console.log(variable, value);
        setState((prevState) => ({ ...prevState, [variable]: value }));
    };

    const handleEdit = (e, data) => {
        const { variableEdit } = data;
        setState((prevState) => ({ ...prevState, [variableEdit]: true }));
    };

    const handleCancel = (e, data) => {
        const { variable, variableEdit, property } = data;
        setState((prevState) => ({
            ...prevState,
            [variableEdit]: false,
            [variable]: account[property][variable],
        }));
    };

    const handleUpdate = (e, data) => {
        const { variable, variableEdit, property } = data;
        // setState((prevState) => ({ ...prevState, [variableEdit]: false, [variable]: account[property][variable], }));

        const value = {
            [property]: {
                ...account[property],
                [variable]: current_data[variable],
            },
        };
        axios
            .post('/api/applicant/update', { ...ticket, update: { ...account, ...value } })
            .then((res) => {
                if (res.data.isSuccess === true) {
                    setState((prevState) => ({
                        ...prevState,
                        [variableEdit]: false,
                        spin2: true,
                        update: !update,
                    }));
                    toast.success(res.data.message, {
                        position: toast.POSITION.TOP_LEFT,
                        autoClose: 5000,
                    });
                } else if (res.data.isAuthenticated === false) {
                    <ServerAuth />;
                }
            })
            .catch((err) => {
                setState((prevState) => ({
                    ...prevState,
                    [variableEdit]: false,
                    spin2: true,
                    update: !update,
                }));
                toast.error(err.response.data.message, {
                    position: toast.POSITION.TOP_LEFT,
                    autoClose: 5000,
                });
            });
    };

    const EditIcon = () => {
        return (
            <div className="col-md-3 applicant-editicon">
                <span>
                    <i className="fas fa-edit" style={{ fontSize: '1rem' }}></i>
                </span>
            </div>
        );
    };

    const PersonalInfo = () => {
        if (!account) return '';
        if (!account['personal_info']) return '';
        const { name, birthdate, home, email, contact } = account['personal_info'];
        const Template = ({ variable, text, value, property }) => {
            return (
                <div
                    className="row applicant"
                    role="button"
                    onClick={(e) =>
                        handleEdit(e, { variable: variable, variableEdit: variable + 'Edit', property })
                    }
                >
                    <div className="col-md-9">
                        {text}: {value}
                    </div>
                    <EditIcon />
                </div>
            );
        };
        const Input = ({ variable, text, value, property }) => {
            return (
                <InputGroup key={variable}>
                    <FormControl
                        autoFocus={true}
                        placeholder={text}
                        value={current_data[variable]}
                        onChange={(e) => handleChange(e, { variable })}
                    />
                    <Button
                        variant="outline-danger"
                        onClick={(e) =>
                            handleCancel(e, { variable, variableEdit: variable + 'Edit', property })
                        }
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="outline-info"
                        onClick={(e) =>
                            handleUpdate(e, { variable, variableEdit: variable + 'Edit', property })
                        }
                    >
                        Update
                    </Button>
                </InputGroup>
            );
        };
        return (
            <Card>
                <Card.Header className="applicant-personalinfo-header">Personal Information</Card.Header>
                <Card.Body className="applicant-personalinfo-body">
                    <div className="row justify-content-center">
                        <div className="col-md-5">
                            {nameEdit ? (
                                <Input variable="name" text="Name" value={name} property="personal_info" />
                            ) : (
                                <Template variable="name" text="Name" value={name} property="personal_info" />
                            )}

                            {emailEdit ? (
                                <Input variable="email" text="Email" value={email} property="personal_info" />
                            ) : (
                                <Template
                                    variable="email"
                                    text="Email"
                                    value={email}
                                    property="personal_info"
                                />
                            )}

                            <Template
                                variable="contact"
                                text="Contact"
                                value={contact}
                                property="personal_info"
                            />
                        </div>
                        <div className="col-md-5">
                            <Template
                                variable="birthdate"
                                text="Birthdate"
                                value={moment(birthdate).format('MMMM DD, YYYY')}
                                property="personal_info"
                            />
                            <Template variable="home" text="Home" value={home} property="personal_info" />
                        </div>
                    </div>
                </Card.Body>
            </Card>
        );
    };
    const WorkExperience = () => {
        if (!account) return '';
        if (!account['personal_info']) return '';
        return '';
    };
    const Education = () => {
        if (!account) return '';
        if (!account['personal_info']) return '';
        return '';
    };
    const Skills = () => {
        if (!account) return '';
        if (!account['personal_info']) return '';
        return '';
    };
    const CertLicence = () => {
        if (!account) return '';
        if (!account['personal_info']) return '';
        return '';
    };
    const AddInfo = () => {
        if (!account) return '';
        if (!account['personal_info']) return '';
        return '';
    };
    const File = () => {
        return '';
    };
    if (!spin)
        return (
            <div>
                <Nav name={account['personal_info']['name']} />
                <div className="row  applicant-manageaccount-wrapper">
                    <div className="col-md-10">
                        {spin2 ? (
                            <Spinner />
                        ) : (
                            <div>
                                <File />
                                <PersonalInfo />
                                <WorkExperience />
                                <Education />
                                <Skills />
                                <CertLicence />
                                <AddInfo />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    return <Spinner />;
}
