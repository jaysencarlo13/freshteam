import { useState } from 'react';
import './sidebar.css';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { DropdownButton, Nav, NavDropdown } from 'react-bootstrap';

export default function Sidebar() {
    const role = JSON.parse(localStorage.getItem('data'))
        ? JSON.parse(localStorage.getItem('data')).user.usertype
        : undefined;

    const initialState = {
        show_employees: false,
    };

    const [{ show_employees }, setState] = useState(initialState);

    if (role === 'hr' || role === 'admin')
        return (
            <nav className="sidebar">
                <div>
                    <h1>
                        <span>
                            <i className="fab fa-gg-circle"></i>
                        </span>
                    </h1>
                </div>
                <ul className="list-unstyled components navbar-nav-scroll">
                    <li>
                        <a href="/">
                            <Tippy content="Dashboard" placement="right">
                                <span>
                                    <i className="fas fa-tachometer-alt"></i>
                                </span>
                            </Tippy>
                        </a>
                    </li>
                    <li>
                        <a href="/inbox">
                            <Tippy content="Inbox" placement="right">
                                <span>
                                    <i className="fas fa-inbox"></i>
                                </span>
                            </Tippy>
                        </a>
                    </li>
                    <li>
                        <a href="/recruitment">
                            <Tippy content="Recruitment" placement="right">
                                <span>
                                    <i className="fas fa-briefcase"></i>
                                </span>
                            </Tippy>
                        </a>
                    </li>
                    <li>
                        <a href="/employees">
                            <Tippy content="Employees" placement="right">
                                <span>
                                    <i className="fas fa-user-friends"></i>
                                </span>
                            </Tippy>
                        </a>
                    </li>
                    <li>
                        <a href="/timeoff">
                            <Tippy content="Time Off" placement="right">
                                <span>
                                    <i className="fas fa-clock"></i>
                                </span>
                            </Tippy>
                        </a>
                    </li>
                    <li>
                        <a href="#5">
                            <Tippy content="Reports" placement="right">
                                <span>
                                    <i className="fas fa-chart-area"></i>
                                </span>
                            </Tippy>
                        </a>
                    </li>
                    <li>
                        <a href="/settings">
                            <Tippy content="Settings" placement="right">
                                <span>
                                    <i className="fas fa-cogs"></i>
                                </span>
                            </Tippy>
                        </a>
                    </li>
                </ul>
            </nav>
        );
    if (role === 'employee')
        return (
            <nav className="sidebar">
                <div>
                    <h1>
                        <span>
                            <i className="fab fa-gg-circle"></i>
                        </span>
                    </h1>
                </div>
                <ul className="list-unstyled components navbar-nav-scroll">
                    <li>
                        <a href="/">
                            <Tippy content="Dashboard" placement="right">
                                <span>
                                    <i className="fas fa-tachometer-alt"></i>
                                </span>
                            </Tippy>
                        </a>
                    </li>
                    <li>
                        <a href="/inbox">
                            <Tippy content="Inbox" placement="right">
                                <span>
                                    <i className="fas fa-inbox"></i>
                                </span>
                            </Tippy>
                        </a>
                    </li>
                    <li>
                        <a href="/employees">
                            <Tippy content="Employees" placement="right">
                                <span>
                                    <i className="fas fa-user-friends"></i>
                                </span>
                            </Tippy>
                        </a>
                    </li>
                    <li>
                        <a href="/timeoff">
                            <Tippy content="Time Off" placement="right">
                                <span>
                                    <i className="fas fa-clock"></i>
                                </span>
                            </Tippy>
                        </a>
                    </li>
                    <li>
                        <a href="#5">
                            <Tippy content="Reports" placement="right">
                                <span>
                                    <i className="fas fa-chart-area"></i>
                                </span>
                            </Tippy>
                        </a>
                    </li>
                </ul>
            </nav>
        );
    if (role === 'fresh')
        return (
            <nav className="sidebar">
                <div>
                    <h1>
                        <span>
                            <i className="fab fa-gg-circle"></i>
                        </span>
                    </h1>
                </div>
            </nav>
        );
    return '';
}
