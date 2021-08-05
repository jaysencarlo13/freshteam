import React, { useEffect, useState } from 'react';
import Contents from '../container/Contents';
import './personal-info.css';
import PersonalInfo from './PersonalInfo';
import WorkInfo from './WorkInfo';
import axios from 'axios';
import Spinner from '../container/Spinner';

export default function ViewAccount() {
    const [userData, setUserData] = useState(null);
    const [spin, setSpin] = useState(true);
    const data = JSON.parse(localStorage.getItem('data'));
    useEffect(() => {
        if (!userData)
            axios
                .post('/api/user', data)
                .then((res) => {
                    setUserData(res.data.user);
                    setSpin(false);
                })
                .catch((err) => {});
    }, []);
    if (!spin)
        return (
            <Contents>
                {userData ? (
                    <div className="container personal-info">
                        <div className="row">
                            <PersonalInfo data={userData['personal_info']} />
                            <WorkInfo data={userData['work_info']} />
                        </div>
                    </div>
                ) : (
                    <h1>No Data</h1>
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
