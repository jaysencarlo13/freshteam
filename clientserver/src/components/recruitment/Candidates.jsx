import { useEffect, useState } from 'react';
import Contents from '../container/Contents';
import './recruitment.css';
import axios from 'axios';
import Nav from './Nav';
import queryString from 'query-string';
import { ServerAuth } from '../../Auth';
import Spinner from '../container/Spinner';
import CandidatesTable from './CandidatesTable';
import './candidates.css';

export default function Recruitment() {
    let { postid } = queryString.parse(window.location.search);
    const ticket = JSON.parse(localStorage.getItem('data'));

    const initialState = {
        spin: true,
        candidates: undefined,
        update: false,
        messenger: undefined,
    };

    const [{ spin, candidates, update, messenger }, setState] = useState(initialState);

    useEffect(() => {
        axios.post('/api/recruitment/candidates', { ...ticket, postid }).then((res) => {
            if (res.data && res.data.isSuccess === true) {
                const { candidates, messenger } = res.data;
                setState((prevState) => ({ ...prevState, candidates, spin: false, messenger }));
            } else if (res.data && res.data.isAuthenticated === false) {
                <ServerAuth />;
            }
        });
    }, [update]);

    const handleCallback = (e) => {
        setState((prevState) => ({ ...prevState, update: !update, spin: true }));
    };

    if (!spin)
        return (
            <Contents>
                <Nav active="candidates" />
                {candidates ? (
                    <CandidatesTable
                        data_candidates={candidates}
                        callback={handleCallback}
                        messenger={messenger}
                    />
                ) : (
                    'No Candidates For this JobPost'
                )}
            </Contents>
        );
    else
        return (
            <Contents>
                <Spinner />
            </Contents>
        );
}
