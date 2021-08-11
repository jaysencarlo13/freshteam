import axios from 'axios';
import { useEffect, useState } from 'react';
import { Auth, ServerAuth } from '../../Auth';
import { Redirect } from 'react-router-dom';
import Spinner from '../container/Spinner';

function Logout() {
    const [logout, setLogout] = useState(false);
    const [redirect, setRedirect] = useState(undefined);

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem('data'));
        axios
            .post('/api/logout', { ...data })
            .then((res) => {
                console.log(res);
                if (res.data && res.data.isLogout === true) {
                    localStorage.clear();
                    setLogout(true);
                } else if (res.data.isAuthenticated === false) {
                    <ServerAuth />;
                }
            })
            .catch((err) => {
                console.log(err);
                setRedirect(true);
            });
    }, []);
    if (redirect) return <Redirect to="/" />;
    if (logout) return <Auth />;
    return <Spinner />;
}

export default Logout;
