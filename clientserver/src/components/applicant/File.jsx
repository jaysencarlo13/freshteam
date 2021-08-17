import { useState } from 'react';
import { Form, InputGroup, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Spinner from '../container/Spinner';
import axios from 'axios';
import { ServerAuth } from '../../Auth';
import download from 'downloadjs';
import { server } from '../config';

export default function File({ file_, callback }) {
    const ticket = JSON.parse(localStorage.getItem('data'));
    const initialState = {
        spin: false,
        file: file_,
        upload: '',
    };

    const [{ file, spin, upload }, setState] = useState(initialState);

    const handleChange = (e) => {
        const { files } = e.target;
        setState((prevState) => ({ ...prevState, upload: files[0] }));
    };

    const handleUpload = () => {
        setState((prevState) => ({ ...prevState, spin: true }));
        const data = new FormData();
        data.append('file', upload);
        axios
            .post('/api/applicant/upload/file', data)
            .then((res) => {
                if (res.data.isSuccess === true) {
                    toast.success(res.data.message, {
                        position: toast.POSITION.TOP_LEFT,
                        autoClose: 3000,
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
                    autoClose: 3000,
                });
                setState((prevState) => ({ ...prevState, spin: false }));
            });
    };

    const handleDownload = () => {
        setState((prevState) => ({ ...prevState, spin: true }));
        axios.get(server + '/api/file/' + file.id, { responseType: 'blob' }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', file.name);
            document.body.appendChild(link);
            link.click();
        });
        setState((prevState) => ({ ...prevState, spin: false }));
    };
    return (
        <InputGroup className="col-5 mb-3">
            {spin ? (
                <Spinner />
            ) : (
                <>
                    {upload ? (
                        <Button variant="success" onClick={handleUpload} className="mb-3">
                            Upload
                        </Button>
                    ) : (
                        ''
                    )}

                    {file_.id ? (
                        <Button variant="info" onClick={handleDownload} className="mb-3">
                            Download {file.name}
                        </Button>
                    ) : (
                        ''
                    )}

                    <Form.Control type="file" name="file" onChange={handleChange} />
                </>
            )}
        </InputGroup>
    );
}
