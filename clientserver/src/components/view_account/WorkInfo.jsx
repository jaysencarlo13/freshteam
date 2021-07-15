import React from 'react';
import Paragraph from './Paragraph';
import moment from 'moment';

export default function WorkInfo({ data }) {
	let array = [];

	if (data && data.work_info) {
		array = [
			{ title: 'Employee ID', value: data.work_info.employee_id },
			{ title: 'Employee Status', value: data.work_info.employee_status },
			{ title: 'Department', value: data.work_info.department },
			{ title: 'Designation or Title', value: data.work_info.title },
			{ title: 'Date Join', value: data.work_info.join_date ? moment(data.work_info.join_date).format('MMMM DD, YYYY') : undefined },
		];
	} else if (data) {
		array = [{ title: 'Employee ID' }, { title: 'Employee Status' }, { title: 'Department' }, { title: 'Designation or Title' }, { title: 'Date Join' }];
	}
	if (data)
		return (
			<div className="col-md-6">
				<h3>Work Info</h3>
				{array.map((user) => (
					<Paragraph title={user.title} value={user.value || '-'} />
				))}
			</div>
		);
	else return '';
}
