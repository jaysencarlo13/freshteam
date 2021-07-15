import axios from 'axios';
import { useEffect, useState } from 'react';
import Auth from '../../Auth';

function Logout() {
	const [logout, setLogout] = useState(false);
	useEffect(() => {
		const data = JSON.parse(localStorage.getItem('data'));

		axios.post('/api/logout', data).then((res) => {
			if (res.data && res.data.isLogout === true) {
				localStorage.clear();
				setLogout(true);
			}
		});
	});
	if (logout) return <Auth />;
	return '';
}

export default Logout;
