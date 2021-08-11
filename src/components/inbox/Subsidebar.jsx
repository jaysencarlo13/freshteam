import { Card } from 'react-bootstrap';
import moment from 'moment';
import Parser from 'html-react-parser';

export default function SubSideBar({ messages, callback }) {
    const handleClick = (e, data) => {
        e.preventDefault();
        callback(data);
    };
    return (
        <div className="row justify-content-center inbox-subsidebar">
            <div className="col-12">
                {messages.map((element) => {
                    const { _id, name, from, subject, body, date } = element;
                    let { text, html } = body;
                    return (
                        <Card
                            key={_id}
                            className="inbox-subsidebar-card"
                            role="button"
                            onClick={(e) => handleClick(e, element)}
                        >
                            <Card.Header style={{ backgroundColor: 'lightskyblue' }}>
                                <div className="row">
                                    <div className="col-7">
                                        <h6>{name}</h6>
                                    </div>
                                    <div className="col-5" style={{ fontSize: '10px', fontWeight: '700' }}>
                                        {moment(date).format('lll')}
                                    </div>
                                </div>
                            </Card.Header>
                            <Card.Body style={{ textAlign: 'center' }}>
                                <h6 style={{ fontWeight: '700' }}>{subject}</h6>
                                {text.toString().slice(0, 20)}.......
                            </Card.Body>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
