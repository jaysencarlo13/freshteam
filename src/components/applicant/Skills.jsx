import { useState } from 'react';
import moment from 'moment';
import Spinner from '../container/Spinner';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ServerAuth } from '../../Auth';
import axios from 'axios';
import { Accordion, AccordionSummary, AccordionDetails } from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
import { Card, Button, ButtonGroup, InputGroup, FormControl } from 'react-bootstrap';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

export default function Skills({ skills, callback }) {
    const ticket = JSON.parse(localStorage.getItem('data'));

    const initialState = {
        skill: '',
        years_of_experience: 0,
        array: skills ? skills : [],
        isAdd: false,
        spinAdd: false,
        spinEdit: false,
        spinDelete: false,
        id_edit: '',
        skill_edit: '',
        years_of_experience_edit: 0,
    };

    const [
        {
            skill,
            years_of_experience,
            array,
            isAdd,
            spinAdd,
            spinEdit,
            spinDelete,
            id_edit,
            skill_edit,
            years_of_experience_edit,
        },
        setState,
    ] = useState(initialState);

    const arrayAdd = [
        {
            name: 'skill',
            type: 'text',
            value: skill,
            label: 'Skill',
            readOnly: false,
        },
        {
            name: 'years_of_experience',
            type: 'number',
            value: years_of_experience,
            label: 'Years Of Experience',
            readOnly: false,
        },
    ];

    const arrayEdit = [
        {
            name: 'skill_edit',
            type: 'text',
            value: skill_edit,
            label: 'Skill',
            readOnly: false,
        },
        {
            name: 'years_of_experience_edit',
            type: 'number',
            value: years_of_experience_edit,
            label: 'Years Of Experience',
            readOnly: false,
        },
    ];

    const handleAdd = () => {
        setState((prevState) => ({ ...prevState, isAdd: true }));
    };

    const handleChange = (e) => {
        let { name, value } = e.target;
        setState((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleEdit = (e, id) => {
        let { skill, years_of_experience } = array.find(
            (element) => element._id.toString() === id.toString()
        );
        setState((prevState) => ({
            ...prevState,
            id_edit: id,
            skill_edit: skill,
            years_of_experience_edit: years_of_experience,
        }));
    };

    const handleCancel = () => {
        setState(initialState);
    };

    const handleSave = (e) => {
        setState((prevState) => ({ ...prevState, spinAdd: true }));
        axios
            .post('/api/applicant/add/skill', {
                ...ticket,
                data: {
                    skill,
                    years_of_experience,
                },
            })
            .then((res) => {
                if (res.data.isSuccess === true) {
                    toast.success(res.data.message, {
                        position: toast.POSITION.TOP_LEFT,
                        autoClose: 5000,
                    });
                    setState(initialState);
                    callback('reload');
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

    const handleSave_edit = () => {
        setState((prevState) => ({ ...prevState, spinEdit: true }));
        axios
            .post('/api/applicant/update/skill', {
                ...ticket,
                data: {
                    id: id_edit,
                    skill: skill_edit,
                    years_of_experience: years_of_experience_edit,
                },
            })
            .then((res) => {
                if (res.data.isSuccess === true) {
                    toast.success(res.data.message, {
                        position: toast.POSITION.TOP_LEFT,
                        autoClose: 3000,
                    });
                    setState(initialState);
                    callback('reload');
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

    const handleDelete = (e, id) => {
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <div className="custom-ui">
                        <h6>Are you sure you want to Delete?</h6>
                        <hr />
                        <Button variant="info" onClick={() => onClose()}>
                            No
                        </Button>
                        <Button
                            variant="danger"
                            onClick={(e) => {
                                deleteExperience(e, id);
                                onClose();
                            }}
                        >
                            Yes
                        </Button>
                    </div>
                );
            },
        });
    };

    const deleteExperience = (e, id) => {
        setState((prevState) => ({ ...prevState, spinDelete: true }));
        axios
            .post('/api/applicant/delete/skill', { ...ticket, id })
            .then((res) => {
                if (res.data.isSuccess === true) {
                    toast.success(res.data.message, {
                        position: toast.POSITION.TOP_LEFT,
                        autoClose: 3000,
                    });
                    setState(initialState);
                    callback('reload');
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
            <Card.Header className="applicant-personalinfo-header">Skills</Card.Header>
            <Card.Body className="applicant-personalinfo-body">
                {!isAdd ? (
                    <Button className="mb-3" onClick={handleAdd} variant="success">
                        Add new
                    </Button>
                ) : (
                    <div className="mb-3">
                        {spinAdd ? (
                            <Spinner />
                        ) : (
                            <ButtonGroup className="mb-3">
                                <Button variant="success" onClick={handleSave}>
                                    Save
                                </Button>
                                <Button variant="danger" onClick={handleCancel}>
                                    Cancel
                                </Button>
                            </ButtonGroup>
                        )}

                        <div className="row ">
                            {arrayAdd.map(({ name, type, value, label, readOnly }, index) => {
                                return (
                                    <div className="col-6">
                                        <InputGroup className="mb-3" key={index}>
                                            {type === 'checkbox' ? (
                                                <>
                                                    <InputGroup.Text>{label}</InputGroup.Text>
                                                    <InputGroup.Checkbox
                                                        value={value}
                                                        name={name}
                                                        readOnly={readOnly}
                                                        onChange={handleChange}
                                                        checked={value}
                                                    />
                                                </>
                                            ) : (
                                                <>
                                                    <InputGroup.Text>{label}</InputGroup.Text>
                                                    <FormControl
                                                        name={name}
                                                        value={value}
                                                        type={type}
                                                        readOnly={readOnly}
                                                        onChange={handleChange}
                                                    />
                                                </>
                                            )}
                                        </InputGroup>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
                {array.map(({ _id, skill, years_of_experience }) => {
                    return (
                        <Accordion className="mb-3" key={_id}>
                            <AccordionSummary
                                className="applicant-workExperience-accordion-summary"
                                expandIcon={<ExpandMore />}
                                style={{ backgroundColor: '#f5f5f5' }}
                            >
                                <h4>{skill}</h4>
                            </AccordionSummary>
                            {id_edit !== _id ? (
                                <AccordionDetails>
                                    <div className="row">
                                        <div className="col-12 mb-3">
                                            {spinDelete ? (
                                                <Spinner />
                                            ) : (
                                                <ButtonGroup>
                                                    <Button
                                                        variant="success"
                                                        onClick={(e) => handleEdit(e, _id)}
                                                    >
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        variant="danger"
                                                        onClick={(e) => handleDelete(e, _id)}
                                                    >
                                                        Delete
                                                    </Button>
                                                </ButtonGroup>
                                            )}
                                        </div>

                                        {[
                                            {
                                                type: 'text',
                                                label: 'Skill',
                                                readOnly: true,
                                                value: skill,
                                            },
                                            {
                                                type: 'number',
                                                label: 'Years of Experience',
                                                readOnly: true,
                                                value: years_of_experience,
                                            },
                                        ].map(({ type, label, readOnly, value }, index) => {
                                            {
                                                return (
                                                    <div className="col-6" key={index}>
                                                        <InputGroup className="mb-3">
                                                            {type === 'checkbox' ? (
                                                                <>
                                                                    <InputGroup.Text>{label}</InputGroup.Text>
                                                                    <InputGroup.Checkbox
                                                                        value={value}
                                                                        readOnly={readOnly}
                                                                        checked={value}
                                                                    />
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <InputGroup.Text>{label}</InputGroup.Text>
                                                                    <FormControl
                                                                        value={value}
                                                                        type={type}
                                                                        readOnly={readOnly}
                                                                    />
                                                                </>
                                                            )}
                                                        </InputGroup>
                                                    </div>
                                                );
                                            }
                                        })}
                                    </div>
                                </AccordionDetails>
                            ) : (
                                <AccordionDetails>
                                    <div className="row">
                                        <div className="col-12 mb-3">
                                            {spinEdit ? (
                                                <Spinner />
                                            ) : (
                                                <ButtonGroup aria-label="Basic example">
                                                    <Button variant="success" onClick={handleSave_edit}>
                                                        Save
                                                    </Button>
                                                    <Button variant="danger" onClick={handleCancel}>
                                                        Cancel
                                                    </Button>
                                                </ButtonGroup>
                                            )}
                                        </div>

                                        {arrayEdit.map(
                                            ({ _id, name, type, label, readOnly, value }, index) => {
                                                {
                                                    return (
                                                        <div className="col-6" key={index}>
                                                            <InputGroup className="mb-3">
                                                                {type === 'checkbox' ? (
                                                                    <>
                                                                        <InputGroup.Text>
                                                                            {label}
                                                                        </InputGroup.Text>
                                                                        <InputGroup.Checkbox
                                                                            value={value}
                                                                            readOnly={readOnly}
                                                                            name={name}
                                                                            checked={value}
                                                                            onChange={handleChange}
                                                                        />
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <InputGroup.Text>
                                                                            {label}
                                                                        </InputGroup.Text>
                                                                        <FormControl
                                                                            value={value}
                                                                            type={type}
                                                                            name={name}
                                                                            readOnly={readOnly}
                                                                            onChange={handleChange}
                                                                        />
                                                                    </>
                                                                )}
                                                            </InputGroup>
                                                        </div>
                                                    );
                                                }
                                            }
                                        )}
                                    </div>
                                </AccordionDetails>
                            )}
                        </Accordion>
                    );
                })}
            </Card.Body>
        </Card>
    );
}
