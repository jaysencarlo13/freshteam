import { Card, InputGroup, FormControl, Button } from 'react-bootstrap';
import { useState } from 'react';
import './manageaccount.css';

export default function PersonalInfo({ personal_info }) {
    const initialState = {
        name: personal_info['name'],
        nameEdit: false,
    };

    const [{ name, nameEdit }, setState] = useState(initialState);

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
        const { variable, variableEdit } = data;
        setState((prevState) => ({
            ...prevState,
            [variableEdit]: false,
            [variable]: personal_info[variable],
        }));
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

    const Template = ({ variable, text, value }) => {
        return (
            <div
                className="row applicant"
                role="button"
                onClick={(e) => handleEdit(e, { variable: variable, variableEdit: variable + 'Edit' })}
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
            <InputGroup>
                <FormControl value={name} onChange={(e) => handleChange(e, { variable })} />
                <Button
                    variant="outline-danger"
                    onClick={(e) => handleCancel(e, { variable, variableEdit: variable + 'Edit', property })}
                >
                    Cancel
                </Button>
                <Button
                    variant="outline-info"
                    // onClick={(e) => handleUpdate(e, { variable, variableEdit: variable + 'Edit', property })}
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
                        <div className="row" role="button">
                            {nameEdit ? (
                                <Input variable="name" text="Name" value={name} />
                            ) : (
                                <Template variable="name" text="Name" value={name} />
                            )}
                        </div>
                    </div>
                    <div className="col-md-5"></div>
                </div>
            </Card.Body>
        </Card>
    );
}
