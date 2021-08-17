import { useState, useEffect } from 'react';
import Navbar from '../container/Navbar';
import { InputGroup, Button } from 'react-bootstrap';
import axios from 'axios';
import Spinner from '../container/Spinner';
import { ServerAuth } from '../../Auth';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Superuser({ request, callback }) {
    const ticket = JSON.parse(localStorage.getItem('data'));

    const initialState = {
        spin: true,
        table: request,
    };

    const [{ spin, table }, setState] = useState(initialState);

    const confirmAccept = (e, row) => {
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <div className="custom-ui">
                        <h6>Are you sure you want to Accept this request?</h6>
                        <hr />
                        <Button variant="info" onClick={() => onClose()}>
                            No
                        </Button>
                        <Button
                            variant="danger"
                            onClick={(e) => {
                                handleAccept(e, row);
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

    const confirmReject = (e, row) => {
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <div className="custom-ui">
                        <h6>Are you sure you want to Reject this request?</h6>
                        <hr />
                        <Button variant="info" onClick={() => onClose()}>
                            No
                        </Button>
                        <Button
                            variant="danger"
                            onClick={(e) => {
                                handleReject(e, row);
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

    const handleAccept = (e, row) => {
        setState((prevState) => ({ ...prevState, spin: true }));
        axios
            .post('/api/superuser/accept', { ...ticket, data: row })
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
                setState(initialState);
                callback('reload');
            });
    };

    const handleReject = (e, row) => {
        setState((prevState) => ({ ...prevState, spin: true }));
        axios
            .post('/api/superuser/reject', { ...ticket, data: row })
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
                setState(initialState);
                callback('reload');
            });
    };

    const formatButton = (cell, row) => {
        return (
            <InputGroup style={{ textAlign: 'center' }}>
                <Button variant="success" onClick={(e) => confirmAccept(e, row)}>
                    Accept
                </Button>
                <Button variant="danger" onClick={(e) => confirmReject(e, row)}>
                    Reject
                </Button>
            </InputGroup>
        );
    };

    const columns = [
        { dataField: 'name', text: 'Name' },
        { dataField: 'email', text: 'Email' },
        { dataField: 'createdAt', text: 'Date Requested' },
        { dataField: '', text: 'Action', formatter: formatButton },
    ];

    return (
        <>
            <Navbar />
            <div style={{ paddingTop: '100px', paddingLeft: '50px' }}>
                {table ? (
                    <BootstrapTable
                        striped
                        keyField="request_id"
                        data={table}
                        columns={columns}
                        pagination={paginationFactory({ showTotal: true })}
                        wrapperClasses="talentpool-table"
                        filtersClasses="talentpool-table"
                        footerClasses="talentpool-table"
                    />
                ) : (
                    ''
                )}
            </div>
        </>
    );
}
