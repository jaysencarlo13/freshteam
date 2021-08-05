import React, { useState } from 'react';
import { Button, ButtonGroup, Modal, Card, Nav, ProgressBar, InputGroup } from 'react-bootstrap';
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

toast.configure();

export default function CandidatesTable({ data_candidates, callback }) {
    const ticket = JSON.parse(localStorage.getItem('data'));
    const initialState = {
        modalUpdate: false,
        modalRemove: false,
        candidate_id: undefined,
        applicant: undefined,
        modal_update_status: 'profile',
        selected_status: undefined,
        data_table: data_candidates,
    };
    const progress = [
        { label: 'Exam', num: 1 },
        { label: 'Interview', num: 2 },
        { label: 'Evaluation', num: 3 },
        { label: 'Job Offer', num: 4 },
        { label: 'Hired', num: 5 },
    ];

    const [
        { modalUpdate, candidate_id, show, applicant, modal_update_status, selected_status, data_table },
        setState,
    ] = useState(initialState);

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
        const { id, name, value, title } = data;
        const isUpdate = title === 'update' ? true : false;
        const isRemove = title === 'remove' ? true : false;
        setState((prevState) => ({
            ...prevState,
            candidate_id: id,
            modalUpdate: isUpdate,
        }));
        if (isUpdate) {
            axios
                .post('/api/recruitment/candidates/fetchinfo', { ...ticket, applicantId: name })
                .then((res) => {
                    if (res.data.isSuccess === true) {
                        setState((prevState) => ({
                            ...prevState,
                            applicant: { ...res.data.applicant, status: value, selected_status: value },
                        }));
                    } else if (res.data.isAuthenticated === false) {
                        <ServerAuth />;
                    }
                });
        }
        if (isRemove) {
            confirmAlert({
                customUI: ({ onClose }) => {
                    return (
                        <div className="custom-ui">
                            <h6>
                                Are you sure you want to remove <b>{name}</b>
                            </h6>
                            <hr />
                            <Button variant="info" onClick={() => onClose()}>
                                No
                            </Button>
                            <Button
                                variant="danger"
                                onClick={(e) => {
                                    handleRemove(e, id);
                                    onClose();
                                }}
                            >
                                Remove
                            </Button>
                        </div>
                    );
                },
            });
        }
    };

    const handleRemove = (e, id) => {
        e.preventDefault();
        axios
            .post('/api/recruitment/candidates/remove', { ...ticket, candidate_id: id })
            .then((res) => {
                if (res.data.isSuccess === true) {
                    toast.success(res.data.message, {
                        position: toast.POSITION.TOP_LEFT,
                        autoClose: 5000,
                    });
                    callback('reload_table');
                } else if (res.data.isAuthenticated === false) {
                    <ServerAuth />;
                }
            })
            .catch((err) => {
                toast.error(err.response.data.message, {
                    position: toast.POSITION.TOP_LEFT,
                    autoClose: 5000,
                });
                callback('reload_table');
            });
    };

    const onHide = () => {
        setState(initialState);
    };

    const formatButton = (cell, row) => {
        if (row.title) {
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
                                data: {
                                    name: row.name,
                                    id: row.candidate_id,
                                    title: 'remove',
                                },
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
                {info.map(({ job_title, company, address, time_period, description }) => {
                    const { currently_working, from, to } = time_period;
                    <Card.Body>
                        <p>
                            <b>Job Title:</b> {job_title}
                        </p>
                        <p>
                            <b>Company:</b> {company}
                        </p>
                        <p>
                            <b>Address:</b> {address}
                        </p>
                        <p>
                            <b>From:</b> {from}
                        </p>
                        <p>
                            <b>To:</b> {to}
                        </p>
                        <p>
                            <b>Currently Working?:</b> {currently_working ? 'true' : 'false'}
                        </p>
                        <p>
                            <b>Description:</b> {description}
                        </p>
                        <hr />
                    </Card.Body>;
                })}
            </Card>
        );
    };

    const Education = ({ info }) => {
        return (
            <Card>
                <Card.Header as="h5">Education</Card.Header>
                {info.map(({ education_level, field_study, school, location, time_period }) => {
                    const { currently_enrolled, from, to } = time_period;
                    <Card.Body>
                        <p>
                            <b>Education Level:</b> {education_level}
                        </p>
                        <p>
                            <b>Field Study:</b> {field_study}
                        </p>
                        <p>
                            <b>School:</b> {school}
                        </p>
                        <p>
                            <b>Location:</b> {location}
                        </p>
                        <p>
                            <b>From:</b> {from}
                        </p>
                        <p>
                            <b>To:</b> {to}
                        </p>
                        <p>
                            <b>Currently Enrolled?:</b> {currently_enrolled}
                        </p>
                        <hr />
                    </Card.Body>;
                })}
            </Card>
        );
    };

    const Skills = ({ info }) => {
        return (
            <Card>
                <Card.Header as="h5">Skills</Card.Header>
                {info.map(({ skill, years_of_experience }) => {
                    <Card.Body>
                        <p>
                            <b>Skill:</b> {skill}
                        </p>
                        <p>
                            <b>Years of Experience:</b> {years_of_experience}
                        </p>
                        <hr />
                    </Card.Body>;
                })}
            </Card>
        );
    };
    const CertificationLicenses = ({ info }) => {
        return (
            <Card>
                <Card.Header as="h5">Certification / Licenses</Card.Header>
                {info.map(({ title, time_period }) => {
                    const { does_expire, from, to } = time_period;
                    <Card.Body>
                        <p>
                            <b>Title:</b> {title}
                        </p>
                        <p>
                            <b>From:</b> {from}
                        </p>
                        <p>
                            <b>To:</b> {to}
                        </p>
                        <p>
                            <b>Does Expire?:</b> {does_expire ? 'true' : 'false'}
                        </p>
                        <hr />
                    </Card.Body>;
                })}
            </Card>
        );
    };
    const AdditionalInformation = ({ info }) => {
        return (
            <Card>
                <Card.Header as="h5">Additional Information</Card.Header>
                <Card.Body>
                    <p>
                        <b>{info}</b>
                    </p>
                </Card.Body>
            </Card>
        );
    };
    const File = ({ info }) => {
        return (
            <Nav.Item>
                <Nav.Link href="/">Resume</Nav.Link>
            </Nav.Item>
        );
    };
    const handleModalNav = (e) => {
        const { rbEventKey } = e.target.dataset;
        setState((prevState) => ({ ...prevState, modal_update_status: rbEventKey }));
    };

    const update = (e) => {
        if (selected_status === undefined)
            return toast.info('No changes', {
                position: toast.POSITION.TOP_LEFT,
                autoClose: 5000,
            });
        return axios
            .post('/api/recruitment/candidates/update', {
                ...ticket,
                status: selected_status,
                candidate_id: candidate_id,
            })
            .then((res) => {
                if (res.data.isSuccess === true) {
                    toast.success('Update Success', {
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
                                {applicant['applicant']['file'] ? <File /> : 'No attach file'}
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

                                <div className="col-md-5">
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
                                        <Button variant="outline-info" onClick={update}>
                                            Update
                                        </Button>
                                    </InputGroup>
                                </div>
                            </div>
                        ) : (
                            <Spinner />
                        )}
                    </Modal.Body>
                )}
            </Modal>
        </div>
    );
}
