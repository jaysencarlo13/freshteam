import { Card, Form, Button, FormLabel } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState } from 'react';
import { ServerAuth } from '../../Auth';

export default function AddInfo({ additional_information, callback }) {
    const ticket = JSON.parse(localStorage.getItem('data'));
    const initialState = {
        spin: false,
        info: additional_information,
    };

    const [{ spin, info }, setState] = useState(initialState);

    const handleSave = () => {
        setState((prevState) => ({ ...prevState, spin: true }));
        axios
            .post('/api/applicant/update/additional_information', { ...ticket, info })
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
            <Card.Header className="applicant-personalinfo-header">Additional Information</Card.Header>
            <Card.Body className="applicant-personalinfo-body">
                <div className="col">
                    <div className="form-floating">
                        <textarea
                            className="form-control"
                            id="floatingTextarea"
                            style={{ height: '20vh' }}
                            value={info}
                            onChange={(e) =>
                                setState((prevState) => ({ ...prevState, info: e.target.value }))
                            }
                        />
                    </div>
                </div>
            </Card.Body>
            <Card.Footer>
                <Button variant="success" onClick={handleSave}>
                    Save
                </Button>
            </Card.Footer>
        </Card>
    );
}
