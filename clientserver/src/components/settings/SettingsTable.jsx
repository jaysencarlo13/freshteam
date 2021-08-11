import { useState } from 'react';

import {
    Button,
    ButtonGroup,
    Modal,
    Card,
    Nav,
    ProgressBar,
    InputGroup,
    FormControl,
    Form,
} from 'react-bootstrap';

import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ServerAuth } from '../../Auth';
import axios from 'axios';

export default function SettingsTable({ data, callback }) {
    console.log(data);
    const ticket = JSON.parse(localStorage.getItem('data'));

    const initialState = {
        selected: '',
        selected_id: '',
    };

    const [{ selected, selected_id }, setState] = useState(initialState);

    const action_update = (id, role) => {
        axios
            .post('/api/settings/update', { ...ticket, data: { id, role } })
            .then((res) => {
                if (res.data.isSuccess === true) {
                    toast.success(res.data.message, {
                        position: toast.POSITION.TOP_LEFT,
                        autoClose: 5000,
                    });
                    setState(initialState);
                    callback('reload');
                } else if (res.data.isAuthenticated === false) {
                    <ServerAuth />;
                }
            })
            .catch((err) => {
                toast.error(err.response.data.message, {
                    position: toast.POSITION.TOP_LEFT,
                    autoClose: 5000,
                });
            });
    };

    const formatButton = (cell, row) => {
        if (row._id) {
            return (
                <Form onSubmit={(e) => handleUpdate(e, row)}>
                    <InputGroup>
                        <select class="form-select" aria-label="Default select example">
                            <option value="fresh" selected={row.role === 'fresh' ? true : false}>
                                Fresh
                            </option>
                            <option value="employee" selected={row.role === 'employee' ? true : false}>
                                Employee
                            </option>
                            <option value="hr" selected={row.role === 'hr' ? true : false}>
                                HR
                            </option>
                            <option value="admin" selected={row.role === 'admin' ? true : false}>
                                Admin
                            </option>
                        </select>
                        <Button variant="info" type="submit">
                            Update
                        </Button>
                    </InputGroup>
                </Form>
            );
        }
    };

    const columns = [
        { dataField: 'name', text: 'Name' },
        { dataField: 'email', text: 'Email' },
        { dataField: 'title', text: 'Job Title' },
        { dataField: 'join_date', text: 'Join Date' },
        { dataField: '', text: 'Role', formatter: formatButton },
    ];

    const handleUpdate = (e, data) => {
        e.preventDefault();
        const select_array = [
            { option: 'fresh', index: 0 },
            { option: 'employee', index: 1 },
            { option: 'hr', index: 2 },
            { option: 'admin', index: 3 },
        ];
        const { selectedIndex } = e.target['0'].options;
        const selected_ = select_array.find((e) => e.index.toString() === selectedIndex.toString()).option;

        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <div className="custom-ui">
                        <h6>
                            Are you sure you want to update {data.name} Role into {selected_}?
                        </h6>
                        <hr />
                        <Button variant="info" onClick={() => onClose()}>
                            No
                        </Button>
                        <Button
                            variant="success"
                            onClick={(e) => {
                                action_update(data._id, selected_);
                                onClose();
                            }}
                        >
                            Update
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
                keyField="_id"
                data={data}
                columns={columns}
                pagination={paginationFactory({ showTotal: true })}
                wrapperClasses="talentpool-table"
                filtersClasses="talentpool-table"
                footerClasses="talentpool-table"
            />
        </div>
    );
}
