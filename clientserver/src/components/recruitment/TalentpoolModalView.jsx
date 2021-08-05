import { useState } from 'react';
import { Modal, Card, Nav } from 'react-bootstrap';
import moment from 'moment';

export default function TalentpoolModalView({ data_modal, show, hide }) {
    const onHide = () => {
        hide('hide');
    };
    const PersonalInfo = () => {
        if (data_modal['personal_info'].length === 0) return '';
        const { name, birthdate, home, email, contact } = data_modal['personal_info'];
        return (
            <Card>
                <Card.Header as="h5">Personal Info</Card.Header>
                <Card.Body>
                    <p>
                        <b>Name:</b> {name}
                    </p>
                    <p>
                        <b>Email:</b> {email}
                    </p>
                    <p>
                        <b>Contact:</b> {contact}
                    </p>
                    <p>
                        <b>Home:</b> {home}
                    </p>
                    <p>
                        <b>Birthdate:</b> {moment(birthdate).format('MMMM DD, YYYY')}
                    </p>
                </Card.Body>
            </Card>
        );
    };
    const WorkExperience = () => {
        if (data_modal['work_experience'].length === 0) return '';
        return (
            <Card>
                <Card.Header as="h5">Work Experience</Card.Header>
                {data_modal['work_experience'].map(
                    ({ job_title, company, address, time_period, description }) => {
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
                    }
                )}
            </Card>
        );
    };
    const Skills = () => {
        if (data_modal['skills'].length === 0) return '';
        return (
            <Card>
                <Card.Header as="h5">Skills</Card.Header>
                {data_modal['skills'].map(({ skill, years_of_experience }) => {
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
    const CertificationLicenses = () => {
        if (data_modal['certification_licenses'].length === 0) return '';
        return (
            <Card>
                <Card.Header as="h5">Certification / Licenses</Card.Header>
                {data_modal['certification_licenses'].map(({ title, time_period }) => {
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
    const AdditionalInformation = () => {
        if (data_modal['additional_information'] === '') return '';
        return (
            <Card>
                <Card.Header as="h5">Additional Information</Card.Header>
                <Card.Body>
                    <p>
                        <b>{data_modal['additional_information']}</b>
                    </p>
                </Card.Body>
            </Card>
        );
    };
    const File = () => {
        return (
            <Nav.Item>
                <Nav.Link href="/">Resume</Nav.Link>
            </Nav.Item>
        );
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
                <Skills />
                <CertificationLicenses />
                <AdditionalInformation />
            </Modal.Body>
        </Modal>
    );
}
