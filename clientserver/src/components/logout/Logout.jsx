import axios from 'axios';
import { useEffect, useState } from 'react';
import { Auth, ServerAuth } from '../../Auth';
import { Redirect } from 'react-router-dom';
import Spinner from '../container/Spinner';

function Logout({ isTransfer }) {
	const [logout, setLogout] = useState(false);
	const [redirect, setRedirect] = useState(undefined);
	const [transfer, setTransfer] = useState(undefined);

	useEffect(() => {
		const data = JSON.parse(localStorage.getItem('data'));
		if (isTransfer === undefined)
			axios
				.post('/api/logout', { ...data })
				.then((res) => {
					if (res.data && res.data.isLogout === true) {
						localStorage.clear();
						setLogout(true);
					} else if (res.data.isAuthenticated === false) {
						<ServerAuth />;
					}
				})
				.catch((err) => {
					localStorage.clear();
					setRedirect(true);
				});
		else if (isTransfer === true)
			axios
				.post('/api/logout', { ...data })
				.then((res) => {
					if (res.data && res.data.isLogout === true) {
						setTransfer(true);
					} else if (res.data.isAuthenticated === false) {
						<ServerAuth />;
					}
				})
				.catch((err) => {
					localStorage.clear();
					setRedirect(true);
				});
	});

	const HandleTransfer = () => {
		const data = JSON.parse(localStorage.getItem('data'));
		axios
			.post('/api/applicant/delete', { ...data })
			.then((res) => {
				if (res.data.isSuccess === true) {
					setTransfer(undefined);
					localStorage.clear();
					setLogout(true);
				}
			})
			.catch((err) => {
				localStorage.clear();
				setRedirect(true);
			});
	};

	if (transfer === true) HandleTransfer();

	if (redirect) return <Redirect to="/" />;
	if (logout) return <Auth />;
	return <Spinner />;
}

export default Logout;
