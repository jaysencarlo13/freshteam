import { Table } from 'react-bootstrap';
import moment from 'moment';

export default function MyInterviews({ data }) {
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
        {data.map((currentValue, index) => {
          const { name, email, assignBy, date_time } = currentValue;
          return (
            <tr key={index}>
              <td>{name}</td>
              <td>{email}</td>
              <td>{assignBy}</td>
              <td>{moment(date_time).format('MMMM DD, YYYY hh:mm A, dddd')}</td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
}
