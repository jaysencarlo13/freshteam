import { useState } from 'react';
import { Modal, InputGroup, FormControl, Button } from 'react-bootstrap';
import Spinner from '../container/Spinner';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ModalEditOrganization({ show, callback, data }) {
    const ticket = JSON.parse(localStorage.getItem('data'));
    const initialState = {
        spin: false,
        created_by: data.created_by,
        name: data.name,
        description: data.description,
        headquarters: data.headquarters,
        industry: data.industry,
        departments: data.departments,
        edit_id: '',
        edit_department: '',
    };

    const [
        {
            spin,
            created_by,
            name,
            description,
            headquarters,
            industry,
            departments,
            edit_id,
            edit_department,
        },
        setState,
    ] = useState(initialState);

    const onHide = () => {
        callback('hide');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setState((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleUpdate = () => {
        setState((prevState) => ({ ...prevState, spin: true }));
        axios
            .post('/api/organization/update', {
                ...ticket,
                update: {
                    name,
                    description,
                    headquarters,
                    industry,
                    departments,
                },
            })
            .then((res) => {
                if (res.data.isSuccess === true) {
                    toast.success(res.data.message, {
                        position: toast.POSITION.TOP_LEFT,
                        autoClose: 3000,
                    });
                    callback('reload');
                }
            })
            .catch((err) => {
                toast.error(err.response.data.message, {
                    position: toast.POSITION.TOP_LEFT,
                    autoClose: 3000,
                });
                setState((prevState) => ({ ...prevState, spin: false }));
            });
    };

    const handleEdit = (e, id) => {
        const value = departments.find((element) => element._id.toString() === id.toString());
        setState((prevState) => ({ ...prevState, edit_id: id, edit_department: value.name }));
    };

    const handleEditCancel = () => {
        setState((prevState) => ({ ...prevState, edit_id: '', edit_department: '' }));
    };

    const handleEditSave = () => {
        let departments_ = departments;
        const index = departments.findIndex((element) => element._id.toString() === edit_id.toString());
        departments_[index] = { _id: edit_id, name: edit_department };
        setState((prevState) => ({
            ...prevState,
            departments: departments_,
            edit_id: '',
            edit_department: '',
        }));
    };

    const handleDelete = (e, id) => {
        let departments_ = departments;
        const index = departments_.findIndex((element) => element._id.toString() === id.toString());
        departments_.splice(index, 1);
        setState((prevState) => ({ ...prevState, departments: departments_ }));
    };

    const array_data = [
        { name: 'created_by', value: created_by, label: 'Created By', type: 'text', readOnly: true },
        { name: 'name', value: name, label: 'Name', type: 'text', readOnly: false },
        { name: 'description', value: description, label: 'Description', type: 'text', readOnly: false },
        {
            name: 'headquarters',
            value: headquarters,
            label: 'Headquarters',
            type: 'text',
            readOnly: false,
        },
        { name: 'industry', value: industry, label: 'Industry', type: 'text', readOnly: false },
    ];

    const array_departments = [
        { name: 'industry', value: industry, label: 'Industry', type: 'text', readOnly: false },
    ];

    return (
        <Modal show={show} onHide={onHide} className="navbar-modal-edit-organization">
            <Modal.Header closeButton>
                <Modal.Title id="example-modal-sizes-title-lg">Edit Organization</Modal.Title>
                <Button onClick={handleUpdate} variant="info">
                    Update
                </Button>
            </Modal.Header>
            {spin ? (
                <Spinner />
            ) : (
                <Modal.Body>
                    {array_data.map(({ name, value, label, type, readOnly }, index) => {
                        if (name === 'description') {
                            return (
                                <InputGroup className="mb-3" key={index}>
                                    <InputGroup.Text>{label}</InputGroup.Text>
                                    <FormControl
                                        as="textarea"
                                        rows={10}
                                        name={name}
                                        value={value}
                                        type={type}
                                        readOnly={readOnly}
                                        onChange={handleChange}
                                    />
                                </InputGroup>
                            );
                        }
                        return (
                            <InputGroup className="mb-3" key={index}>
                                <InputGroup.Text>{label}</InputGroup.Text>
                                <FormControl
                                    name={name}
                                    value={value}
                                    type={type}
                                    readOnly={readOnly}
                                    onChange={handleChange}
                                />
                            </InputGroup>
                        );
                    })}
                    {departments ? (
                        <div>
                            <h4>Departments</h4>
                            {departments.map(({ _id, name }, index) => {
                                if (edit_id === _id) {
                                    return (
                                        <InputGroup className="col-4 mb-3" key={index}>
                                            <FormControl
                                                name="edit_department"
                                                value={edit_department}
                                                type="text"
                                                readOnly={false}
                                                onChange={handleChange}
                                            />
                                            <Button variant="danger" onClick={handleEditCancel}>
                                                Cancel
                                            </Button>
                                            <Button variant="success" onClick={handleEditSave}>
                                                Save
                                            </Button>
                                        </InputGroup>
                                    );
                                }
                                return (
                                    <InputGroup className="col-4 mb-3" key={index}>
                                        <FormControl value={name} type="text" readOnly={true} />
                                        <Button variant="success" onClick={(e) => handleEdit(e, _id)}>
                                            Edit
                                        </Button>
                                        <Button variant="danger" onClick={(e) => handleDelete(e, _id)}>
                                            Delete
                                        </Button>
                                    </InputGroup>
                                );
                            })}
                        </div>
                    ) : (
                        ''
                    )}
                </Modal.Body>
            )}
        </Modal>
    );
}
