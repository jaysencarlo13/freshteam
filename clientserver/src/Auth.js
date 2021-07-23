import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';

function Auth() {
    const _data = JSON.parse(localStorage.getItem('data'));
    const [data] = useState(_data);
    if (data && data.user && data.sessionID) {
        return '';
    } else {
        return <Redirect to="/login" />;
    }
}

function ServerAuth() {
    localStorage.clear();
    return <Redirect to="/login" />;
}

export { Auth, ServerAuth };
