import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Auth } from './Auth';
import { CheckRole } from './Role';

import Register from './components/register/Register';
import Login from './components/login/Login';
import Dashboard from './components/dashboard/Dashboard';
import Logout from './components/logout/Logout';
import ViewAccount from './components/view_account/ViewAccount';
import Recruitment from './components/recruitment/Recruitment';
import JobPost from './components/jobpost/JobPost';
import Candidates from './components/recruitment/Candidates';
import Homepage from './components/homepage/Homepage';
import LoginApplicant from './components/login/LoginApplicant';
import Talentpool from './components/recruitment/Talentpool';
import RegisterApplicant from './components/register/RegisterApplicant';
import ApplicantHomepage from './components/applicant/Applicant';
import ApplicantManage from './components/applicant/ManageAccount';
import Inbox from './components/inbox/Inbox';
import Settings from './components/settings/Settings';
import Employees from './components/employees/Employees';
import Timeoff from './components/timeoff/Timeoff';
import Reports from './components/reports/Reports';

function App() {
    return (
        <Router>
            <Switch>
                <Route exact path="/login_applicant">
                    <LoginApplicant />
                </Route>
                <Route exact path="/register_applicant">
                    <RegisterApplicant />
                </Route>
                <Route exact path="/homepage">
                    <Homepage />
                </Route>
                <Route exact path="/applicant/homepage">
                    <Auth />
                    <ApplicantHomepage />
                </Route>
                <Route exact path="/applicant/manage_account">
                    <Auth />
                    <ApplicantManage />
                </Route>
                <Route exact path="/login">
                    <Login />
                </Route>
                <Route exact path="/register">
                    <Register />
                </Route>
                <Route exact path="/">
                    <Auth />
                    <CheckRole />
                    <Dashboard />
                </Route>
                <Route exact path="/viewaccount">
                    <Auth />
                    <CheckRole />
                    <ViewAccount />
                </Route>
                <Route exact path="/recruitment">
                    <Auth />
                    <CheckRole />
                    <Recruitment />
                </Route>
                <Route exact path="/jobpost/view">
                    <Auth />
                    <CheckRole />
                    <JobPost />
                </Route>
                <Route exact path="/recruitment/candidates">
                    <Auth />
                    <CheckRole />
                    <Candidates />
                </Route>
                <Route exact path="/recruitment/talentpool">
                    <Auth />
                    <CheckRole />
                    <Talentpool />
                </Route>
                <Route exact path="/inbox">
                    <Auth />
                    <CheckRole />
                    <Inbox />
                </Route>
                <Route exact path="/settings">
                    <Auth />
                    <CheckRole />
                    <Settings />
                </Route>
                <Route exact path="/employees">
                    <Auth />
                    <CheckRole />
                    <Employees />
                </Route>
                <Route exact path="/timeoff">
                    <Auth />
                    <CheckRole />
                    <Timeoff />
                </Route>
                <Route exact path="/reports">
                    <Auth />
                    <CheckRole />
                    <Reports />
                </Route>
                <Route exact path="/logout">
                    <Auth />
                    <Logout />
                    <Auth />
                </Route>
            </Switch>
        </Router>
    );
}

export default App;
