import { useEffect, useState } from 'react';
import Contents from '../container/Contents';
import './recruitment.css';
import axios from 'axios';
import Jobs from './Jobs';
import Nav from './Nav';
import { ServerAuth } from '../../Auth';
import Spinner from '../container/Spinner';

export default function Recruitment() {
    const ticket = JSON.parse(localStorage.getItem('data'));
    const initialState = {
        responseData: undefined,
        spin: true,
    };

    const [{ responseData, spin }, setState] = useState(initialState);

    useEffect(() => {
        axios.post('/api/recruitment', { ...ticket }).then((res) => {
            if (res.data && res.data.isSuccess === true) {
                const { jobs } = res.data;
                setState((prevState) => ({ ...prevState, responseData: { jobs }, spin: !spin }));
            } else if (res.data && res.data.isAuthenticated === false) {
                <ServerAuth />;
            }
        });
    }, []);

    if (!spin)
        return (
            <Contents>
                <Nav active="jobs" />
                {responseData ? <Jobs data={responseData['jobs']} /> : <h3>No Job Posted.</h3>}
            </Contents>
        );
    else
        return (
            <Contents>
                <Nav active="jobs" />
                <Spinner />
            </Contents>
        );
}
