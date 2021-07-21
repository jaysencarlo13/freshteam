import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Register from './components/register/Register';
import Login from './components/login/Login';
import Dashboard from './components/dashboard/Dashboard';
import { Auth } from './Auth';
import Logout from './components/logout/Logout';
import ViewAccount from './components/view_account/ViewAccount';
import Recruitment from './components/recruitment/Recruitment';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/login">
          <Login />
        </Route>
        <Route exact path="/register">
          <Register />
        </Route>
        <Route exact path="/">
          <Auth />
          <Dashboard />
        </Route>
        <Route exact path="/viewaccount">
          <Auth />
          <ViewAccount />
        </Route>
        <Route exact path="/recruitment">
          <Auth />
          <Recruitment />
        </Route>
        <Route exact path="/logout">
          <Logout />
          <Auth />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
