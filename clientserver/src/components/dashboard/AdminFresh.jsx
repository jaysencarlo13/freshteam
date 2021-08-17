import { useState } from 'react';
import Navbar from '../container/Navbar';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import Spinner from '../container/Spinner';
import { ServerAuth } from '../../Auth';

export default function AdminFresh({ callback }) {
    let ticket = JSON.parse(localStorage.getItem('data'));

    const initialState = {
        spin: false,
        name: '',
        description: '',
        headquarters: '',
        industry: '',
    };

    const [{ spin, name, description, headquarters, industry }, setState] = useState(initialState);

    const handleCreate = () => {
        setState((prevState) => ({ ...prevState, spin: true }));
        axios
            .post('/api/admin_fresh', { ...ticket, data: { name, description, headquarters, industry } })
            .then((res) => {
                if (res.data.isSuccess === true) {
                    setState(initialState);
                    localStorage.clear();
                    ticket.user.usertype = 'admin';
                    localStorage.setItem('data', JSON.stringify(ticket));
                    callback('reload');
                } else if (res.data.isAuthenticated === false) {
                    <ServerAuth />;
                }
            })
            .catch((err) => {
                setState((prevState) => ({ ...prevState, spin: false }));
            });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setState((prevState) => ({ ...prevState, [name]: value }));
    };

    return (
        <>
            <Navbar />
            <div style={{ paddingTop: '100px', paddingLeft: '50px' }} className="row justify-content-center">
                <div className="col-5">
                    {spin ? (
                        <Spinner />
                    ) : (
                        <Form>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Name of Organization</Form.Label>
                                <Form.Control
                                    name="name"
                                    value={name}
                                    type="text"
                                    placeholder="Enter name of organization"
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    name="description"
                                    value={description}
                                    as="textarea"
                                    rows={5}
                                    cols={30}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Headquarters</Form.Label>
                                <Form.Control
                                    name="headquarters"
                                    value={headquarters}
                                    type="text"
                                    placeholder="Enter Location of this organization"
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Industry</Form.Label>
                                <Form.Control
                                    name="industry"
                                    value={industry}
                                    type="text"
                                    placeholder="Enter type of industry of this organization"
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            <Button variant="primary" onClick={handleCreate}>
                                Create
                            </Button>
                        </Form>
                    )}
                </div>
            </div>
        </>
    );
}
