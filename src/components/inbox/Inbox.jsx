import Contents from '../container/Contents';
import Sidebar from './Sidebar';
import './inbox.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { ServerAuth } from '../../Auth';
import Spinner from '../container/Spinner';
import { Redirect } from 'react-router-dom';
import Google from './Google';
import Subsidebar from './Subsidebar';
import Mail from './Mail';
import Parser from 'html-react-parser';
import Compose from './Compose';

export default function Inbox() {
    const ticket = JSON.parse(localStorage.getItem('data'));
    const initialState = {
        spin: true,
        isSetup: undefined,
        trigger: 'all',
        messages: undefined,
        selected: undefined,
        update: false,
        googleMessage: undefined,
        email: undefined,
        compose: false,
    };

    const [{ spin, isSetup, trigger, messages, selected, update, googleMessage, email, compose }, setState] =
        useState(initialState);

    const handleTrigger = (e) => {
        setState((prevState) => ({ ...prevState, trigger: e, spin: true, update: !update, compose: false }));
    };

    const handleCallback = () => {
        setState(initialState);
    };

    const handleSubsidebar = (e) => {
        setState((prevState) => ({ ...prevState, selected: e }));
    };

    const handleCompose = (e) => {
        setState((prevState) => ({ ...prevState, compose: e }));
    };

    useEffect(() => {
        if (isSetup === undefined) {
            axios
                .post('/api/inbox/check', { ...ticket })
                .then((res) => {
                    if (res.data.isSetup === true) {
                        setState((prevState) => ({ ...prevState, isSetup: true }));
                    } else if (res.data.isSetup === false) {
                        setState((prevState) => ({ ...prevState, isSetup: false }));
                    } else if (res.data.isAuthenticated === false) {
                        return <ServerAuth />;
                    }
                })
                .catch((err) => {
                    return <Redirect to="/" />;
                });
        }
        if (isSetup)
            axios
                .post('/api/inbox', { ...ticket, trigger })
                .then((res) => {
                    if (res.data.isSuccess === true) {
                        const { messages, email } = res.data;
                        setState((prevState) => ({ ...prevState, messages, email, spin: false }));
                        console.log(messages);
                    } else if (res.data.isGoogle === false) {
                        setState((prevState) => ({
                            ...prevState,
                            isSetup: false,
                            googleMessage:
                                'Please make sure the password is correct and you have enabled less secure apps in your google account in this link ',
                        }));
                    } else if (res.data.isAuthenticated === false) {
                        <ServerAuth />;
                    }
                })
                .catch((err) => {
                    console.log(err.response.data);
                });
    }, [isSetup, trigger, update]);

    if (compose) {
        return (
            <Contents>
                <div className="row">
                    <div className="col-1 inbox-sidebar">
                        <Sidebar trigger={handleTrigger} compose={handleCompose} />
                    </div>
                    <div className="col">
                        <Compose email={email} />
                    </div>
                </div>
            </Contents>
        );
    }
    if (isSetup === undefined || isSetup === true) {
        return (
            <Contents>
                <div className="row">
                    <div className="col-1 inbox-sidebar ">
                        <Sidebar trigger={handleTrigger} compose={handleCompose} />
                    </div>
                    <div className="col-3 inbox-sub-sidebar">
                        {spin ? (
                            <Spinner />
                        ) : !messages || messages.length === 0 ? (
                            <div
                                className="row"
                                style={{
                                    color: 'red',
                                    fontWeight: '900',
                                    fontSize: '25px',
                                    textAlign: 'center',
                                }}
                            >
                                <div className="col-md-12">No messages found</div>
                            </div>
                        ) : (
                            <Subsidebar messages={messages} callback={handleSubsidebar} />
                        )}
                    </div>
                    <div className="col inbox-selected">
                        {!selected ? '' : <Mail data={selected} email={email} />}
                    </div>
                </div>
            </Contents>
        );
    } else return <Google callback={handleCallback} googleMessage={googleMessage} />;
}
