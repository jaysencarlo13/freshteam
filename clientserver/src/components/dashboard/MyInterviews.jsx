import { Table } from 'react-bootstrap';
import moment from 'moment';

export default function MyInterviews({ data, trigger }) {
	const data_ = data[trigger];
	return (
		<Table striped bordered hover size="sm">
			<thead>
				<tr>
					<th>Name</th>
					<th>Email</th>
					<th>Assign By</th>
					<th>Date and Time</th>
				</tr>
			</thead>
			<tbody>
				{data_.map((currentValue, index) => {
					return (
						<tr key={index}>
							<td>{currentValue.name}</td>
							<td>{currentValue.email}</td>
							<td>{currentValue.assignBy}</td>
							<td>{moment(currentValue.date_time).format('MMMM DD, YYYY ')}</td>
						</tr>
					);
				})}
			</tbody>
		</Table>
	);
}
