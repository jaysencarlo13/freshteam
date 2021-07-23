import Contents from '../container/Contents';
import queryString from 'query-string';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { ServerAuth } from '../../Auth';
import './jobpost.css';
import { InputGroup, FormControl, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';
import Parser from 'html-react-parser';

toast.configure({
    closeOnClick: true,
});

export default function JobPost() {
    let { postid } = queryString.parse(window.location.search);
    const ticket = JSON.parse(localStorage.getItem('data'));

    const initial_state = {
        data: undefined,
        titleEdit: false,
        title: undefined,
        titleUpdate: false,
        rangeEdit: false,
        range: undefined,
        rangeUpdate: false,
        typeEdit: false,
        type: undefined,
        typeUpdate: false,
        created_by: undefined,
        editorEdit: false,
        editor: undefined,
        editorUpdate: false,
    };

    const [
        {
            data,
            titleEdit,
            title,
            titleUpdate,
            rangeEdit,
            range,
            rangeUpdate,
            typeEdit,
            type,
            typeUpdate,
            created_by,
            editorEdit,
            editor,
            editorUpdate,
        },
        setState,
    ] = useState(initial_state);

    useEffect(() => {
        axios
            .post('/api/jobpost/view', { ...ticket, post_id: postid })
            .then((res) => {
                if (res.data.isSuccess === true) {
                    const data = res.data.job_post;
                    const { title, range, type, created_by, editor } = data;
                    console.log('useEffect success');
                    setState((prevState) => ({
                        ...prevState,
                        data: res.data.job_post,
                        title: title,
                        range,
                        type,
                        created_by,
                        editor: EditorState.createWithContent(convertFromRaw(JSON.parse(editor))),
                    }));
                } else if (res.data.isAuthenticated === false) {
                    <ServerAuth />;
                } else if (res.data.isSuccess === false) {
                    console.log(res);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }, [titleUpdate, rangeUpdate, typeUpdate, editorUpdate]);

    const onChange = (e) => {
        const { name, value } = e.target;
        setState((prevState) => ({ ...prevState, [name]: value }));
    };

    const update = (name, value, nameUpdate, update, nameEdit) => {
        axios
            .post('/api/jobpost/update', { ...ticket, ...data, [name]: value })
            .then((res) => {
                if (res.data && res.data.isSuccess === true) {
                    setState((prevState) => ({
                        ...prevState,
                        [nameUpdate]: !update,
                        [nameEdit]: false,
                    }));
                    toast.success(res.data.message, {
                        position: toast.POSITION.TOP_LEFT,
                        autoClose: 10000,
                    });
                } else if (res.data.isAuthenticated === false) {
                    <ServerAuth />;
                } else if (res.data.isSuccess === false) {
                    setState((prevState) => ({
                        ...prevState,
                        [nameUpdate]: !update,
                        [nameEdit]: false,
                    }));

                    toast.error(res.data.message, {
                        position: toast.POSITION.TOP_LEFT,
                        autoClose: 10000,
                    });
                }
            })
            .catch((err) => {
                setState((prevState) => ({
                    ...prevState,
                    [nameUpdate]: !update,
                    [nameEdit]: false,
                }));
                toast.error(err.response.data.message, {
                    position: toast.POSITION.TOP_LEFT,
                    autoClose: 10000,
                });
            });
    };

    const clickTitle = () => {
        setState((prevState) => ({ ...prevState, titleEdit: true }));
    };

    const cancelTitle = () => {
        setState((prevState) => ({ ...prevState, titleEdit: false, title: data.title }));
    };

    const updateTitle = () => {
        update('title', title, 'titleUpdate', titleUpdate, 'titleEdit');
    };

    const clickRange = () => {
        setState((prevState) => ({ ...prevState, rangeEdit: true }));
    };

    const cancelRange = () => {
        setState((prevState) => ({ ...prevState, rangeEdit: false, range: data.range }));
    };

    const updateRange = () => {
        update('range', range, 'rangeUpdate', rangeUpdate, 'rangeEdit');
    };

    const clickType = () => {
        setState((prevState) => ({ ...prevState, typeEdit: true }));
    };

    const cancelType = () => {
        setState((prevState) => ({ ...prevState, typeEdit: false, type: data.type }));
    };

    const updateType = () => {
        update('type', type, 'typeUpdate', typeUpdate, 'typeEdit');
    };

    const clickEditor = () => {
        setState((prevState) => ({ ...prevState, editorEdit: true }));
    };

    const cancelEditor = () => {
        setState((prevState) => ({
            ...prevState,
            editorEdit: false,
            editor: EditorState.createWithContent(convertFromRaw(JSON.parse(data.editor))),
        }));
    };

    const updateEditor = () => {
        update(
            'editor',
            JSON.stringify(convertToRaw(editor.getCurrentContent())),
            'editorUpdate',
            editorUpdate,
            'editorEdit'
        );
    };

    const onEditorStateChange = (editorState) => {
        setState((prevState) => ({ ...prevState, editor: editorState }));
    };

    if (data)
        return (
            <Contents>
                <div className="row justify-content-md-center jobpost-row">
                    <div className="jobpost col-md-8 ">
                        <div className="col-md-12">
                            {titleEdit ? (
                                <InputGroup>
                                    <FormControl
                                        placeholder="Job Title"
                                        name="title"
                                        value={title}
                                        onChange={onChange}
                                    />
                                    <Button variant="outline-danger" onClick={cancelTitle}>
                                        Cancel
                                    </Button>
                                    <Button variant="outline-info" onClick={updateTitle}>
                                        Update
                                    </Button>
                                </InputGroup>
                            ) : (
                                <div
                                    className="row justify-content-md-center jobpost-title"
                                    role="button"
                                    onClick={clickTitle}
                                >
                                    <div className="col-md-9">
                                        <h1>{data.title}</h1>
                                    </div>

                                    <div className="col-md-3 jobpost-title-editicon">
                                        <span>
                                            <i className="fas fa-edit" style={{ fontSize: '1.8rem' }}></i>
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="col-md-12">
                            {rangeEdit ? (
                                <div className="row">
                                    <div className="col-md-12 jobpost-range-editmode">
                                        <div className="row">
                                            <div className="col-md-4">
                                                <span>Salary Range:</span>
                                            </div>
                                            <div className="col-md-8">
                                                <InputGroup>
                                                    <FormControl
                                                        name="range"
                                                        value={range}
                                                        aria-label="Recipient's username with two button addons"
                                                        onChange={onChange}
                                                    />
                                                    <Button variant="outline-danger" onClick={cancelRange}>
                                                        Cancel
                                                    </Button>
                                                    <Button variant="outline-info" onClick={updateRange}>
                                                        Update
                                                    </Button>
                                                </InputGroup>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="row jobpost-range" role="button" onClick={clickRange}>
                                    <div className="col-md-10">
                                        <div className="row">
                                            <div className="col-md-4">
                                                <span>Salary Range:</span>
                                            </div>
                                            <div className="col-md-8">
                                                <p>{range}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-2 jobpost-range-editicon">
                                        <span>
                                            <i className="fas fa-edit" style={{ fontSize: '1.8rem' }}></i>
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="col-md-12">
                            {typeEdit ? (
                                <div className="row jobpost-type-editmode">
                                    <div className="col-md-12">
                                        <div className="row">
                                            <div className="col-md-4">
                                                <span>Employee Type:</span>
                                            </div>
                                            <div className="col-md-8">
                                                <InputGroup>
                                                    <FormControl
                                                        as="select"
                                                        name="type"
                                                        value={type}
                                                        onChange={onChange}
                                                    >
                                                        <option value="Regular or Permanent">
                                                            Regular or Permanent
                                                        </option>
                                                        <option value="Term or Fixed">Term or Fixed</option>
                                                        <option value="Project">Project</option>
                                                        <option value="Seasonal">Seasonal</option>
                                                        <option value="Casual">Casual</option>
                                                    </FormControl>
                                                    <Button variant="outline-danger" onClick={cancelType}>
                                                        Cancel
                                                    </Button>
                                                    <Button variant="outline-info" onClick={updateType}>
                                                        Update
                                                    </Button>
                                                </InputGroup>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="row jobpost-type" role="button" onClick={clickType}>
                                    <div className="col-md-10">
                                        <div className="row">
                                            <div className="col-md-4">
                                                <span>Employee Type:</span>
                                            </div>
                                            <div className="col-md-8">
                                                <p>{type}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-2 jobpost-type-editicon">
                                        <span>
                                            <i className="fas fa-edit" style={{ fontSize: '1.8rem' }}></i>
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="col-md-12">
                            <div className="row jobpost-created-by">
                                <div className="col-md-10">
                                    <div className="row">
                                        <div className="col-md-4">
                                            <span>Posted By:</span>
                                        </div>
                                        <div className="col-md-8">
                                            <p>{created_by}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-2 jobpost-type-editicon">
                                    <span>
                                        <i className="fas fa-edit" style={{ fontSize: '1.8rem' }}></i>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-12">
                            {editorEdit ? (
                                <div>
                                    <InputGroup>
                                        <Button variant="outline-danger" onClick={cancelEditor}>
                                            Cancel
                                        </Button>
                                        <Button variant="outline-info" onClick={updateEditor}>
                                            Update
                                        </Button>
                                    </InputGroup>
                                    <Editor
                                        editorState={editor}
                                        toolbarClassName="toolbarClassName"
                                        wrapperClassName="wrapperClassName"
                                        editorClassName="editorClassName"
                                        onEditorStateChange={onEditorStateChange}
                                    />
                                </div>
                            ) : (
                                <div className="row jobpost-editor" role="button" onClick={clickEditor}>
                                    <div className="col-md-11">
                                        {Parser(
                                            draftToHtml(
                                                JSON.parse(
                                                    JSON.stringify(convertToRaw(editor.getCurrentContent()))
                                                )
                                            )
                                        )}
                                    </div>
                                    <div className="col-md-2 jobpost-editor-editicon">
                                        <span>
                                            <i className="fas fa-edit" style={{ fontSize: '1.8rem' }}></i>
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </Contents>
        );
    else return '';
}
