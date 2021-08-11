import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { Button, InputGroup } from 'react-bootstrap';

export default function TimeoffTable({ table }) {
    const columns = [
        { dataField: 'name', text: 'Name' },
        { dataField: 'createdAt', text: 'Date Requested' },
        { dataField: 'date', text: 'Date' },
        { dataField: 'status', text: 'Status' },
    ];

    return (
        <div>
            <BootstrapTable
                striped
                keyField="_id"
                data={table}
                columns={columns}
                pagination={paginationFactory({ showTotal: true })}
                wrapperClasses="talentpool-table"
                filtersClasses="talentpool-table"
                footerClasses="talentpool-table"
            />
        </div>
    );
}
