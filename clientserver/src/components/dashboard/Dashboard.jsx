import React from 'react';
import Contents from '../container/Contents';
import { Card, Button } from 'react-bootstrap';

function Dashboard() {
	return (
		<>
			<Contents>
				<div className="gy-3">
					<div className="col-md-11">
						{/* <Card>
							<Card.Header>My Interviews</Card.Header>
							<Card.Body>
								<Card.Title>Special title treatment</Card.Title>
								<Card.Text>With supporting text below as a natural lead-in to additional content.</Card.Text>
								<Button variant="primary">Go somewhere</Button>
							</Card.Body>
						</Card> */}
					</div>
				</div>
			</Contents>
		</>
	);
}

export default Dashboard;
