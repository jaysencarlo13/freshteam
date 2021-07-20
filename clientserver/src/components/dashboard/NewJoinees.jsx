import { Table } from 'react-bootstrap';

export default function NewJoinees({ data }) {
	return (
		<Table striped bordered hover size="sm">
			<thead>
				<tr>
					<th>Name</th>
					<th>Department</th>
					<th>Title</th>
					<th>Email</th>
					<th>Join Date</th>
				</tr>
			</thead>
			<tbody>
				{data.map((currentValue, index) => {
					const { name, email, department, title, join_date } = currentValue;
					return (
						<tr key={index}>
							<td>{name}</td>
							<td>{department}</td>
							<td>{title}</td>
							<td>{email}</td>
							<td>{join_date}</td>
						</tr>
					);
				})}
			</tbody>
		</Table>
	);
}
