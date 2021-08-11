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

export default function CertificationLicenses({ certification_licenses, callback }) {
    const ticket = JSON.parse(localStorage.getItem('data'));

    const initialState = {
        title: '',
        does_expire: false,
        from: moment().format('YYYY-MM-DD'),
        to: moment().format('YYYY-MM-DD'),
        array: certification_licenses ? certification_licenses : [],
        isAdd: false,
        spinAdd: false,
        spinEdit: false,
        spinDelete: false,
        id_edit: '',
        title_edit: '',
        does_expire_edit: false,
        from_edit: moment().format('YYYY-MM-DD'),
        to_edit: moment().format('YYYY-MM-DD'),
    };

    const [
        {
            title,
            does_expire,
            from,
            to,
            array,
            isAdd,
            spinAdd,
            spinEdit,
            spinDelete,
            id_edit,
            title_edit,
            does_expire_edit,
            from_edit,
            to_edit,
        },
        setState,
    ] = useState(initialState);

    const arrayAdd = [
        {
            name: 'title',
            type: 'text',
            value: title,
            label: 'Title',
            readOnly: false,
        },
        {
            name: 'does_expire',
            type: 'checkbox',
            value: does_expire,
            label: 'Does Expire ? ',
            readOnly: false,
        },
        {
            name: 'from',
            type: 'date',
            value: from,
            label: 'From',
            readOnly: false,
        },
        {
            name: 'to',
            type: 'date',
            value: to,
            label: 'To',
            readOnly: false,
        },
    ];

    const arrayEdit = [
        {
            name: 'title_edit',
            type: 'text',
            value: title_edit,
            label: 'Title',
            readOnly: false,
        },
        {
            name: 'does_expire_edit',
            type: 'checkbox',
            value: does_expire_edit,
            label: 'Does Expire ? ',
            readOnly: false,
        },
        {
            name: 'from_edit',
            type: 'date',
            value: from_edit,
            label: 'From',
            readOnly: false,
        },
        {
            name: 'to_edit',
            type: 'date',
            value: to_edit,
            label: 'To',
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
        let { title, time_period } = array.find((element) => element._id.toString() === id.toString());
        setState((prevState) => ({
            ...prevState,
            id_edit: id,
            title_edit: title,
            does_expire_edit: time_period.does_expire,
            from_edit: time_period.from,
            to_edit: time_period.to,
        }));
    };

    const handleCancel = () => {
        setState(initialState);
    };

    const handleSave = (e) => {
        setState((prevState) => ({ ...prevState, spinAdd: true }));
        axios
            .post('/api/applicant/add/certification_licenses', {
                ...ticket,
                data: {
                    title,
                    time_period: {
                        does_expire,
                        from,
                        to,
                    },
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
            .post('/api/applicant/update/certification_licenses', {
                ...ticket,
                data: {
                    id: id_edit,
                    title: title_edit,
                    time_period: {
                        does_expire_edit,
                        from_edit,
                        to_edit,
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
            .post('/api/applicant/delete/certification_licenses', { ...ticket, id })
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
            <Card.Body className="applicant-personalinfo-body"></Card.Body>
        </Card>
    );
}
