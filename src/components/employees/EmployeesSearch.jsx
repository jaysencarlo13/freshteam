import { useState } from 'react';
import { InputGroup, DropdownButton, Dropdown, FormControl } from 'react-bootstrap';

export default function EmployeesSearch({ callback }) {
    const initialState = {
        category: 'name',
        search: '',
    };

    const [{ category, search }, setState] = useState(initialState);

    const handleChange = (e) => {
        setState({ category: e.target.value, search: '' });
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        setState((prevState) => ({ ...prevState, search: e.target.value }));
        callback({ search, category });
    };

    return (
        <InputGroup className="mb-3">
            <select
                className="form-select"
                aria-label="Default select example"
                onChange={handleChange}
                value={category}
            >
                <option value="name">Search By Name</option>
                <option value="email">Search By Email</option>
                <option value="title">Search By Title</option>
            </select>
            <FormControl
                aria-label="Text input with dropdown button"
                value={search}
                onChange={handleSearch}
            />
        </InputGroup>
    );
}
