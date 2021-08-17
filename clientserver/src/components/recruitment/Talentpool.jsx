import { useEffect, useState } from 'react';
import Contents from '../container/Contents';
import './recruitment.css';
import axios from 'axios';
import Nav from './Nav';
import { ServerAuth } from '../../Auth';
import Spinner from '../container/Spinner';
import Table from './TalentpoolTable';
import './talentpool.css';
import { InputGroup, FormControl } from 'react-bootstrap';
import Modal from './TalentpoolModalView';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ModalRemove from './TalentpoolModalRemove';
import ModalAdd from './TalentpoolModalAdd';

toast.configure();

export default function Recruitment() {
    const ticket = JSON.parse(localStorage.getItem('data'));

    const initialState = {
        spin: true,
        spin2: false,
        talentpool: undefined,
        update: false,
        search: '',
        show: false,
        data_modal: undefined,
        modal_remove: false,
        modal_remove_data: undefined,
        modal_add: false,
        modal_add_data: undefined,
    };

    const [
        {
            spin,
            spin2,
            talentpool,
            update,
            search,
            show,
            data_modal,
            modal_remove,
            modal_remove_data,
            modal_add,
            modal_add_data,
        },
        setState,
    ] = useState(initialState);

    useEffect(() => {
        axios.post('/api/recruitment/talentpool', { ...ticket, search }).then((res) => {
            if (res.data && res.data.isSuccess === true) {
                const { talentpool } = res.data;
                setState((prevState) => ({ ...prevState, talentpool, spin: false, spin2: false }));
            } else if (res.data && res.data.isAuthenticated === false) {
                <ServerAuth />;
            }
        });
    }, [search, update]);

    const handleSearch = (e) => {
        const { value } = e.target;
        setState((prevState) => ({ ...prevState, spin2: true, search: value }));
    };

    const handleModal = (e) => {
        setState((prevState) => ({ ...prevState, show: true, data_modal: e }));
    };

    const handleHide = () => {
        setState((prevState) => ({ ...prevState, show: false, data_modal: undefined }));
    };

    const showRemove = (e) => {
        setState((prevState) => ({ ...prevState, modal_remove: true, modal_remove_data: e }));
    };

    const handleClose_remove = () => {
        setState((prevState) => ({
            ...prevState,
            modal_remove: false,
            modal_remove_data: undefined,
            update: !update,
            spin2: true,
        }));
    };

    const showAdd = (e) => {
        setState((prevState) => ({ ...prevState, modal_add: true, modal_add_data: e }));
    };

    const handleClose_add = (e) => {
        setState((prevState) => ({
            ...prevState,
            modal_add: false,
            modal_add_data: undefined,
            update: !update,
            spin2: true,
        }));
    };

    if (!spin)
        return (
            <Contents>
                <Nav active="talent_pool" />
                <InputGroup className="col-md-3 mb-2 talentpool-search">
                    <InputGroup.Text id="basic-addon1">Search JobTitle</InputGroup.Text>
                    <FormControl placeholder="Jobtitle" onChange={handleSearch} />
                </InputGroup>
                {!spin2 ? (
                    talentpool ? (
                        <div>
                            <Table
                                data_table={talentpool}
                                modal_view={handleModal}
                                action_add={showAdd}
                                action_remove={showRemove}
                            />
                            <Modal show={show} data_modal={data_modal} hide={handleHide} />
                            {modal_remove_data ? (
                                <ModalRemove
                                    show={modal_remove}
                                    close={handleClose_remove}
                                    data={modal_remove_data}
                                />
                            ) : (
                                ''
                            )}
                            {modal_add_data ? (
                                <ModalAdd show={modal_add} close={handleClose_add} data={modal_add_data} />
                            ) : (
                                ''
                            )}
                        </div>
                    ) : (
                        'No Talentpool'
                    )
                ) : (
                    <Spinner />
                )}
            </Contents>
        );
    else
        return (
            <Contents>
                <Spinner />
            </Contents>
        );
}
