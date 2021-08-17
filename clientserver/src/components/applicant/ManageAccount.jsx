import { useEffect, useState } from 'react';
import Nav from './Nav';
import axios from 'axios';
import Spinner from '../container/Spinner';
import { ServerAuth } from '../../Auth';
import { Card, InputGroup, FormControl, Button } from 'react-bootstrap';
import './manageaccount.css';
import moment from 'moment';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PersonalInfo from './PersonalInfo';
import WorkExperience from './WorkExperience';
import Education from './Education';
import Skills from './Skills';
import CertLicence from './CertificationLicenses';
import AddInfo from './AddInfo';
import File from './File';

export default function ManageAccount() {
    const ticket = JSON.parse(localStorage.getItem('data'));
    const initialState = {
        spin: true,
        spin2: false,
        applicant: undefined,
        update: false,
    };
    const [{ spin, spin2, applicant, update }, setState] = useState(initialState);
    useEffect(() => {
        axios
            .post('/api/applicant', { ...ticket })
            .then((res) => {
                if (res.data.isSuccess === true) {
                    const { applicant } = res.data;
                    setState((prevState) => ({ ...prevState, applicant, spin: false }));
                } else if (res.data.isAuthenticated === false) {
                    <ServerAuth />;
                }
            })
            .catch((err) => {});
    }, [update]);

    const handleReload = () => {
        setState((prevState) => ({ ...prevState, update: !update, spin: true }));
    };

    if (!spin)
        return (
            <div>
                <Nav name={applicant['personal_info']['name']} />
                <div className="row  applicant-manageaccount-wrapper">
                    <div className="col-md-10">
                        {spin2 ? (
                            <Spinner />
                        ) : (
                            <div>
                                <File file_={applicant['file']} callback={handleReload} />
                                <PersonalInfo
                                    personal_info={applicant['personal_info']}
                                    callback={handleReload}
                                />
                                <WorkExperience
                                    work_experience={applicant['work_experience']}
                                    callback={handleReload}
                                />
                                <Education education={applicant['education']} callback={handleReload} />
                                <Skills skills={applicant['skills']} callback={handleReload} />
                                <CertLicence
                                    certification_licenses={applicant['certification_licenses']}
                                    callback={handleReload}
                                />
                                <AddInfo
                                    additional_information={applicant['additional_information']}
                                    callback={handleReload}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    return <Spinner />;
}
