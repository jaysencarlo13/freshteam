import { Redirect } from 'react-router-dom';

function CheckRole() {
    const data = JSON.parse(localStorage.getItem('data'));
    if (!data) return <Redirect to="/homepage" />;
    const { _id, usertype } = data.user;
    if (usertype !== 'applicant') {
        return '';
    } else if (usertype === 'applicant') {
        return <Redirect to="/applicant/homepage" />;
    } else {
        localStorage.clear();
        return <Redirect to="/homepage" />;
    }
}

function ApplicantOnly() {
    const data = JSON.parse(localStorage.getItem('data'));
    if (!data) return <Redirect to="/" />;
    const { _id, usertype } = data.user;
    if (usertype !== 'applicant') {
        return '';
    } else if (usertype === 'applicant') {
        return <Redirect to="/applicant/homepage" />;
    } else {
        localStorage.clear();
        return <Redirect to="/homepage" />;
    }
}

function getRole() {
    const data = JSON.parse(localStorage.getItem('data'));
    const { _id, usertype } = data.user;
    return usertype;
}

export { CheckRole, getRole };
