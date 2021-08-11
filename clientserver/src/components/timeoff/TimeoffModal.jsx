import { Modal, Button, Form, InputGroup, FormControl } from 'react-bootstrap';
import { useState } from 'react';
import moment from 'moment';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import uniqid from 'uniqid';
import axios from 'axios';

export default function TimeoffModal({ show, callback, remaining: _remaining }) {
    const ticket = JSON.parse(localStorage.getItem('data'));
    const initialState = {
        array: [],
        date: moment().format('YYYY-MM-DD'),
        remaining: _remaining,
    };

    const [{ array, date, remaining }, setState] = useState(initialState);

    const handleClose = () => {
        setState(initialState);
        callback('Close');
    };

    const handleAdd = () => {
        if (date) {
            if (remaining !== 0) {
                let _array = array;
                _array.push({ id: uniqid(), date });
                _array = _array.sort((first, second) => {
                    if (first.date > second.date) return 1;
                    if (first.date < second.date) return -1;
                    return 0;
                });
                setState((prevState) => ({
                    ...prevState,
                    array: _array,
                    date: moment().format('YYYY-MM-DD'),
                    remaining: remaining - 1,
                }));
            } else {
                toast.error('You dont have enough timeoff', {
                    position: toast.POSITION.TOP_LEFT,
                    autoClose: 3000,
                });
            }
        } else {
            toast.error('Invalid Date', {
                position: toast.POSITION.TOP_LEFT,
                autoClose: 3000,
            });
            setState((prevState) => ({ ...prevState, date: moment().format('YYYY-MM-DD') }));
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setState((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleDelete = (e, id) => {
        let _array = array;
        let index = _array.findIndex((element) => element.id.toString() === id.toString());
        _array.splice(index, 1);
        setState((prevState) => ({ ...prevState, array: _array, remaining: remaining + 1 }));
    };

    const handleRequest = () => {
        if (array.length !== 0) {
            axios.post('/api/timeoff/request', { ...ticket, array, remaining }).then((res) => {
                if (res.data.isSuccess === true) {
                    toast.success(res.data.message, {
                        position: toast.POSITION.TOP_LEFT,
                        autoClose: 3000,
                    });
                    handleClose();
                }
            });
        } else {
            toast.error('There is no date', {
                position: toast.POSITION.TOP_LEFT,
                autoClose: 3000,
            });
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Request Timeoff</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h4>Remaining: {remaining}</h4>
                <div className="col-5">
                    {array.length === 0
                        ? ''
                        : array.map(({ id, date }) => {
                              return (
                                  <InputGroup className="mb-3" key={id}>
                                      <FormControl readOnly aria-label="Date" type="date" value={date} />
                                      <Button onClick={(e) => handleDelete(e, id)} variant="danger">
                                          Delete
                                      </Button>
                                  </InputGroup>
                              );
                          })}
                    <InputGroup className="mb-3">
                        <FormControl
                            aria-label="Date"
                            type="date"
                            name="date"
                            value={date}
                            onChange={handleChange}
                        />
                        <Button onClick={handleAdd} variant="success">
                            Add
                        </Button>
                    </InputGroup>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleRequest}>
                    Request
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
