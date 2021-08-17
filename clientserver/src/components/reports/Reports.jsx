import { useState } from 'react';
import Content from '../container/Contents';
import Line from './Line';
import axios from 'axios';
import Spinner from '../container/Spinner';

export default function Reports() {
    const ticket = JSON.parse(localStorage.getItem('data'));
    const initialState = {
        spin: true,
        rejected_candidates: undefined,
        job_postings: undefined,
        hired: undefined,
    };

    const [{ spin, rejected_candidates, job_postings, hired }, setState] = useState(initialState);

    useState(() => {
        axios.post('/api/reports', { ...ticket }).then((res) => {
            if (res.data.isSuccess === true) {
                const { rejected_candidates, job_postings, hired } = res.data;
                setState((prevState) => ({
                    ...prevState,
                    spin: false,
                    rejected_candidates,
                    job_postings,
                    hired,
                }));
            }
        });
    }, []);

    return (
        <Content>
            {spin ? (
                <Spinner />
            ) : (
                <div className="row justify-content-center" style={{ textAlign: 'center' }}>
                    <div className="col-9 mb-5">
                        <h2>Total Rejected Candidates for the past 12months</h2>
                        <Line
                            labels={rejected_candidates.labels}
                            data={rejected_candidates.data}
                            title="# of rejected candidates"
                            backgroundColor="red"
                            borderColor="#a9a9a9"
                        />
                    </div>
                    <div className="col-9 mb-5">
                        <h2>Total Job Postings for the past 12months</h2>
                        <Line
                            labels={job_postings.labels}
                            data={job_postings.data}
                            title="# of job posted"
                            backgroundColor="green"
                            borderColor="#a9a9a9"
                        />
                    </div>
                    <div className="col-9 mb-5">
                        <h2>Total Hired for the past 12months</h2>
                        <Line
                            labels={hired.labels}
                            data={hired.data}
                            title="# of hired"
                            backgroundColor="blue"
                            borderColor="#a9a9a9"
                        />
                    </div>
                </div>
            )}
        </Content>
    );
}
