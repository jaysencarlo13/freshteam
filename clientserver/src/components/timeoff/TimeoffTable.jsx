import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { Button, InputGroup } from 'react-bootstrap';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { useState } from 'react';
import Spinner from '../container/Spinner';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ServerAuth } from '../../Auth';

export default function TimeoffTable({ table, menu, callback }) {
    const ticket = JSON.parse(localStorage.getItem('data'));
    const role = JSON.parse(localStorage.getItem('data')).user.usertype;

    const initialState = {
        spin: false,
    };

    const [{ spin }, setState] = useState(initialState);

    const formatButton = (cell, row) => {
        if (row._id && row.status !== 'Accepted' && row.status !== 'Rejected') {
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
        }
        return '';
    };

    const confirmAccept = (e, row) => {
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <div className="custom-ui">
                        <h6>Are you sure you want to Accept this Timeoff ?</h6>
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

    const handleAccept = (e, row) => {
        setState((prevState) => ({ ...prevState, spin: true }));
        axios
            .post('/api/timeoff/accept', { ...ticket, id: row._id, member_id: row.member_id })
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
            });
    };

    const confirmReject = (e, row) => {
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <div className="custom-ui">
                        <h6>Are you sure you want to Reject this Timeoff ?</h6>
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

    const handleReject = (e, row) => {
        setState((prevState) => ({ ...prevState, spin: true }));
        axios
            .post('/api/timeoff/reject', { ...ticket, id: row._id })
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
            .then((err) => {
                if (err && err.response && err.response.data && err.response.data.message) {
                    toast.error(err.response.data.message, {
                        position: toast.POSITION.TOP_LEFT,
                        autoClose: 3000,
                    });
                    setState(initialState);
                }
            });
    };

    const columns =
        role === 'admin' && menu !== 'mytimeoff'
            ? [
                  { dataField: 'name', text: 'Name' },
                  { dataField: 'createdAt', text: 'Date Requested' },
                  { dataField: 'date', text: 'Date' },
                  { dataField: 'status', text: 'Status' },
                  { dataField: '', text: 'Action', formatter: formatButton },
              ]
            : [
                  { dataField: 'name', text: 'Name' },
                  { dataField: 'createdAt', text: 'Date Requested' },
                  { dataField: 'date', text: 'Date' },
                  { dataField: 'status', text: 'Status' },
              ];

    return (
        <div>
            {spin ? (
                <Spinner />
            ) : (
                <BootstrapTable
                    striped
                    keyField="_id"
                    data={table}
                    columns={columns}
                    pagination={paginationFactory({ showTotal: true })}
                    wrapperClasses="talentpool-table"
                    filtersClasses="talentpool-table"
                    footerClasses="talentpool-table"
                />
            )}
        </div>
    );
}
