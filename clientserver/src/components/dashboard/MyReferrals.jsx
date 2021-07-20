import { Table } from 'react-bootstrap';
import moment from 'moment';

export default function MyReferrals({ data }) {
  return (
    <Table striped bordered hover size="sm">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Job/Status</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        {data.map((currentValue, index) => {
          const { name, email, applied_job, date_applied } = currentValue;
          return (
            <tr key={index}>
              <td>{name}</td>
              <td>{email}</td>
              <td>{applied_job}</td>
              <td>{moment(date_applied).format('MMMM DD, YYYY ')}</td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
}
