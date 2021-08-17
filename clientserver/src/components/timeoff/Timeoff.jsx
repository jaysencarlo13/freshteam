import Contents from '../container/Contents';
import Menubar from './Menubar';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Spinner from '../container/Spinner';
import TimeoffTable from './TimeoffTable';
import { ServerAuth } from '../../Auth';
import './timeoff.css';
import { InputGroup, FormControl, Button } from 'react-bootstrap';
import moment from 'moment';
import TimeoffModal from './TimeoffModal';

export default function Timeoff() {
    const ticket = JSON.parse(localStorage.getItem('data'));
    const initialState = {
        spin: true,
        table: undefined,
        update: false,
        from: moment().startOf('month').format('YYYY-MM-DD'),
        to: moment().endOf('month').format('YYYY-MM-DD'),
        show: false,
        remaining: undefined,
        menu: 'mytimeoff',
    };

    const [{ spin, table, update, from, to, show, remaining, menu }, setState] = useState(initialState);

    useEffect(() => {
        if (menu === 'mytimeoff')
            axios
                .post('/api/timeoff', { ...ticket, filter: [moment(from).toDate(), moment(to).toDate()] })
                .then((res) => {
                    if (res.data.isSuccess === true) {
                        setState((prevState) => ({
                            ...prevState,
                            spin: false,
                            table: res.data.table,
                            remaining: res.data.remaining,
                        }));
                    } else if (res.data.isAuthenticated === false) {
                        <ServerAuth />;
                    }
                })
                .catch((err) => {
                    setState((prevState) => ({ ...prevState, spin: false }));
                });
        else if (menu === 'employees_timeoff')
            axios
                .post('/api/timeoff/employees', {
                    ...ticket,
                    filter: [moment(from).toDate(), moment(to).toDate()],
                })
                .then((res) => {
                    if (res.data.isSuccess === true) {
                        setState((prevState) => ({
                            ...prevState,
                            spin: false,
                            table: res.data.table,
                            remaining: res.data.remaining,
                        }));
                    } else if (res.data.isAuthenticated === false) {
                        <ServerAuth />;
                    }
                })
                .catch((err) => {
                    setState((prevState) => ({ ...prevState, spin: false }));
                });
    }, [from, to, update]);

    const handleFilter = (e) => {
        const { name, value } = e.target;
        if (value) setState((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleMenu = (e) => {
        setState((prevState) => ({ ...prevState, spin: true, menu: e, update: !update }));
    };

    return (
        <Contents>
            <Menubar callback={handleMenu} />
            {/* able to request timeoff, able to see request timeoff
                status:
                1. request
                2. Accept or Reject
            */}
            <div className="row">
                <div className="row mb-3">
                    <div className="col-6">
                        <InputGroup className="mb-3">
                            <InputGroup.Text>From</InputGroup.Text>
                            <FormControl
                                aria-label="From"
                                value={from}
                                type="date"
                                name="from"
                                onChange={handleFilter}
                            />
                            <InputGroup.Text>To</InputGroup.Text>
                            <FormControl
                                aria-label="To"
                                value={to}
                                type="date"
                                name="to"
                                onChange={handleFilter}
                            />
                        </InputGroup>
                    </div>
                    <div className="col-6 timeoffRequest">
                        <Button
                            variant="info"
                            onClick={() => setState((prevState) => ({ ...prevState, show: true }))}
                        >
                            Request Timeoff
                        </Button>
                    </div>
                </div>
                <div className="col wrapperTimeoffTable">
                    {spin ? (
                        <Spinner />
                    ) : table ? (
                        <TimeoffTable
                            table={table}
                            filter={handleFilter}
                            menu={menu}
                            callback={() =>
                                setState((prevState) => ({
                                    ...prevState,
                                    spin: true,
                                    update: !update,
                                }))
                            }
                        />
                    ) : (
                        <h4>No request found</h4>
                    )}
                </div>
            </div>
            {remaining ? (
                <TimeoffModal
                    show={show}
                    remaining={remaining}
                    callback={() =>
                        setState((prevState) => ({
                            ...prevState,
                            show: false,
                            remaining: undefined,
                            update: !update,
                        }))
                    }
                />
            ) : (
                ''
            )}
        </Contents>
    );
}
