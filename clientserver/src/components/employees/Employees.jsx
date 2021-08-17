import Contents from '../container/Contents';
import EmployeesTable from './EmployeesTable';
import EmployeesSearch from './EmployeesSearch';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { ServerAuth } from '../../Auth';
import Spinner from '../container/Spinner';
import { InputGroup, FormControl, Button } from 'react-bootstrap';
import EmployeesModal from './EmployeesModal';
import Menubar from './Menubar';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import './employees.css';

export default function Employees() {
    const ticket = JSON.parse(localStorage.getItem('data'));
    const role = JSON.parse(localStorage.getItem('data')).user.usertype;

    const initialState = {
        spin: true,
        table: undefined,
        search: '',
        category: 'name',
        show: false,
        view: undefined,
        menubar: 'directories',
        update: false,
    };

    const [{ spin, table, search, category, show, view, menubar, update }, setState] = useState(initialState);

    useEffect(() => {
        if (menubar === 'directories')
            axios
                .post('/api/employees', { ...ticket, search, category })
                .then((res) => {
                    if (res.data.isSuccess === true) {
                        setState((prevState) => ({ ...prevState, spin: false, table: res.data.table }));
                    } else if (res.data.isAuthenticated === false) {
                        <ServerAuth />;
                    }
                })
                .catch((err) => {
                    setState((prevState) => ({ ...prevState, spin: false }));
                });
        else if (menubar === 'onboarding')
            axios
                .post('/api/employees/onboarding', { ...ticket, search, category })
                .then((res) => {
                    if (res.data.isSuccess === true) {
                        setState((prevState) => ({ ...prevState, spin: false, table: res.data.table }));
                    } else if (res.data.isAuthenticated === false) {
                        <ServerAuth />;
                    }
                })
                .catch((err) => {
                    setState((prevState) => ({ ...prevState, spin: false }));
                });
        else if (menubar === 'offboarding')
            axios
                .post('/api/employees/offboarding', { ...ticket, search, category })
                .then((res) => {
                    if (res.data.isSuccess === true) {
                        setState((prevState) => ({ ...prevState, spin: false, table: res.data.table }));
                    } else if (res.data.isAuthenticated === false) {
                        <ServerAuth />;
                    }
                })
                .catch((err) => {
                    setState((prevState) => ({ ...prevState, spin: false }));
                });
    }, [search, menubar, update]);

    const handleView = (e) => {
        setState((prevState) => ({ ...prevState, view: e, show: true }));
    };

    const handleCategory = (e) => {
        setState((prevState) => ({ ...prevState, category: e.target.value, search: '' }));
    };

    const handleSearch = (e) => {
        setState((prevState) => ({ ...prevState, search: e.target.value, spin: true }));
    };

    const handleHide = () => {
        setState((prevState) => ({
            ...prevState,
            show: false,
            spin: true,
            update: !update,
            view: undefined,
        }));
    };

    const handleMenubar = (e) => {
        setState((prevState) => ({ ...prevState, menubar: e, spin: true, update: !update }));
    };

    const handleRequestOffboard = () => {
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <div className="custom-ui">
                        <h6>
                            Are you sure you want to Request offboard. This will means that you want to leave
                            to your organization. If yes we will send your request to the admin.
                        </h6>
                        <hr />
                        <Button variant="info" onClick={() => onClose()}>
                            No
                        </Button>
                        <Button
                            variant="danger"
                            onClick={(e) => {
                                handleRequestOffboard_yes(e);
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

    const handleRequestOffboard_yes = (e) => {
        axios
            .post('/api/employees/offboarding/request', { ...ticket })
            .then((res) => {
                if (res.data.isSuccess === true) {
                    toast.success(res.data.message, {
                        position: toast.POSITION.TOP_LEFT,
                        autoClose: 5000,
                    });
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

    const handleRefresh = (e) => {
        setState((prevState) => ({ ...prevState, update: !update }));
    };

    return (
        <Contents>
            <div className="mb-3">
                <Menubar callback={handleMenubar} />
            </div>
            <div className="col-3">
                <InputGroup className="mb-3">
                    <select
                        className="form-select"
                        aria-label="Default select example"
                        onChange={handleCategory}
                        value={category}
                    >
                        <option value="name">Search By Name</option>
                        <option value="email">Search By Email</option>
                        <option value="title">Search By Title</option>
                    </select>
                    <FormControl
                        aria-label="Text input with dropdown button"
                        value={search}
                        onChange={handleSearch}
                    />
                </InputGroup>
            </div>
            {menubar === 'offboarding' && role !== 'admin' ? (
                <div className="col-3 mb-3">
                    <Button onClick={handleRequestOffboard}>Request Offboard</Button>
                </div>
            ) : (
                ''
            )}

            <div className="col">
                {spin ? (
                    <Spinner />
                ) : (
                    <EmployeesTable
                        table={table}
                        view={handleView}
                        menubar={menubar}
                        callback={handleRefresh}
                    />
                )}
            </div>
            {view ? <EmployeesModal view={view} show={show} hide={handleHide} /> : ''}
        </Contents>
    );
}
