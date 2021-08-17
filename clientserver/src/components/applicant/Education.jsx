import { Card, Button, ButtonGroup, InputGroup, FormControl } from 'react-bootstrap';
import { useState } from 'react';
import moment from 'moment';
import Spinner from '../container/Spinner';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ServerAuth } from '../../Auth';
import axios from 'axios';
import { Accordion, AccordionSummary, AccordionDetails } from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

export default function Education({ education, callback }) {
    const ticket = JSON.parse(localStorage.getItem('data'));

    const initialState = {
        education_level: '',
        field_study: '',
        school: '',
        location: '',
        currently_enrolled: false,
        from: moment().format('YYYY-MM-DD'),
        to: moment().format('YYYY-MM-DD'),
        array: education ? education : [],
        isAdd: false,
        spinAdd: false,
        spinEdit: false,
        spinDelete: false,
        id_edit: '',
        education_level_edit: '',
        field_study_edit: '',
        school_edit: '',
        location_edit: '',
        currently_enrolled_edit: false,
        from_edit: moment().format('YYYY-MM-DD'),
        to_edit: moment().format('YYYY-MM-DD'),
    };

    const [
        {
            education_level,
            field_study,
            school,
            location,
            currently_enrolled,
            from,
            to,
            array,
            isAdd,
            spinAdd,
            spinEdit,
            spinDelete,
            id_edit,
            education_level_edit,
            field_study_edit,
            school_edit,
            location_edit,
            currently_enrolled_edit,
            from_edit,
            to_edit,
        },
        setState,
    ] = useState(initialState);

    const arrayAdd = [
        {
            name: 'education_level',
            type: 'text',
            value: education_level,
            label: 'Education Level',
            readOnly: false,
        },
        { name: 'field_study', type: 'text', value: field_study, label: 'Field Study', readOnly: false },
        { name: 'school', type: 'text', value: school, label: 'School Name', readOnly: false },
        { name: 'location', type: 'text', value: location, label: 'School Located', readOnly: false },
        {
            name: 'currently_enrolled',
            type: 'checkbox',
            value: currently_enrolled,
            label: 'Currently Enrolled ?',
            readOnly: false,
        },
        { name: 'from', type: 'date', value: from, label: 'From', readOnly: false },
        {
            name: 'to',
            type: 'date',
            value: to,
            label: 'To',
            readOnly: currently_enrolled === true ? true : false,
        },
    ];

    const arrayEdit = [
        {
            name: 'education_level_edit',
            type: 'text',
            value: education_level_edit,
            label: 'Education Level',
            readOnly: false,
        },
        {
            name: 'field_study_edit',
            type: 'text',
            value: field_study_edit,
            label: 'Field Study',
            readOnly: false,
        },
        { name: 'school_edit', type: 'text', value: school_edit, label: 'School Name', readOnly: false },
        {
            name: 'location_edit',
            type: 'text',
            value: location_edit,
            label: 'School Located',
            readOnly: false,
        },
        {
            name: 'currently_enrolled_edit',
            type: 'checkbox',
            value: currently_enrolled_edit,
            label: 'Currently Enrolled ?',
            readOnly: false,
        },
        { name: 'from_edit', type: 'date', value: from_edit, label: 'From', readOnly: false },
        {
            name: 'to_edit',
            type: 'date',
            value: to_edit,
            label: 'To',
            readOnly: currently_enrolled_edit,
        },
    ];

    const handleAdd = () => {
        setState((prevState) => ({ ...prevState, isAdd: true }));
    };

    const handleChange = (e) => {
        let { name, value } = e.target;
        if (name === 'currently_enrolled') value = !currently_enrolled;
        if (name === 'currently_enrolled_edit') value = !currently_enrolled_edit;
        setState((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleEdit = (e, id) => {
        let { education_level, field_study, school, location, time_period } = array.find(
            (element) => element._id.toString() === id.toString()
        );
        let { currently_enrolled, from, to } = time_period;
        setState((prevState) => ({
            ...prevState,
            id_edit: id,
            education_level_edit: education_level,
            field_study_edit: field_study,
            school_edit: school,
            location_edit: location,
            currently_enrolled_edit: currently_enrolled,
            from_edit: moment(from).format('YYYY-MM-DD'),
            to_edit: moment(to).format('YYYY-MM-DD'),
        }));
    };

    const handleCancel = () => {
        setState(initialState);
    };

    const handleSave = (e) => {
        setState((prevState) => ({ ...prevState, spinAdd: true }));
        axios
            .post('/api/applicant/add/education', {
                ...ticket,
                data: {
                    education_level,
                    field_study,
                    school,
                    location,
                    currently_enrolled,
                    from,
                    to,
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
            .post('/api/applicant/update/education', {
                ...ticket,
                data: {
                    id: id_edit,
                    education_level: education_level_edit,
                    field_study: field_study_edit,
                    school: school_edit,
                    location: location_edit,
                    time_period: {
                        currently_enrolled: currently_enrolled_edit,
                        from: from_edit,
                        to: to_edit,
                    },
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
            .post('/api/applicant/delete/education', { ...ticket, id })
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
            <Card.Header className="applicant-personalinfo-header">Education</Card.Header>
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
                {array.map(({ _id, education_level, field_study, school, location, time_period }) => {
                    return (
                        <Accordion className="mb-3" key={_id}>
                            <AccordionSummary
                                className="applicant-workExperience-accordion-summary"
                                expandIcon={<ExpandMore />}
                                style={{ backgroundColor: '#f5f5f5' }}
                            >
                                <h4>
                                    {education_level} @ <i>{school}</i>
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
                                                label: 'Education Level',
                                                readOnly: true,
                                                value: education_level,
                                            },
                                            {
                                                type: 'text',
                                                label: 'Field Study',
                                                readOnly: true,
                                                value: field_study,
                                            },
                                            {
                                                type: 'text',
                                                label: 'School',
                                                readOnly: true,
                                                value: school,
                                            },
                                            ,
                                            {
                                                type: 'text',
                                                label: 'School Located',
                                                readOnly: true,
                                                value: location,
                                            },
                                            {
                                                type: 'checkbox',
                                                label: 'Currently Enrolled ? ',
                                                readOnly: true,
                                                value: time_period.currently_enrolled,
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
