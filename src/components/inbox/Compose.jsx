import { Card, Button, InputGroup, FormControl, Dropdown, DropdownButton } from 'react-bootstrap';
import Parser from 'html-react-parser';
import { parse } from 'node-html-parser';
import { useState, useEffect } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';
import EmailValidator from 'email-validator';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ServerAuth } from '../../Auth';
import Spinner from '../container/Spinner';

export default function Compose({ email }) {
    const ticket = JSON.parse(localStorage.getItem('data'));
    const initialState = {
        subject: '',
        to: '',
        cc: '',
        bcc: '',
    };
    const [{ subject, to, cc, bcc }, setState] = useState(initialState);
    const [editor, setEditor] = useState(EditorState.createEmpty());
    const [search, setSearch] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [spin, setSpin] = useState(true);
    const [spin2, setSpin2] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setState((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleSend = () => {
        console.log('subject', subject);
        console.log('from', email);
        console.log('to', to);
        console.log('cc', cc);
        console.log('bcc', bcc);
        console.log('editor', editor);
        setSpin2(true);

        let arrayTo = [],
            arrayCc = [],
            arrayBcc = [];
        const parse_html = parse(
            draftToHtml(JSON.parse(JSON.stringify(convertToRaw(editor.getCurrentContent()))))
        ).toString();
        const parse_text = parse(
            draftToHtml(JSON.parse(JSON.stringify(convertToRaw(editor.getCurrentContent()))))
        ).textContent;
        if (to && to.indexOf(' ') !== -1) {
            let dummyArray = to.split(' ');
            dummyArray.forEach((element) => {
                element = element.trim();
                if (EmailValidator.validate(element)) arrayTo.push(element);
            });
        } else if (to && to.indexOf(',') !== -1) {
            let dummyArray = to.split(',');
            dummyArray.forEach((element) => {
                element = element.trim();
                if (EmailValidator.validate(element)) arrayTo.push(element);
            });
        } else if (to) {
            arrayTo.push(to.trim());
        }
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
                if (EmailValidator.validate(element)) arrayCc.push(element);
            });
        } else if (cc) {
            arrayCc.push(cc.trim());
        }
        if (bcc && bcc.indexOf(' ') !== -1) {
            let dummyArray = bcc.split(' ');
            dummyArray.forEach((element) => {
                element = element.trim();
                if (EmailValidator.validate(element)) arrayBcc.push(element);
            });
        } else if (bcc && bcc.indexOf(',') !== -1) {
            let dummyArray = bcc.split(',');
            dummyArray.forEach((element) => {
                element = element.trim();
                if (EmailValidator.validate(element)) arrayBcc.push(element);
            });
        } else if (bcc) {
            arrayBcc.push(bcc.trim());
        }
        axios
            .post('/api/inbox/send', {
                ...ticket,
                message: {
                    subject,
                    from: email,
                    to: arrayTo,
                    cc: arrayCc,
                    bcc: arrayBcc,
                    html: parse_html,
                    text: parse_text,
                },
            })
            .then((res) => {
                if (res.data.isSuccess === true) {
                    setState(initialState);
                    setEditor(EditorState.createEmpty());
                    setSearch('');
                    setSpin2(false);
                    toast.success(res.data.message, {
                        position: toast.POSITION.TOP_LEFT,
                        autoClose: 5000,
                    });
                } else if (res.data.isAuthenticated === false) {
                    <ServerAuth />;
                }
            })
            .catch((err) => {
                setSpin2(false);
                toast.error(err.response.data.message, {
                    position: toast.POSITION.TOP_LEFT,
                    autoClose: 5000,
                });
            });
    };

    useEffect(() => {
        axios
            .post('/api/inbox/search', { ...ticket, search })
            .then((res) => {
                if (res.data.isSuccess === true) {
                    console.log(res.data);
                    setSuggestions(res.data.suggestions);
                    setSpin(false);
                } else if (res.data.isAuthenticated === false) {
                    <ServerAuth />;
                }
            })
            .catch((err) => {
                setSuggestions([]);
                setSpin(false);
            });
    }, [search]);

    const handleClickSuggestion = (e, section, email) => {
        e.preventDefault();
        if (section === 'to') setState((prevState) => ({ ...prevState, to: to + ' ' + email }));
        if (section === 'cc') setState((prevState) => ({ ...prevState, cc: cc + ' ' + email }));
        if (section === 'bcc') setState((prevState) => ({ ...prevState, bcc: bcc + ' ' + email }));
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setSearch(e.target.value);
        setSpin(true);
    };
    if (spin2) return <Spinner />;
    return (
        <Card className="inbox-mail">
            <Card.Header>
                <div className="row">
                    <div className="col-11">
                        <h4>
                            <InputGroup size="sm" className="mb-3">
                                <InputGroup.Text id="inputGroup-sizing-sm">Subject:</InputGroup.Text>
                                <FormControl
                                    value={subject}
                                    name="subject"
                                    aria-label="Small"
                                    aria-describedby="inputGroup-sizing-sm"
                                    onChange={handleChange}
                                />
                            </InputGroup>
                        </h4>
                    </div>
                </div>
            </Card.Header>
            <Card.Body>
                <h6>
                    <div className="mb-3">From: {'<' + email + '>'}</div>
                    <InputGroup size="sm" className="mb-3">
                        <DropdownButton
                            variant="outline-secondary"
                            size="sm"
                            title="To"
                            id="input-group-dropdown-1"
                        >
                            <FormControl
                                value={search}
                                name="search"
                                aria-label="Small"
                                aria-describedby="inputGroup-sizing-sm"
                                onChange={handleSearch}
                            />
                            {spin ? (
                                <Spinner />
                            ) : suggestions.length !== 0 ? (
                                suggestions.map(({ name, email }, index) => {
                                    return (
                                        <Dropdown.Item
                                            key={index}
                                            onClick={(e) => handleClickSuggestion(e, 'to', email)}
                                        >
                                            {name} / {email}
                                        </Dropdown.Item>
                                    );
                                })
                            ) : (
                                ''
                            )}
                        </DropdownButton>
                        <FormControl
                            value={to}
                            name="to"
                            aria-label="Small"
                            aria-describedby="inputGroup-sizing-sm"
                            onChange={handleChange}
                        />
                    </InputGroup>
                    <InputGroup size="sm" className="mb-3">
                        <DropdownButton
                            variant="outline-secondary"
                            size="sm"
                            title="CC"
                            id="input-group-dropdown-1"
                        >
                            <FormControl
                                value={search}
                                name="search"
                                aria-label="Small"
                                aria-describedby="inputGroup-sizing-sm"
                                onChange={handleSearch}
                            />
                            {spin ? (
                                <Spinner />
                            ) : suggestions.length !== 0 ? (
                                suggestions.map(({ name, email }, index) => {
                                    return (
                                        <Dropdown.Item
                                            key={index}
                                            onClick={(e) => handleClickSuggestion(e, 'cc', email)}
                                        >
                                            {name} / {email}
                                        </Dropdown.Item>
                                    );
                                })
                            ) : (
                                ''
                            )}
                        </DropdownButton>
                        <FormControl
                            value={cc}
                            name="cc"
                            aria-label="Small"
                            aria-describedby="inputGroup-sizing-sm"
                            onChange={handleChange}
                        />
                    </InputGroup>
                    <InputGroup size="sm" className="mb-3">
                        <DropdownButton
                            variant="outline-secondary"
                            size="sm"
                            title="BCC"
                            id="input-group-dropdown-1"
                        >
                            <FormControl
                                value={search}
                                name="search"
                                aria-label="Small"
                                aria-describedby="inputGroup-sizing-sm"
                                onChange={handleSearch}
                            />
                            {spin ? (
                                <Spinner />
                            ) : suggestions.length !== 0 ? (
                                suggestions.map(({ name, email }, index) => {
                                    return (
                                        <Dropdown.Item
                                            key={index}
                                            onClick={(e) => handleClickSuggestion(e, 'bcc', email)}
                                        >
                                            {name} / {email}
                                        </Dropdown.Item>
                                    );
                                })
                            ) : (
                                ''
                            )}
                        </DropdownButton>
                        <FormControl
                            value={bcc}
                            name="bcc"
                            aria-label="Small"
                            aria-describedby="inputGroup-sizing-sm"
                            onChange={handleChange}
                        />
                    </InputGroup>
                </h6>
                <Editor
                    editorState={editor}
                    toolbarClassName="toolbarClassName"
                    wrapperClassName="wrapperClassName"
                    editorClassName="inbox-reply-editorClassName"
                    onEditorStateChange={(e) => setEditor(e)}
                />
                <Button variant="info" style={{ marginTop: '5px' }} onClick={handleSend}>
                    Send
                </Button>
            </Card.Body>
        </Card>
    );
}
