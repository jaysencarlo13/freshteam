import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { Button, InputGroup } from 'react-bootstrap';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ServerAuth } from '../../Auth';

export default function EmployeeTable({ table, view, menubar, callback }) {
    const ticket = JSON.parse(localStorage.getItem('data'));
    const role = JSON.parse(localStorage.getItem('data')).user.usertype;

    const handleReject_yes = (e, row) => {
        axios
            .post('/api/employees/offboarding/reject', { ...ticket, id: row._id })
            .then((res) => {
                if (res.data.isSuccess === true) {
                    toast.success(res.data.message, {
                        position: toast.POSITION.TOP_LEFT,
                        autoClose: 5000,
                    });
                    callback('reload');
                } else if (res.data.isAuthenticated === false) {
                    <ServerAuth />;
                }
            })
            .catch((err) => {
                toast.error(err.response.data.message, {
                    position: toast.POSITION.TOP_LEFT,
                    autoClose: 5000,
                });
            });
    };

    const handleReject = (e, row) => {
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <div className="custom-ui">
                        <h6>
                            Are you sure you want to Reject offboarding of <b>{row.name}</b>
                        </h6>
                        <hr />
                        <Button variant="info" onClick={() => onClose()}>
                            No
                        </Button>
                        <Button
                            variant="danger"
                            onClick={(e) => {
                                handleReject_yes(e, row);
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

    const handleRemove = (e, row) => {
        axios
            .post('/api/employees/offboarding/accept', { ...ticket, id_remove: row._id })
            .then((res) => {
                if (res.data.isSuccess === true) {
                    toast.success(res.data.message, {
                        position: toast.POSITION.TOP_LEFT,
                        autoClose: 5000,
                    });
                    callback('reload');
                } else if (res.data.isAuthenticated === false) {
                    <ServerAuth />;
                }
            })
            .catch((err) => {
                toast.error(err.response.data.message, {
                    position: toast.POSITION.TOP_LEFT,
                    autoClose: 5000,
                });
            });
    };

    const handleAccept = (e, row) => {
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <div className="custom-ui">
                        <h6>
                            Are you sure you want to Accept offboarding of <b>{row.name}</b>
                        </h6>
                        <hr />
                        <Button variant="info" onClick={() => onClose()}>
                            No
                        </Button>
                        <Button
                            variant="danger"
                            onClick={(e) => {
                                handleRemove(e, row);
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

    const formatButton = (cell, row) => {
        if (row._id) {
            if (menubar !== 'offboarding' || role !== 'admin')
                return (
                    <Button variant="info" onClick={(e) => handleView(e, row)}>
                        View
                    </Button>
                );
            return (
                <InputGroup style={{ textAlign: 'center' }}>
                    <Button variant="info" onClick={(e) => handleView(e, row)}>
                        View
                    </Button>
                    <Button variant="danger" onClick={(e) => handleAccept(e, row)}>
                        Accept
                    </Button>
                    <Button variant="success" onClick={(e) => handleReject(e, row)}>
                        Reject
                    </Button>
                </InputGroup>
            );
        }
    };

    const columns = [
        { dataField: 'name', text: 'Name' },
        { dataField: 'email', text: 'Email' },
        { dataField: 'title', text: 'Job Title' },
        { dataField: 'join_date', text: 'Join Date' },
        { dataField: '', text: 'Action', formatter: formatButton },
    ];

    const handleView = (e, data) => {
        e.preventDefault();
        view(data);
    };
    return (
        <div>
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
        </div>
    );
}
