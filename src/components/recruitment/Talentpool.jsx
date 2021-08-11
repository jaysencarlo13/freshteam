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
    };

    const [{ spin, spin2, talentpool, update, search, show, data_modal }, setState] = useState(initialState);

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

    const handleAdd = (e) => {
        axios
            .post('/api/recruitment/talentpool/add', { ...ticket, talentpool: e })
            .then((res) => {
                if (res.data.isSuccess === true) {
                    toast.success(res.data.message, {
                        position: toast.POSITION.TOP_LEFT,
                        autoClose: 10000,
                    });
                    setState((prevState) => ({ ...prevState, update: !update, spin2: true }));
                } else if (res.data.isAuthenticated === false) {
                    <ServerAuth />;
                }
            })
            .catch((err) => {
                toast.error(err.response.data.message, {
                    position: toast.POSITION.TOP_LEFT,
                    autoClose: 10000,
                });
                setState((prevState) => ({ ...prevState, update: !update, spin2: true }));
            });
    };

    const handleRemove = (e) => {
        axios
            .post('/api/recruitment/talentpool/remove', { ...ticket, talentpool: e })
            .then((res) => {
                if (res.data.isSuccess === true) {
                    toast.success(res.data.message, {
                        position: toast.POSITION.TOP_LEFT,
                        autoClose: 10000,
                    });
                    setState((prevState) => ({ ...prevState, update: !update, spin2: true }));
                } else if (res.data.isAuthenticated === false) {
                    <ServerAuth />;
                }
            })
            .catch((err) => {
                toast.error(err.response.data.message, {
                    position: toast.POSITION.TOP_LEFT,
                    autoClose: 10000,
                });
                setState((prevState) => ({ ...prevState, update: !update, spin2: true }));
            });
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
                                action_add={handleAdd}
                                action_remove={handleRemove}
                            />
                            <Modal show={show} data_modal={data_modal} hide={handleHide} />
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
