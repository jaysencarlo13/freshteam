import React from 'react';
import Paragraph from './Paragraph';
import moment from 'moment';

export default function PersonalInfo({ data }) {
    console.log(data.birthdate);
    let array_fields = [];
    if (data) {
        array_fields = [
            { key: 1, title: 'Name', value: data.name || '-' },
            {
                key: 2,
                title: 'Birthdate',
                value: data.birthdate ? moment(data.birthdate).format('MMMM DD, YYYY') : undefined,
            },
            { key: 3, title: 'Contact Number', value: data.contact },
            { key: 4, title: 'Email Address', value: data.email },
            { key: 5, title: 'Home Address', value: data.home },
        ];
    }

    if (data)
        return (
            <div className="col-md-6">
                <h3>Personal Info</h3>
                {array_fields.map((user) => (
                    <Paragraph key={user.key} title={user.title} value={user.value || '-'} />
                ))}
            </div>
        );
    else return '';
}
