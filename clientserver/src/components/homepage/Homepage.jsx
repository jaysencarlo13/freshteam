import Nav from './Nav';
import './homepage.css';
import { InputGroup, FormControl, Card, Button, Alert } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import Spinner from '../container/Spinner';
import axios from 'axios';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState, convertFromRaw, convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import Parser from 'html-react-parser';
import { ApplyAuth } from '../../Auth';

export default function Homepage() {
	const [jobpost, setJobPost] = useState(undefined);
	const [search, setSearch] = useState('');
	const [spin, setSpin] = useState(true);
	const [spin2, setSpin2] = useState(false);
	const [fulldetails, setFullDetails] = useState(undefined);

	useEffect(() => {
		axios.get('/api/jobpost/fetch?search=' + search).then((res) => {
			if (res.data.isSuccess === true) {
				if (res.data.jobpost.length === 0) {
					setJobPost(undefined);
					setSpin(false);
				} else {
					setJobPost(res.data.jobpost);
					setSpin(false);
				}
			}
		});
	}, [search]);

	const searchChange = (e) => {
		const { value } = e.target;
		setSearch(value);
		setSpin(true);
	};

	const onClickDetails = (a) => {
		setSpin2(true);
		axios.get('/api/jobpost/fetchById?postid=' + a).then((res) => {
			if (res.data.isSuccess === true) {
				setFullDetails({
					...res.data.jobpost,
					editor: EditorState.createWithContent(convertFromRaw(JSON.parse(res.data.jobpost.editor))),
				});
				setSpin2(false);
			}
		});
	};

	return (
		<>
			<Nav />
			<div className="row homepage">
				<div className="col-md-8">
					<div className="col-md-12 homepage-search">
						<div className="col-md-6">
							<InputGroup className="mb-3">
								<InputGroup.Text>Search Job Title</InputGroup.Text>
								<FormControl placeholder="Job Title" aria-label="Job Title" aria-describedby="basic-addon2" onChange={searchChange} />
							</InputGroup>
						</div>
					</div>
					<hr></hr>
					<div className="col-md-12">
						<div className="row">
							<div className="col-md-5">
								{!spin ? (
									<div>
										{jobpost ? (
											jobpost.map(({ _id, title, range, type, name, description, headquarters, industry }) => {
												return (
													<Card key={_id} border="primary" style={{ width: '100%', marginBottom: '40px' }} className="btn homepage-card-briefdetails" onClick={() => onClickDetails(_id)}>
														<Card.Header className="homepage-jobpost-header">{title}</Card.Header>
														<Card.Body>
															<Card.Title className="homepage-jobpost-title">{name}</Card.Title>
															<h6>
																{headquarters}/ {industry}
															</h6>
															<Card.Subtitle>{range}</Card.Subtitle>
															<Card.Subtitle>{type}</Card.Subtitle>
														</Card.Body>
													</Card>
												);
											})
										) : (
											<Alert variant="danger">No Results Found</Alert>
										)}
									</div>
								) : (
									<Spinner />
								)}
							</div>

							<div className="col-md-7">
								{!spin2 ? (
									fulldetails ? (
										<Card className="homepage-job-details">
											<Card.Body>
												<Card.Title>{fulldetails.title}</Card.Title>
												<h5>{fulldetails.name}</h5>
												<h5>{fulldetails.headquarters}</h5>
												<h5>{fulldetails.industry}</h5>
												<Card.Subtitle>
													{fulldetails.range} / {fulldetails.type}
												</Card.Subtitle>
												<Button variant="primary" size="lg" href={'/login_applicant?postid=' + fulldetails._id}>
													Apply Now
												</Button>
												<hr />
												<div className="homepage-about-us">
													<h4>About Us</h4>
													<div style={{ whiteSpace: 'pre-wrap' }}>{fulldetails.description}</div>
													<hr />
													<div className="homepage-editor">{Parser(draftToHtml(JSON.parse(JSON.stringify(convertToRaw(fulldetails.editor.getCurrentContent())))))}</div>
												</div>
											</Card.Body>
										</Card>
									) : (
										''
									)
								) : (
									<Spinner />
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
