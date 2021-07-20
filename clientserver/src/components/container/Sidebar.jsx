import React from 'react';
import './sidebar.css';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

export default function Sidebar() {
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
					<a href="#1">
						<Tippy content="Inbox" placement="right">
							<span>
								<i className="fas fa-inbox"></i>
							</span>
						</Tippy>
					</a>
				</li>
				<li>
					<a href="#2">
						<Tippy content="Recruitment" placement="right">
							<span>
								<i className="fas fa-briefcase"></i>
							</span>
						</Tippy>
					</a>
				</li>
				<li>
					<a href="#3">
						<Tippy content="Employees" placement="right">
							<span>
								<i className="fas fa-user-friends"></i>
							</span>
						</Tippy>
					</a>
				</li>
				<li>
					<a href="#4">
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
					<a href="#6">
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
}
