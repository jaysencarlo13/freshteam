import { useState } from 'react';
import { Modal, Button, InputGroup, FormControl, Alert } from 'react-bootstrap';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';
import Spinner from '../container/Spinner';
import axios from 'axios';
import { ServerAuth } from '../../Auth';
import EmailValidator from 'email-validator';
import { parse } from 'node-html-parser';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Google from '../inbox/Google';

export default function TalentpoolModalRemove({ close, show, data }) {
    const ticket = JSON.parse(localStorage.getItem('data'));

    const initialState = {
        spin: false,
        name: data.personal_info.name,
        from: data.messenger.email,
        subject: '',
        to: data.personal_info.email,
        cc: '',
        isGoogleSetup: data.messenger.isGoogleSetup,
        responseCode: undefined,
        googleMessage: undefined,
    };

    const [{ spin, name, from, subject, to, cc, isGoogleSetup, responseCode, googleMessage }, setState] =
        useState(initialState);
    const [editor, setEditor] = useState(EditorState.createEmpty());

    const handleClose = () => {
        setState(initialState);
        close('close');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setState((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleRemove = (e) => {
        setState((prevState) => ({ ...prevState, spin: true }));
        const parse_html = parse(
            draftToHtml(JSON.parse(JSON.stringify(convertToRaw(editor.getCurrentContent()))))
        ).toString();
        const parse_text = parse(
            draftToHtml(JSON.parse(JSON.stringify(convertToRaw(editor.getCurrentContent()))))
        ).textContent;

        if (subject === '')
            return toast.error('Please do fill-up subject', {
                position: toast.POSITION.TOP_LEFT,
                autoClose: 5000,
            });
        let arrayCc = [];
        if (cc && cc.indexOf(' ') !== -1) {
            let dummyArray = cc.split(' ');
            dummyArray.forEach((element) => {
                element = element.trim();
                if (EmailValidator.validate(element)) arrayCc.push(element);
            });
        } else if (cc && cc.indexOf(',') !== -1) {
            let dummyArray = cc.split(',');
            dummyArray.forEach((element) => {
                element = element.trim();
                if (EmailValidator.validate(element)) cc.push(element);
            });
        } else if (cc) {
            arrayCc.push(cc.trim());
        }
        axios
            .post('/api/recruitment/talentpool/remove', {
                ...ticket,
                talentpool: data,
                message: { html: parse_html, text: parse_text, from, subject, to, cc: arrayCc },
            })
            .then((res) => {
                if (res.data.isSuccess === true) {
                    toast.success(res.data.message, {
                        position: toast.POSITION.TOP_LEFT,
                        autoClose: 3000,
                    });
                    handleClose();
                } else if (res.data.isAuthenticated === false) {
                    <ServerAuth />;
                }
            })
            .catch((err) => {
                if (err.response.data.responseCode === 535) {
                    const { responseCode, message } = err.response.data;
                    setState((prevState) => ({
                        ...prevState,
                        responseCode,
                        googleMessage: message,
                        spin: false,
                    }));
                } else {
                    toast.error(err.response.data.message, {
                        position: toast.POSITION.TOP_LEFT,
                        autoClose: 3000,
                    });
                    handleClose();
                }
            });
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{name}</Modal.Title>
                {isGoogleSetup ? (
                    <Button variant="danger" onClick={handleRemove}>
                        Send and Remove
                    </Button>
                ) : (
                    ''
                )}
            </Modal.Header>
            {isGoogleSetup ? (
                spin ? (
                    <Spinner />
                ) : responseCode !== 535 ? (
                    <Modal.Body>
                        <Alert variant="warning">
                            Upon clicking{' '}
                            <strong>
                                <em>Send and Remove</em>
                            </strong>{' '}
                            it will send below email. Check and fill-out below email before pressing that
                            button.
                        </Alert>
                        <div className="mb-3">From: {'<' + from + '>'}</div>
                        {[
                            { label: 'SUBJECT', name: 'subject', value: subject },
                            { label: 'TO', value: to },
                            { label: 'CC', name: 'cc', value: cc },
                        ].map(({ label, name, value }, index) => {
                            return (
                                <InputGroup size="sm" className="col-7 mb-3" key={index}>
                                    <InputGroup.Text>{label}</InputGroup.Text>
                                    <FormControl name={name} value={value} onChange={handleChange} />
                                </InputGroup>
                            );
                        })}
                        <Editor
                            editorState={editor}
                            toolbarClassName="toolbarClassName"
                            wrapperClassName="wrapperClassName"
                            editorClassName="inbox-reply-editorClassName"
                            onEditorStateChange={(e) => setEditor(e)}
                        />
                    </Modal.Body>
                ) : (
                    <Modal.Body>
                        <Google callback={handleRemove} googleMessage={googleMessage} modal={true} />
                    </Modal.Body>
                )
            ) : (
                <Modal.Body>
                    <Alert variant="danger">
                        You are not able to send a message to the applicant. Your Google account is not yet
                        setup. Please go to inbox first <a href="/inbox">Setup Google Account</a>
                    </Alert>
                </Modal.Body>
            )}
        </Modal>
    );
}
