import React from 'react';
import './sidebar.css';

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
						<span>
							<i className="fas fa-tachometer-alt"></i>
						</span>
					</a>
				</li>
				<li>
					<a href="#1">
						<span>
							<i className="fas fa-inbox"></i>
						</span>
					</a>
				</li>
				<li>
					<a href="#2">
						<span>
							<i className="fas fa-briefcase"></i>
						</span>
					</a>
				</li>
				<li>
					<a href="#3">
						<span>
							<i className="fas fa-user-friends"></i>
						</span>
					</a>
				</li>
				<li>
					<a href="#4">
						<span>
							<i className="fas fa-clock"></i>
						</span>
					</a>
				</li>
				<li>
					<a href="#5">
						<span>
							<i className="fas fa-chart-area"></i>
						</span>
					</a>
				</li>
				<li>
					<a href="#6">
						<span>
							<i className="fas fa-cogs"></i>
						</span>
					</a>
				</li>
			</ul>
		</nav>
	);
}
