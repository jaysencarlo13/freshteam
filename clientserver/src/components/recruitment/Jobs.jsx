import { Card, NavLink } from 'react-bootstrap';

export default function Jobs({ data }) {
    return (
        <div className="row div-jobs">
            {data.map(({ id, title, candidates }) => {
                return (
                    <div className="col-md-2">
                        <Card
                            key={id}
                            style={{ width: '13rem', height: '15rem', color: 'black' }}
                            className="mb-2 btn-outline-info recruitment-jobs"
                            as={NavLink}
                            href={'/recruitment/candidates?postid=' + id}
                        >
                            <Card.Header>{title.substring(0, 21) || 'No Title'}</Card.Header>
                            <Card.Body>
                                <Card.Text>
                                    <h4>{candidates || 0}</h4>
                                    Candidates
                                </Card.Text>
                            </Card.Body>
                            <Card.Footer
                                href={'/jobpost/view?postid=' + id}
                                as={NavLink}
                                className="btn-info"
                            >
                                Details
                            </Card.Footer>
                        </Card>
                    </div>
                );
            })}
        </div>
    );
}
