import React from 'react'

import { Fade, Container, Row, Col, Card, Button } from 'react-bootstrap'

import ErrorBoundary from './ErrorBoundary'


import Board from './Board'
import Table from './Table'


import { useAlerts } from '../contexts/AlertsContext'
import { useGame } from '../contexts/GameContext'


function Layout() {
	const { showAlert } = useAlerts()


	const {
		playerOneReady, setPlayerOneReady,
		playerTwoReady, setPlayerTwoReady,
		board, winner, gameHasEnded,
		gameHasStarted, turn,
		selectCrossOnCell, selectNoughtOnCell,
	} = useGame()

	return <Fade in>
		<Container style={{ marginTop: '20px' }}>
			<Row>
				{
					gameHasEnded
						? <Col md={{ span: 6, offset: 3 }} lg={6}>
							<Card>
								<Card.Body>
									<Card.Title>
										{
											winner
												? <>Player {winner} has won:</>
												: <>The game has ended in a draw</>
										}
									</Card.Title>
									<Board board={board} select={() => { }} />
								</Card.Body>
							</Card>
						</Col>
						: <>
							<Col md={6} lg={6}>
								<Card>
									<Card.Body>
										<Card.Title>
											Player 1
										</Card.Title>
										{!playerOneReady &&
											<Button variant="danger" onClick={() => { setPlayerOneReady(true); showAlert('Player one is ready') }}>Start</Button>}
									</Card.Body>
								</Card>
							</Col>
							<Col md={6} lg={6}>
								<Card>
									<Card.Body>
										<Card.Title>
											Player 2
										</Card.Title>
										{!playerTwoReady &&
											<Button variant="danger" onClick={() => { setPlayerTwoReady(true); showAlert('Player two is ready') }}>Start</Button>}
									</Card.Body>
								</Card>
							</Col>
						</>
				}
				{
					gameHasStarted && !gameHasEnded &&
					<Col md={{ span: 6, offset: 3 }} lg={6}>
						<Card>
							<Card.Body>
								<Board
									symbol={turn}
									select={turn === 'X' ? selectCrossOnCell : selectNoughtOnCell}
									board={board}
								/>
							</Card.Body>
						</Card>
					</Col>
				}
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
