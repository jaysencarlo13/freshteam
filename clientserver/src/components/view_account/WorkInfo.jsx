import React from 'react';
import Paragraph from './Paragraph';
import moment from 'moment';

export default function WorkInfo({ data }) {
    let array = [];
    if (data) {
        array = [
            { title: 'Employee ID', value: data.employee_id },
            { title: 'Employee Status', value: data.status },
            { title: 'Department', value: data.department },
            { title: 'Designation or Title', value: data.title },
            {
                title: 'Date Join',
                value: data.join_date ? moment(data.join_date).format('MMMM DD, YYYY') : undefined,
            },
        ];
    } else if (data) {
        array = [
            { title: 'Employee ID' },
            { title: 'Employee Status' },
            { title: 'Department' },
            { title: 'Designation or Title' },
            { title: 'Date Join' },
        ];
    }
    if (data)
        return (
            <div className="col-md-6">
                <h3>Work Info</h3>
                {array.map((user, index) => (
                    <Paragraph key={index} title={user.title} value={user.value || '-'} />
                ))}
            </div>
        );
    else return '';
}
