import { useState } from 'react';
import { Modal, Card, Nav, InputGroup, FormControl, Alert } from 'react-bootstrap';
import moment from 'moment';
import { Accordion, AccordionSummary, AccordionDetails } from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
import Spinner from '../container/Spinner';
import download from 'downloadjs';
import { server } from '../config';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function TalentpoolModalView({ data_modal, show, hide }) {
    const [spin, setSpin] = useState(false);

    const onHide = () => {
        hide('hide');
    };
    const PersonalInfo = () => {
        if (data_modal['personal_info'].length === 0) return '';
        const { name, birthdate, home, email, contact } = data_modal['personal_info'];
        return (
            <Card>
                <Card.Header as="h5">Personal Info</Card.Header>
                <Card.Body className="row">
                    {[
                        { value: name, label: 'Name' },
                        { value: email, label: 'Email' },
                        { value: contact, label: 'Contact' },
                        { value: home, label: 'Home' },
                        { value: moment(birthdate).format('MMMM DD, YYYY'), label: 'Birthdate' },
                    ].map(({ value, label }, index) => {
                        return (
                            <InputGroup className="col-6 mb-3" key={index}>
                                <InputGroup.Text>{label}</InputGroup.Text>
                                <FormControl value={value} />
                            </InputGroup>
                        );
                    })}
                </Card.Body>
            </Card>
        );
    };
    const WorkExperience = () => {
        if (data_modal['work_experience'].length === 0) return '';
        return (
            <Card>
                <Card.Header as="h5">Work Experience</Card.Header>
                <Card.Body>
                    {data_modal['work_experience'].map(
                        ({ job_title, company, address, time_period, description }) => {
                            const { currently_working, from, to } = time_period;
                            return (
                                <Accordion className="mb-3">
                                    <AccordionSummary expandIcon={<ExpandMore />}>
                                        {job_title}
                                    </AccordionSummary>
                                    <AccordionDetails className="row">
                                        {[
                                            { value: company, label: 'Company' },
                                            { value: address, label: 'Address' },
                                            { value: description, label: 'Description' },
                                            {
                                                value: currently_working ? 'Yes' : 'No',
                                                label: 'Currently Working ?',
                                            },
                                            { value: moment(from).format('MMMM DD,YYYY'), label: 'From' },
                                            {
                                                value: currently_working
                                                    ? ''
                                                    : moment(to).format('MMMM DD,YYYY'),
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
                        }
                    )}
                </Card.Body>
                ;
            </Card>
        );
    };
    const Education = () => {
        if (data_modal['education'].length === 0) return '';
        return (
            <Card>
                <Card.Header as="h5">Education</Card.Header>
                <Card.Body>
                    {data_modal['education'].map(
                        ({ education_level, field_study, school, location, time_period }, index) => {
                            const { currently_enrolled, from, to } = time_period;
                            return (
                                <Accordion className="mb-3" key={index}>
                                    <AccordionSummary expandIcon={<ExpandMore />}>
                                        {education_level}
                                    </AccordionSummary>
                                    <AccordionDetails className="row">
                                        {[
                                            { value: field_study, label: 'Field Study' },
                                            { value: school, label: 'School' },
                                            { value: location, label: 'Location' },
                                            {
                                                value: currently_enrolled ? 'Yes' : 'No',
                                                label: 'Currently Enrolled ?',
                                            },
                                            { value: moment(from).format('MMMM DD,YYYY'), label: 'From' },
                                            {
                                                value: currently_enrolled
                                                    ? ''
                                                    : moment(to).format('MMMM DD,YYYY'),
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
                        }
                    )}
                </Card.Body>
                ;
            </Card>
        );
    };
    const Skills = () => {
        if (data_modal['skills'].length === 0) return '';
        return (
            <Card>
                <Card.Header as="h5">Skills</Card.Header>
                <Card.Body>
                    {data_modal['skills'].map(({ skill, years_of_experience }, index) => {
                        return (
                            <Accordion className="mb-3" key={index}>
                                <AccordionSummary expandIcon={<ExpandMore />}>{skill}</AccordionSummary>
                                <AccordionDetails>
                                    <InputGroup className="col-6 mb-3">
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
    const CertificationLicenses = () => {
        if (data_modal['certification_licenses'].length === 0) return '';
        return (
            <Card>
                <Card.Header as="h5">Certification / Licenses</Card.Header>
                <Card.Body>
                    {data_modal['certification_licenses'].map(({ title, time_period }, index) => {
                        const { does_expire, from, to } = time_period;
                        return (
                            <Accordion key={index} className="mb-3">
                                <AccordionSummary expandIcon={<ExpandMore />}>{title}</AccordionSummary>
                                <AccordionDetails className="row">
                                    {[
                                        { value: does_expire ? 'Yes' : 'No', label: 'Does Expire' },
                                        { value: moment(from).format('MMMM DD,YYYY'), label: 'From' },
                                        {
                                            value: does_expire ? moment(to).format('MMMM DD,YYYY') : '',
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
    const AdditionalInformation = () => {
        if (data_modal['additional_information'] === '') return '';
        return (
            <Card>
                <Card.Header as="h5">Additional Information</Card.Header>
                <Card.Body className="row justify-content-center">
                    <InputGroup className="col-12 mb-3">
                        <FormControl as="textarea" rows={5} value={data_modal['additional_information']} />
                    </InputGroup>
                </Card.Body>
            </Card>
        );
    };
    const File = () => {
        if (spin) return <Spinner />;
        if (data_modal['file'].id === '') return <Alert variant="danger">No File/Resume Uploaded</Alert>;
        return (
            <Nav.Item>
                <Nav.Link onClick={(e) => handleDownload(e, data_modal['file'])}>Resume</Nav.Link>
            </Nav.Item>
        );
    };

    const handleDownload = (e, file) => {
        setSpin(true);
        axios
            .get(server + '/api/file/' + file.id, { responseType: 'blob' })
            .then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', file.name);
                document.body.appendChild(link);
                link.click();
                setSpin(false);
            })
            .catch((err) => {
                toast.error(err.response.data.message, {
                    position: toast.POSITION.TOP_LEFT,
                    autoClose: 3000,
                });
                setSpin(false);
            });
    };

    return (
        <Modal show={show} onHide={onHide} animation={false}>
            <Modal.Header closeButton>
                <Modal.Title>{data_modal ? data_modal['personal_info']['name'] : ''}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="talentpool-modalbody-view">
                <File />
                <PersonalInfo />
                <WorkExperience />
                <Education />
                <Skills />
                <CertificationLicenses />
                <AdditionalInformation />
            </Modal.Body>
        </Modal>
    );
}
