import { useEffect, useState } from 'react';
import Contents from '../container/Contents';
import './recruitment.css';
import axios from 'axios';
import Nav from './Nav';
import queryString from 'query-string';
import { ServerAuth } from '../../Auth';

export default function Recruitment() {
    let { postid } = queryString.parse(window.location.search);
    const ticket = JSON.parse(localStorage.getItem('data'));

    const initialState = {
        responseData: undefined,
    };

    const [{ responseData }, setState] = useState(initialState);

    useEffect(() => {
        axios.post('/api/recruitment/candidates', { ...ticket, postid }).then((res) => {
            if (res.data && res.data.isSuccess === true) {
                const { jobs } = res.data;
                setState((prevState) => ({ ...prevState, responseData: { jobs } }));
            } else if (res.data && res.data.isAuthenticated === false) {
                <ServerAuth />;
            }
        });
    }, []);

    if (responseData)
        return (
            <Contents>
                <Nav active="candidates" />
            </Contents>
        );
    else return '';
}
