import { Card, Button, InputGroup, FormControl } from 'react-bootstrap';
import Parser from 'html-react-parser';
import { parse } from 'node-html-parser';
import { useState } from 'react';
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

export default function Mail({ data, email }) {
    const ticket = JSON.parse(localStorage.getItem('data'));
    const { _id, name, from, subject, body, date, to, cc, bcc } = data;
    let { text, html } = body;
    const [isReply, setReply] = useState(false);
    const [reply, setOnReply] = useState(undefined);
    const [editor, setEditor] = useState(EditorState.createEmpty());
    const [spinReply, setSpinReply] = useState(false);
    const [{ replyfrom, replyto, replycc, replybcc, replySubject }, setValueReply] = useState({
        replyfrom: email,
        replyto: from,
        replycc: [...cc],
        replybcc: [...bcc],
        replySubject: subject,
    });

    function SetParser() {
        try {
            if (html.indexOf('<html') !== -1) return Parser(text);
            else return Parser(html);
        } catch {
            return Parser(text);
        }
    }

    const handleReply = () => {
        setSpinReply(true);
        let array_replyto = [];
        let array_replycc = [];
        let array_replybcc = [];
        const parse_html = parse(
            draftToHtml(JSON.parse(JSON.stringify(convertToRaw(editor.getCurrentContent()))))
        ).toString();
        const parse_text = parse(
            draftToHtml(JSON.parse(JSON.stringify(convertToRaw(editor.getCurrentContent()))))
        ).textContent;
        if (replyto && replyto.indexOf(' ') !== -1) {
            const replyto_ = replyto.split(' ');
            replyto_.forEach((element) => {
                element = element.trim();
                if (EmailValidator.validate(element)) array_replyto.push(element);
            });
        } else if (replyto && replyto.indexOf(',') !== -1) {
            const replyto_ = replyto.split(',');
            replyto_.forEach((element) => {
                element = element.trim();
                if (EmailValidator.validate(element)) array_replyto.push(element);
            });
        } else if (replyto) {
            array_replyto.push(replyto);
        }
        if (replycc && replycc.indexOf(' ') !== -1) {
            const replycc_ = replycc.split(' ');
            replycc_.forEach((element) => {
                element = element.trim();
                if (EmailValidator.validate(element)) array_replycc.push(element);
            });
        } else if (replycc && replycc.indexOf(',') !== -1) {
            const replycc_ = replycc.split(',');
            replycc_.forEach((element) => {
                element = element.trim();
                if (EmailValidator.validate(element)) array_replycc.push(element);
            });
        } else if (replycc) {
            array_replycc.push(replycc);
        }
        if (replybcc && replybcc.indexOf(' ') !== -1) {
            const replybcc_ = replybcc.split(' ');
            replybcc_.forEach((element) => {
                element = element.trim();
                if (EmailValidator.validate(element)) array_replybcc.push(element);
            });
        } else if (replybcc && replybcc.indexOf(',') !== -1) {
            const replybcc_ = replybcc.split(',');
            replybcc_.forEach((element) => {
                element = element.trim();
                if (EmailValidator.validate(element)) array_replybcc.push(element);
            });
        } else if (replybcc) {
            array_replybcc.push(replybcc);
        }

        if (array_replyto.length >= 1) {
            axios
                .post('/api/inbox/reply', {
                    ...ticket,
                    message: {
                        to: array_replyto,
                        cc: array_replycc,
                        bcc: array_replybcc,
                        from: replyfrom,
                        message_id: _id,
                        text: parse_text,
                        html: parse_html,
                        subject: replySubject,
                    },
                })
                .then((res) => {
                    if (res.data.isSuccess === true) {
                        setReply(false);
                        setEditor(EditorState.createEmpty());
                        setSpinReply(false);
                        toast.success(res.data.message, {
                            position: toast.POSITION.TOP_LEFT,
                            autoClose: 5000,
                        });
                    } else if (res.data.isAuthenticated === false) {
                        <ServerAuth />;
                    }
                })
                .catch((err) => {
                    setReply(false);
                    setEditor(EditorState.createEmpty());
                    setSpinReply(false);
                    toast.error(err.response.data.message, {
                        position: toast.POSITION.TOP_LEFT,
                        autoClose: 5000,
                    });
                });
        }
    };

    const handleValueReply = (e) => {
        const { name, value } = e.target;
        setValueReply((prevState) => ({ ...prevState, [name]: value }));
    };
    if (spinReply) return <Spinner />;
    if (isReply) {
        return (
            <Card className="inbox-mail">
                <Card.Header>
                    <div className="row">
                        <div className="col-11">
                            <h4>{subject}</h4>
                        </div>
                        <div className="col">
                            <Button variant="dark" title="close" onClick={() => setReply(false)}>
                                <span>
                                    <i class="fas fa-times"></i>
                                </span>
                            </Button>
                        </div>
                    </div>
                </Card.Header>
                <Card.Body>
                    <h6>
                        <div className="mb-3">From: {'<' + replyfrom + '>'}</div>
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Text id="inputGroup-sizing-sm">To:</InputGroup.Text>
                            <FormControl
                                value={replyto}
                                name="replyto"
                                aria-label="Small"
                                aria-describedby="inputGroup-sizing-sm"
                                onChange={handleValueReply}
                            />
                        </InputGroup>
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Text id="inputGroup-sizing-sm">CC:</InputGroup.Text>
                            <FormControl
                                value={replycc}
                                name="replycc"
                                aria-label="Small"
                                aria-describedby="inputGroup-sizing-sm"
                                onChange={handleValueReply}
                            />
                        </InputGroup>
                        <InputGroup size="sm" className="mb-3">
                            <InputGroup.Text id="inputGroup-sizing-sm">BCC:</InputGroup.Text>
                            <FormControl
                                value={replybcc}
                                name="replybcc"
                                aria-label="Small"
                                aria-describedby="inputGroup-sizing-sm"
                                onChange={handleValueReply}
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
                    <Button variant="info" style={{ marginTop: '5px' }} onClick={handleReply}>
                        Send
                    </Button>
                </Card.Body>
            </Card>
        );
    }
    return (
        <Card className="inbox-mail">
            <Card.Header>
                <div className="row">
                    <div className="col-11">
                        <h4>{subject}</h4>
                    </div>
                    <div className="col">
                        <Button variant="dark" title="reply" onClick={() => setReply(true)}>
                            <span>
                                <i class="fas fa-reply"></i>
                            </span>
                        </Button>
                    </div>
                </div>
            </Card.Header>
            <Card.Body>
                <h6>
                    From: {name} {'<' + from + '>'} <br />
                    To: {[...to]} <br />
                    cc: {[...cc]} <br />
                    bcc: {[...bcc]} <br />
                </h6>
                <div className="inbox-mail-body">
                    <SetParser />
                </div>
            </Card.Body>
        </Card>
    );
}
