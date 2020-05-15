import React from 'react'

import { Fade, Container, Row, Col, Card } from 'react-bootstrap'

import ErrorBoundary from './ErrorBoundary'

import Board from './Board'
import Table from './Table'


function Layout() {
	return <Fade in>
		<Container style={{ marginTop: '20px' }}>
			<Row>
				<Col md={6} lg={6}>
					<Card>
						<Card.Body>
							<Card.Title>
								Player 1
							</Card.Title>
							<ErrorBoundary>
								<Board />
							</ErrorBoundary>
						</Card.Body>
					</Card>
				</Col>
				<Col md={6} lg={6}>
					<Card>
						<Card.Body>
							<Card.Title>
								Player 2
							</Card.Title>
							<ErrorBoundary>
								<Board />
							</ErrorBoundary>
						</Card.Body>
					</Card>
				</Col>
			</Row>
			<Row style={{ marginTop: '20px' }}>
				<Col lg={12} md={12}>
					<Card>
						<Card.Body>
							<Card.Title>
								Logs
							</Card.Title>
							<ErrorBoundary>
								<Table />
							</ErrorBoundary>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</Container>
	</Fade>
}


export default Layout
