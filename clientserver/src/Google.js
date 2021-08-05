import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import Google from './components/inbox/Google';
import { ServerAuth } from './Auth';

function CheckGoogle({ callback }) {
    const ticket = JSON.parse(localStorage.getItem('data'));
    const [isSetup, set] = useState(undefined);

    useEffect(() => {
        axios
            .post('/api/inbox/check', { ...ticket })
            .then((res) => {
                if (res.data.isSetup === true) {
                    set(true);
                } else if (res.data.isSetup === false) {
                    set(false);
                } else if (res.data.isAuthenticated === false) {
                    return <ServerAuth />;
                }
            })
            .catch((err) => {
                return <Redirect to="/" />;
            });
    }, []);

    if (isSetup === true || isSetup === false) {
        callback(isSetup);
    }

    return '';
}

export { CheckGoogle };
