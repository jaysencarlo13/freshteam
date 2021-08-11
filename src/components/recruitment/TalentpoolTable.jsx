import { useState } from 'react';
import { Button, ButtonGroup, Modal, Card, Nav, ProgressBar, InputGroup, FormControl } from 'react-bootstrap';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

export default function TalentPoolTable({ data_table, modal_view, action_add, action_remove }) {
    const initialState = {
        talentpool: data_table,
    };
    const [{ talentpool }, setState] = useState(initialState);

    const formatButton = (cell, row) => {
        if (row.title) {
            return (
                <ButtonGroup size="sm">
                    <Button
                        variant="success"
                        title="add"
                        className="talentpool-table-actions-buttons"
                        onClick={(e) => handleAdd(e, row)}
                    >
                        Add
                    </Button>
                    <Button
                        variant="info"
                        title="update"
                        className="talentpool-table-actions-buttons"
                        onClick={(e) => handleView(e, row)}
                    >
                        View
                    </Button>
                    <Button
                        variant="danger"
                        title="remove"
                        className="talentpool-table-actions-buttons"
                        onClick={(e) => handleRemove(e, row)}
                    >
                        Remove
                    </Button>
                </ButtonGroup>
            );
        }
    };

    const columns = [
        { dataField: 'personal_info.name', text: 'Name' },
        { dataField: 'personal_info.email', text: 'Email' },
        { dataField: 'personal_info.contact', text: 'Contact' },
        { dataField: 'title', text: 'Job Title' },
        { dataField: '', text: 'Actions', formatter: formatButton },
    ];

    const handleView = (e, data) => {
        e.preventDefault();
        modal_view(data);
    };

    const handleAdd = (e, data) => {
        e.preventDefault();

        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <div className="custom-ui">
                        <h6>
                            Are you sure you want to add <b>{data['personal_info']['name']}</b>
                        </h6>
                        <hr />
                        <Button variant="info" onClick={() => onClose()}>
                            No
                        </Button>
                        <Button
                            variant="success"
                            onClick={(e) => {
                                action_add(data);
                                onClose();
                            }}
                        >
                            Add
                        </Button>
                    </div>
                );
            },
        });
    };

    const handleRemove = (e, data) => {
        e.preventDefault();
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <div className="custom-ui">
                        <h6>
                            Are you sure you want to remove <b>{data['personal_info']['name']}</b>
                        </h6>
                        <hr />
                        <Button variant="info" onClick={() => onClose()}>
                            No
                        </Button>
                        <Button
                            variant="danger"
                            onClick={(e) => {
                                action_remove(data);
                                onClose();
                            }}
                        >
                            Remove
                        </Button>
                    </div>
                );
            },
        });
    };

    return (
        <div>
            <BootstrapTable
                striped
                keyField="talentpool_id"
                data={talentpool}
                columns={columns}
                pagination={paginationFactory({ showTotal: true })}
                wrapperClasses="talentpool-table"
                filtersClasses="talentpool-table"
                footerClasses="talentpool-table"
            />
        </div>
    );
}
