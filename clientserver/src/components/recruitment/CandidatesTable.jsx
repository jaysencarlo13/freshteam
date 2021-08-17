import React, { useState, useEffect } from 'react';
import {
    Button,
    ButtonGroup,
    Modal,
    Card,
    Nav,
    ProgressBar,
    InputGroup,
    FormControl,
    Alert,
    DropdownButton,
    Dropdown,
} from 'react-bootstrap';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import axios from 'axios';
import { ServerAuth } from '../../Auth';
import Spinner from '../container/Spinner';
import moment from 'moment';
import './scrollable.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';
import EmailValidator from 'email-validator';
import { parse } from 'node-html-parser';
import { Accordion, AccordionSummary, AccordionDetails } from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
import download from 'downloadjs';
import { server } from '../config';
import ModalRemove from './CandidatesModalRemove';

toast.configure();

export default function CandidatesTable({ data_candidates, callback, messenger }) {
    const ticket = JSON.parse(localStorage.getItem('data'));
    const initialState = {
        spin: false,
        modalUpdate: false,
        modalRemove: false,
        candidate_id: undefined,
        applicant: undefined,
        modal_update_status: 'profile',
        selected_status: undefined,
        data_table: data_candidates,
        message_from: '',
        message_to: '',
        message_cc: '',
        message_subject: '',
        message_body: '',
        messenger_name: '',
        isGoogleSetup: false,
        search: '',
        suggestions: [],
        interview_date: moment().format('YYYY-MM-DD'),
        interview_time: moment('07:00', 'HH:mm').format('HH:mm'),
        interviewer: '',
        interviewer_id: '',
        spinFile: false,
        showModal_remove: false,
        modal_remove_data: undefined,
    };

    const progress = [
        { label: 'Exam', num: 1 },
        { label: 'Interview', num: 2 },
        { label: 'Evaluation', num: 3 },
        { label: 'Job Offer', num: 4 },
        { label: 'Hired', num: 5 },
    ];

    const [editor, setEditor] = useState(EditorState.createEmpty());

    const [
        {
            spin,
            spinFile,
            modalUpdate,
            candidate_id,
            show,
            applicant,
            modal_update_status,
            selected_status,
            data_table,
            message_from,
            message_to,
            message_cc,
            message_subject,
            message_body,
            messenger_name,
            isGoogleSetup,
            search,
            suggestions,
            interview_date,
            interview_time,
            interviewer,
            interviewer_id,
            showModal_remove,
            modal_remove_data,
        },
        setState,
    ] = useState(initialState);

    const handleSearch = (e) => {
        e.preventDefault();
        setState((prevState) => ({ ...prevState, search: e.target.value, spin: true }));
    };

    const onChange = ({ target }) => {
        const { selectedIndex } = target.options;
        const index = selectedIndex + 1;
        const status = progress.find((e) => e.num === index).label;
        setState((prevState) => ({
            ...prevState,
            selected_status: status,
        }));
    };

    const handleActions = (e, { data }) => {
        e.preventDefault();
        console.log(data);
        const { id, name, value, title, email } = data;
        const isUpdate = title === 'update' ? true : false;
        const isRemove = title === 'remove' ? true : false;
        setState((prevState) => ({
            ...prevState,
            candidate_id: id,
            modalUpdate: isUpdate,
            message_to: email,
        }));
        if (isUpdate) {
            axios
                .post('/api/recruitment/candidates/fetchinfo', { ...ticket, applicantId: name })
                .then((res) => {
                    if (res.data.isSuccess === true) {
                        setState((prevState) => ({
                            ...prevState,
                            applicant: {
                                ...res.data.applicant,
                                status: value,
                                selected_status: value,
                            },
                            messenger_name: res.data.name,
                            message_from: res.data.google_email,
                            isGoogleSetup: res.data.isGoogleSetup,
                        }));
                    } else if (res.data.isAuthenticated === false) {
                        <ServerAuth />;
                    }
                });
        }
        if (isRemove) {
            setState((prevState) => ({
                ...prevState,
                showModal_remove: true,
                modal_remove_data: { messenger, data },
            }));
        }
    };

    const onHide = () => {
        setState(initialState);
    };

    const formatButton = (cell, row) => {
        if (row.title) {
            console.log(row);
            return (
                <ButtonGroup aria-label="Basic example">
                    <Button
                        variant="info"
                        name={row.applicant_id}
                        id={row.candidate_id}
                        value={row.status}
                        title="update"
                        onClick={(e) =>
                            handleActions(e, {
                                data: {
                                    name: row.applicant_id,
                                    id: row.candidate_id,
                                    value: row.status,
                                    title: 'update',
                                    email: row.email,
                                },
                            })
                        }
                    >
                        Update
                    </Button>
                    <Button
                        variant="danger"
                        title="remove"
                        onClick={(e) =>
                            handleActions(e, {
                                data: { ...row, title: 'remove' },
                            })
                        }
                    >
                        Remove
                    </Button>
                </ButtonGroup>
            );
        }
    };
    const columns = [
        { dataField: 'name', text: 'Name' },
        { dataField: 'email', text: 'Email' },
        { dataField: 'contact', text: 'Contact' },
        { dataField: 'title', text: 'Title' },
        { dataField: 'status', text: 'Status' },
        { dataField: '', text: 'Actions', formatter: formatButton },
    ];

    const PersonalInfo = ({ user }) => {
        return (
            <Card>
                <Card.Header as="h5">Personal Info</Card.Header>
                <Card.Body>
                    <p>
                        <b>Name:</b> {user.name}
                    </p>
                    <p>
                        <b>Email:</b> {user.email}
                    </p>
                    <p>
                        <b>Contact:</b> {user.contact}
                    </p>
                    <p>
                        <b>Home:</b> {user.home}
                    </p>
                    <p>
                        <b>Birthdate:</b> {moment(user.birthdate).format('MMMM DD, YYYY')}
                    </p>
                </Card.Body>
            </Card>
        );
    };

    const WorkExperience = ({ info }) => {
        return (
            <Card>
                <Card.Header as="h5">Work Experience</Card.Header>
                <Card.Body>
                    {info.map(({ job_title, company, address, time_period, description }, index) => {
                        const { currently_working, from, to } = time_period;
                        return (
                            <Accordion key={index} className="mb-3">
                                <AccordionSummary expandIcon={<ExpandMore />}>{job_title}</AccordionSummary>
                                <AccordionDetails className="row">
                                    {[
                                        { value: company, label: 'Company' },
                                        { value: address, label: 'Address' },
                                        { value: description, label: 'Description' },
                                        {
                                            value: time_period.currently_working ? 'Yes' : 'No',
                                            label: 'Currently Working ?',
                                        },
                                        {
                                            value: moment(time_period.from).format('MMMM DD,YYYY'),
                                            label: 'From',
                                        },
                                        {
                                            value: time_period.currently_working
                                                ? ''
                                                : moment(time_period.to).format('MMMM DD,YYYY'),
                                            label: 'To',
                                        },
                                    ].map(({ value, label }, index) => {
                                        return (
                                            <InputGroup className="col-6 mb-3" key={index}>
                                                <InputGroup.Text id="basic-addon1">{label}</InputGroup.Text>
                                                <FormControl value={value} />
                                            </InputGroup>
                                        );
                                    })}
                                </AccordionDetails>
                            </Accordion>
                        );
                    })}
                </Card.Body>
            </Card>
        );
    };

    const Education = ({ info }) => {
        return (
            <Card>
                <Card.Header as="h5">Education</Card.Header>
                <Card.Body>
                    {info.map(({ education_level, field_study, school, location, time_period }, index) => {
                        return (
                            <Accordion key={index} className="mb-3">
                                <AccordionSummary expandIcon={<ExpandMore />}>
                                    {education_level}
                                </AccordionSummary>
                                <AccordionDetails className="row">
                                    {[
                                        { value: field_study, label: 'Field Study' },
                                        { value: school, label: 'School' },
                                        { value: location, label: 'Location' },
                                        {
                                            value: time_period.currently_enrolled ? 'Yes' : 'No',
                                            label: 'Currently Enrolled ?',
                                        },
                                        {
                                            value: moment(time_period.from).format('MMMM DD,YYYY'),
                                            label: 'From',
                                        },
                                        {
                                            value: time_period.currently_enrolled
                                                ? ''
                                                : moment(time_period.to).format('MMMM DD,YYYY'),
                                            label: 'To',
                                        },
                                    ].map(({ value, label }, index) => {
                                        return (
                                            <InputGroup className="col-6 mb-3" key={index}>
                                                <InputGroup.Text id="basic-addon1">{label}</InputGroup.Text>
                                                <FormControl value={value} />
                                            </InputGroup>
                                        );
                                    })}
                                </AccordionDetails>
                            </Accordion>
                        );
                    })}
                </Card.Body>
            </Card>
        );
    };

    const Skills = ({ info }) => {
        return (
            <Card>
                <Card.Header as="h5">Skills</Card.Header>
                <Card.Body>
                    {info.map(({ skill, years_of_experience }, index) => {
                        return (
                            <Accordion className="mb-3" key={index}>
                                <AccordionSummary expandIcon={<ExpandMore />}>{skill}</AccordionSummary>
                                <AccordionDetails className="row">
                                    <InputGroup className="mb-3">
                                        <InputGroup.Text>Years of Experience</InputGroup.Text>
                                        <FormControl value={years_of_experience} />
                                    </InputGroup>
                                </AccordionDetails>
                            </Accordion>
                        );
                    })}
                </Card.Body>
            </Card>
        );
    };
    const CertificationLicenses = ({ info }) => {
        return (
            <Card>
                <Card.Header as="h5">Certification / Licenses</Card.Header>
                <Card.Body>
                    {info.map(({ title, time_period }, index) => {
                        return (
                            <Accordion className="mb-3" key={index}>
                                <AccordionSummary expandIcon={<ExpandMore />}>{title}</AccordionSummary>
                                <AccordionDetails className="row">
                                    {[
                                        {
                                            value: time_period.does_expire ? 'Yes' : 'No',
                                            label: 'Does Expire ?',
                                        },
                                        {
                                            value: moment(time_period.from).format('MMMM DD,YYYY'),
                                            label: 'From',
                                        },
                                        {
                                            value: time_period.does_expire
                                                ? moment(time_period.to).format('MMMM DD,YYYY')
                                                : '',
                                            label: 'To',
                                        },
                                    ].map(({ value, label }, index) => {
                                        return (
                                            <InputGroup className="col-6 mb-3" key={index}>
                                                <InputGroup.Text>{label}</InputGroup.Text>
                                                <FormControl value={value} />
                                            </InputGroup>
                                        );
                                    })}
                                </AccordionDetails>
                            </Accordion>
                        );
                    })}
                </Card.Body>
            </Card>
        );
    };
    const AdditionalInformation = ({ info }) => {
        return (
            <Card>
                <Card.Header as="h5">Additional Information</Card.Header>
                <Card.Body className="row justify-content-center">
                    <InputGroup className="col-12 mb-3">
                        <FormControl as="textarea" rows={5} value={info} />
                    </InputGroup>
                </Card.Body>
            </Card>
        );
    };
    const File = ({ info }) => {
        console.log(info);
        return (
            <Nav.Item>
                {spinFile ? (
                    <Spinner />
                ) : (
                    <Nav.Link onClick={(e) => handleDownload(e, info)}>Download Resume</Nav.Link>
                )}
            </Nav.Item>
        );
    };
    const handleDownload = (e, file) => {
        setState((prevState) => ({ ...prevState, spinFile: true }));
        axios.get(server + '/api/file/' + file.id, { responseType: 'blob' }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', file.name);
            document.body.appendChild(link);
            link.click();
        });
        setState((prevState) => ({ ...prevState, spinFile: false }));
    };
    const handleModalNav = (e) => {
        const { rbEventKey } = e.target.dataset;
        setState((prevState) => ({ ...prevState, modal_update_status: rbEventKey }));
    };

    const update = (e) => {
        const parse_html = parse(
            draftToHtml(JSON.parse(JSON.stringify(convertToRaw(editor.getCurrentContent()))))
        ).toString();
        const parse_text = parse(
            draftToHtml(JSON.parse(JSON.stringify(convertToRaw(editor.getCurrentContent()))))
        ).textContent;
        if (selected_status === undefined)
            return toast.info('No changes', {
                position: toast.POSITION.TOP_LEFT,
                autoClose: 5000,
            });
        if (selected_status === 'Interview') {
            if (interview_date === '' || interview_time === '' || interviewer === '')
                return toast.error('Fill-up all interview such as date, time and interviewer', {
                    position: toast.POSITION.TOP_LEFT,
                    autoClose: 5000,
                });
        }
        if (message_subject === '')
            return toast.error('Please do fill-up subject', {
                position: toast.POSITION.TOP_LEFT,
                autoClose: 5000,
            });
        let arrayCc = [];
        if (message_cc && message_cc.indexOf(' ') !== -1) {
            let dummyArray = message_cc.split(' ');
            dummyArray.forEach((element) => {
                element = element.trim();
                if (EmailValidator.validate(element)) arrayCc.push(element);
            });
        } else if (message_cc && message_cc.indexOf(',') !== -1) {
            let dummyArray = message_cc.split(',');
            dummyArray.forEach((element) => {
                element = element.trim();
                if (EmailValidator.validate(element)) arrayCc.push(element);
            });
        } else if (message_cc) {
            arrayCc.push(message_cc.trim());
        }

        const message = {
            from: message_from,
            to: message_to,
            cc: arrayCc,
            subject: message_subject,
            body: message_body,
            text: parse_text,
            html: parse_html,
        };

        return axios
            .post('/api/recruitment/candidates/update', {
                ...ticket,
                status: selected_status,
                candidate_id: candidate_id,
                message,
                interview: { date: interview_date, time: interview_time, interviewer, interviewer_id },
            })
            .then((res) => {
                if (res.data.isSuccess === true) {
                    toast.success(res.data.message, {
                        position: toast.POSITION.TOP_LEFT,
                        autoClose: 5000,
                    });
                    onHide();
                    callback('reload_table');
                } else if (res.data.isAuthenticated === false) {
                    <ServerAuth />;
                }
            });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setState((prevState) => ({ ...prevState, [name]: value }));
    };

    useEffect(() => {
        axios
            .post('/api/inbox/search', { ...ticket, search })
            .then((res) => {
                if (res.data.isSuccess === true) {
                    setState((prevState) => ({
                        ...prevState,
                        spin: false,
                        suggestions: res.data.suggestions,
                    }));
                } else if (res.data.isAuthenticated === false) {
                    <ServerAuth />;
                }
            })
            .catch((err) => {
                setState((prevState) => ({
                    ...prevState,
                    spin: false,
                    suggestions: [],
                }));
            });
    }, [search]);

    const handleClickSuggestion = (e, email, id) => {
        setState((prevState) => ({ ...prevState, interviewer: email, interviewer_id: id }));
    };

    const handleClose_remove = () => {
        setState(initialState);
        callback('reload');
    };

    return (
        <div>
            <BootstrapTable
                striped
                keyField="name"
                data={data_table}
                columns={columns}
                pagination={paginationFactory({ showTotal: true })}
                wrapperClasses="candidates-table"
                filtersClasses="candidates-table"
                footerClasses="candidates-table"
            />
            <Modal
                show={modalUpdate}
                onHide={onHide}
                dialogClassName="modal-update"
                aria-labelledby="example-custom-modal-styling-title"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="example-custom-modal-styling-title">Update Applicant</Modal.Title>
                </Modal.Header>
                <Nav variant="tabs" defaultActiveKey={modal_update_status}>
                    <Nav.Item>
                        <Nav.Link eventKey="profile" onClick={handleModalNav}>
                            Profile
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="status" onClick={handleModalNav}>
                            Status
                        </Nav.Link>
                    </Nav.Item>
                </Nav>
                {modal_update_status === 'profile' ? (
                    <Modal.Body className="modal-body-candidate-update">
                        {applicant ? (
                            <div>
                                {applicant['applicant']['file'] ? (
                                    <File info={applicant['applicant']['file']} />
                                ) : (
                                    'No attach file'
                                )}
                                {applicant.isPersonalInfo ? (
                                    <PersonalInfo user={applicant['applicant']['personal_info']} />
                                ) : (
                                    ''
                                )}
                                {applicant.isWorkExperience ? (
                                    <WorkExperience info={applicant['applicant']['work_experience']} />
                                ) : (
                                    ''
                                )}
                                {applicant.isEducation ? (
                                    <Education info={applicant['applicant']['education']} />
                                ) : (
                                    ''
                                )}
                                {applicant.isSkills ? <Skills info={applicant['applicant']['skills']} /> : ''}
                                {applicant.isCertification ? (
                                    <CertificationLicenses
                                        info={applicant['applicant']['certification_licenses']}
                                    />
                                ) : (
                                    ''
                                )}
                                {applicant['applicant']['additional_information'] ? (
                                    <AdditionalInformation
                                        info={applicant['applicant']['additional_information']}
                                    />
                                ) : (
                                    ''
                                )}
                            </div>
                        ) : (
                            <Spinner />
                        )}
                    </Modal.Body>
                ) : (
                    <Modal.Body className="modal-body-candidate-update">
                        {applicant ? (
                            <div>
                                <ProgressBar className="modal-body-status-candidate-update">
                                    {progress.map(({ label, num }, index, obj) => {
                                        if (applicant['status'] === 'Hired' && label === 'Hired')
                                            return (
                                                <ProgressBar
                                                    striped
                                                    variant="success"
                                                    now={20}
                                                    label={label}
                                                    key={index}
                                                />
                                            );
                                        if (num >= obj.find((e) => e.label === applicant['status']).num)
                                            return (
                                                <ProgressBar
                                                    key={index}
                                                    variant="danger"
                                                    now={20}
                                                    label={label}
                                                />
                                            );
                                        return (
                                            <ProgressBar
                                                striped
                                                variant="success"
                                                now={20}
                                                label={label}
                                                key={index}
                                            />
                                        );
                                    })}
                                </ProgressBar>

                                <div className="col-md-5 mb-3">
                                    <InputGroup className="mb-3" style={{ marginTop: '10px' }}>
                                        <select
                                            className="form-select"
                                            defaultValue={applicant.status}
                                            onChange={onChange}
                                        >
                                            {progress.map(({ label, num }, index) => {
                                                return (
                                                    <option key={index} value={label}>
                                                        {label}
                                                    </option>
                                                );
                                            })}
                                        </select>
                                        <Button
                                            variant="outline-info"
                                            onClick={update}
                                            disabled={!isGoogleSetup}
                                        >
                                            Update
                                        </Button>
                                    </InputGroup>
                                </div>

                                {!isGoogleSetup ? (
                                    <Alert variant="danger" className="col mb-2">
                                        You weren't able to send an email because you haven't setup your
                                        google account. Please click this link to setup your google account.
                                        <a href="/inbox">Setup Link</a>
                                    </Alert>
                                ) : (
                                    <div className="col">
                                        {selected_status === 'Interview' ? (
                                            <div className="row">
                                                <Alert variant="info" className="col-12 mb-2">
                                                    Input schedule(CST timezone. UTC-06:00) and interviewer
                                                </Alert>
                                                <InputGroup size="sm" className="col-6 mb-3">
                                                    <InputGroup.Text>Date:</InputGroup.Text>
                                                    <FormControl
                                                        name="interview_date"
                                                        value={interview_date}
                                                        onChange={handleChange}
                                                        type="date"
                                                    />
                                                </InputGroup>
                                                <InputGroup size="sm" className="col-6 mb-3">
                                                    <InputGroup.Text>Time:</InputGroup.Text>
                                                    <FormControl
                                                        name="interview_time"
                                                        value={interview_time}
                                                        onChange={handleChange}
                                                        type="time"
                                                    />
                                                </InputGroup>
                                                <InputGroup size="sm" className="col-6 mb-3">
                                                    <DropdownButton
                                                        variant="outline-secondary"
                                                        size="sm"
                                                        title="Interviewer"
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
                                                            suggestions.map(({ _id, name, email }, index) => {
                                                                return (
                                                                    <Dropdown.Item
                                                                        key={index}
                                                                        onClick={(e) =>
                                                                            handleClickSuggestion(
                                                                                e,
                                                                                email,
                                                                                _id
                                                                            )
                                                                        }
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
                                                        name="interviewer"
                                                        value={interviewer}
                                                        onChange={handleChange}
                                                        type="text"
                                                        readOnly={true}
                                                    />
                                                </InputGroup>
                                            </div>
                                        ) : (
                                            ''
                                        )}
                                        <Alert variant="warning">
                                            Upon clicking update it will send below email. Check and fill-out
                                            below email before clicking update button.
                                        </Alert>
                                        <div className="mb-3">From: {'<' + message_from + '>'}</div>
                                        <InputGroup size="sm" className="col-7 mb-3">
                                            <InputGroup.Text>Subject:</InputGroup.Text>
                                            <FormControl
                                                name="message_subject"
                                                value={message_subject}
                                                onChange={handleChange}
                                            />
                                        </InputGroup>
                                        <InputGroup size="sm" className="col-7 mb-3">
                                            <InputGroup.Text>TO:</InputGroup.Text>
                                            <FormControl value={message_to} />
                                        </InputGroup>
                                        <InputGroup size="sm" className="col-7 mb-3">
                                            <InputGroup.Text id="inputGroup-sizing-sm">CC:</InputGroup.Text>
                                            <FormControl
                                                name="message_cc"
                                                value={message_cc}
                                                onChange={handleChange}
                                            />
                                        </InputGroup>
                                        <Editor
                                            editorState={editor}
                                            toolbarClassName="toolbarClassName"
                                            wrapperClassName="wrapperClassName"
                                            editorClassName="inbox-reply-editorClassName"
                                            onEditorStateChange={(e) => setEditor(e)}
                                        />
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Spinner />
                        )}
                    </Modal.Body>
                )}
            </Modal>

            {modal_remove_data ? (
                <ModalRemove close={handleClose_remove} show={showModal_remove} data={modal_remove_data} />
            ) : (
                ''
            )}
        </div>
    );
}
