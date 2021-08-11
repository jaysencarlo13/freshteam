import axios from 'axios';
import { useEffect, useState } from 'react';
import Contents from '../container/Contents';
import SettingsTable from './SettingsTable';
import { InputGroup, FormControl } from 'react-bootstrap';
import Spinner from '../container/Spinner';
import { ServerAuth } from '../../Auth';
import './settings.css';

export default function Settings() {
    const ticket = JSON.parse(localStorage.getItem('data'));

    const initialState = {
        spin: true,
        table: undefined,
        search: '',
        update: false,
    };

    const [{ spin, table, search, update }, setState] = useState(initialState);

    useEffect(() => {
        axios
            .post('/api/settings', { ...ticket, search })
            .then((res) => {
                if (res.data.isSuccess === true) {
                    const { table } = res.data;
                    setState((prevState) => ({ ...prevState, table, spin: false }));
                } else if (res.data.isAuthenticated === false) {
                    <ServerAuth />;
                }
            })
            .catch((err) => {
                setState((prevState) => ({ ...prevState, spin: false }));
            });
    }, [search, update]);

    const handleSearch = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        setState((prevState) => ({ ...prevState, [name]: value, spin: true }));
    };

    const handleUpdate = () => {
        setState((prevState) => ({ ...prevState, spin: true, update: !update }));
    };

    return (
        <Contents>
            <div className="col-3">
                <InputGroup size="sm" className="mb-3">
                    <InputGroup.Text id="inputGroup-sizing-sm">Search by Name:</InputGroup.Text>
                    <FormControl
                        aria-label="Small"
                        aria-describedby="inputGroup-sizing-sm"
                        name="search"
                        value={search}
                        onChange={handleSearch}
                    />
                </InputGroup>
            </div>
            <div className="col">
                {spin ? (
                    <Spinner />
                ) : table ? (
                    <SettingsTable data={table} callback={handleUpdate} />
                ) : (
                    <h4 style={{ color: 'red' }}>No Data Found</h4>
                )}
            </div>
        </Contents>
    );
}
