import { Table } from 'react-bootstrap';
export default function BirthdayCorner({ data }) {
	return (
		<Table striped bordered hover size="sm">
			<thead>
				<tr>
					<th>Name</th>
					<th>Birthday</th>
				</tr>
			</thead>
			<tbody>
				{data.map((currentValue, index) => {
					const { name, birthdate } = currentValue;
					return (
						<tr key={index}>
							<td>{name}</td>
							<td>{birthdate}</td>
						</tr>
					);
				})}
			</tbody>
		</Table>
	);
}
