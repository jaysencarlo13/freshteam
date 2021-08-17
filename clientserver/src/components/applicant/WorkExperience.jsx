import { Card, InputGroup, FormControl, Button, ButtonGroup } from 'react-bootstrap';
import { useState } from 'react';
import { Accordion, AccordionSummary, AccordionDetails } from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
import moment from 'moment';
import Spinner from '../container/Spinner';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ServerAuth } from '../../Auth';
import axios from 'axios';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

export default function WorkExperience({ work_experience, callback }) {
    const ticket = JSON.parse(localStorage.getItem('data'));

    const initialState = {
        job_title: '',
        company: '',
        address: '',
        currently_working: false,
        from: moment().format('YYYY-MM-DD'),
        to: moment().format('YYYY-MM-DD'),
        description: '',
        array: work_experience ? work_experience : [],
        isAdd: false,
        spinAdd: false,
        spinEdit: false,
        spinDelete: false,
        id_edit: '',
        title_edit: '',
        company_edit: '',
        address_edit: '',
        currently_working_edit: '',
        from_edit: moment().format('YYYY-MM-DD'),
        to_edit: moment().format('YYYY-MM-DD'),
        description_edit: '',
    };

    const [
        {
            job_title,
            company,
            address,
            currently_working,
            from,
            to,
            description,
            array,
            isAdd,
            spinAdd,
            id_edit,
            job_title_edit,
            company_edit,
            address_edit,
            currently_working_edit,
            from_edit,
            to_edit,
            description_edit,
            spinEdit,
            spinDelete,
        },
        setState,
    ] = useState(initialState);

    const arrayAdd = [
        { name: 'job_title', type: 'text', value: job_title, label: 'Job Title', readOnly: false },
        { name: 'company', type: 'text', value: company, label: 'Company', readOnly: false },
        { name: 'address', type: 'text', value: address, label: 'Address', readOnly: false },
        {
            name: 'currently_working',
            type: 'checkbox',
            value: currently_working,
            label: 'Currently Working ?',
            readOnly: false,
        },
        { name: 'from', type: 'date', value: from, label: 'From', readOnly: false },
        {
            name: 'to',
            type: 'date',
            value: to,
            label: 'To',
            readOnly: currently_working === true ? true : false,
        },
        { name: 'description', type: 'text', value: description, label: 'Description', readOnly: false },
    ];

    const arrayEdit = [
        { name: 'job_title_edit', type: 'text', value: job_title_edit, label: 'Job Title', readOnly: false },
        { name: 'company_edit', type: 'text', value: company_edit, label: 'Company', readOnly: false },
        { name: 'address_edit', type: 'text', value: address_edit, label: 'Address', readOnly: false },
        {
            name: 'currently_working_edit',
            type: 'checkbox',
            value: currently_working_edit,
            label: 'Currently Working ?',
            readOnly: false,
        },
        { name: 'from_edit', type: 'date', value: from_edit, label: 'From', readOnly: false },
        {
            name: 'to_edit',
            type: 'date',
            value: to_edit,
            label: 'To',
            readOnly: currently_working_edit ? true : false,
        },
        {
            name: 'description_edit',
            type: 'text',
            value: description_edit,
            label: 'Description',
            readOnly: false,
        },
    ];

    const handleAdd = () => {
        setState((prevState) => ({ ...prevState, isAdd: true }));
    };

    const handleChange = (e) => {
        let { name, value } = e.target;
        if (name === 'currently_working') value = !currently_working;
        if (name === 'currently_working_edit') value = !currently_working_edit;
        setState((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleEdit = (e, id) => {
        let { job_title, company, address, time_period, description } = array.find(
            (element) => element._id.toString() === id.toString()
        );
        let { currently_working, from, to } = time_period;
        setState((prevState) => ({
            ...prevState,
            id_edit: id,
            job_title_edit: job_title,
            company_edit: company,
            address_edit: address,
            currently_working_edit: currently_working,
            from_edit: moment(from).format('YYYY-MM-DD'),
            to_edit: moment(to).format('YYYY-MM-DD'),
            description_edit: description,
        }));
    };

    const handleSave = (e) => {
        axios
            .post('/api/applicant/add/work_experience', {
                ...ticket,
                data: {
                    job_title,
                    company,
                    address,
                    currently_working,
                    from,
                    to,
                    description,
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

    const handleCancel = () => {
        setState(initialState);
    };

    const handleSave_edit = () => {
        setState((prevState) => ({ ...prevState, spinEdit: true }));
        axios
            .post('/api/applicant/update/work_experience', {
                ...ticket,
                data: {
                    id: id_edit,
                    job_title: job_title_edit,
                    company: company_edit,
                    address: address_edit,
                    time_period: {
                        currently_working: currently_working_edit,
                        from: from_edit,
                        to: to_edit,
                    },
                    description: description_edit,
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
            .post('/api/applicant/delete/work_experience', { ...ticket, id })
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
            <Card.Header className="applicant-personalinfo-header">Work Experience</Card.Header>
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
                {array.map(({ _id, job_title, company, address, time_period, description }) => {
                    return (
                        <Accordion className="mb-3" key={_id}>
                            <AccordionSummary
                                className="applicant-workExperience-accordion-summary"
                                expandIcon={<ExpandMore />}
                                style={{ backgroundColor: '#f5f5f5' }}
                            >
                                <h4>
                                    {job_title} @ <i>{company}</i>
                                </h4>
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
                                                label: 'Job Title',
                                                readOnly: true,
                                                value: job_title,
                                            },
                                            {
                                                type: 'text',
                                                label: 'Company',
                                                readOnly: true,
                                                value: company,
                                            },
                                            {
                                                type: 'text',
                                                label: 'Address',
                                                readOnly: true,
                                                value: address,
                                            },
                                            {
                                                type: 'checkbox',
                                                label: 'Currently Working ? ',
                                                readOnly: true,
                                                value: time_period.currently_working,
                                            },
                                            {
                                                type: 'date',
                                                label: 'From',
                                                readOnly: true,
                                                value: moment(time_period.from).format('YYYY-MM-DD'),
                                            },
                                            {
                                                type: 'date',
                                                label: 'To',
                                                readOnly: true,
                                                value: moment(time_period.to).format('YYYY-MM-DD'),
                                            },
                                            {
                                                type: 'text',
                                                label: 'Description',
                                                readOnly: true,
                                                value: description,
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
