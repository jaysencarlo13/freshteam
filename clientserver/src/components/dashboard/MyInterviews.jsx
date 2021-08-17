import { Table, Button } from 'react-bootstrap';
import moment from 'moment';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';

export default function MyInterviews({ data, callback }) {
    console.log(data);
    const handleDone = (e, row) => {
        callback(row);
    };

    const formatButton = (cell, row) => {
        if (moment(row.date_time).toDate() <= moment().toDate()) {
            return (
                <Button variant="success" onClick={(e) => handleDone(e, row)}>
                    Done
                </Button>
            );
        }
    };

    const formatDate = (cell, row) => {
        return moment(row.date_time).format('LLL');
    };

    const columns = [
        { dataField: 'name', text: 'Name' },
        { dataField: 'email', text: 'Email' },
        { dataField: 'assignBy.name', text: 'Assign By' },
        { dataField: 'date_time', text: 'Date and Time', formatter: formatDate },
        { dataField: '', text: 'Actions', formatter: formatButton },
    ];

    return (
        <BootstrapTable
            striped
            keyField="id"
            data={data}
            columns={columns}
            pagination={paginationFactory({ showTotal: true })}
            wrapperClasses="talentpool-table"
            filtersClasses="talentpool-table"
            footerClasses="talentpool-table"
        />
    );
}
