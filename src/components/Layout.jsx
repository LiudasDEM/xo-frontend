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
		gameHasStarted, turn, events, game,
		selectCrossOnCell, selectNoughtOnCell,
	} = useGame()

	return <Fade in>
		<Container style={{ marginTop: '20px' }}>
			<Row>
				{!gameHasStarted && <>
					<Col md={6} lg={6}>
						<Card>
							<Card.Body>
								<Card.Title>
									Player X
								</Card.Title>
								{!playerOneReady &&
									<Button variant="danger" onClick={() => { setPlayerOneReady(true); showAlert('Player X is ready') }}>Start</Button>}
							</Card.Body>
						</Card>
					</Col>
					<Col md={6} lg={6}>
						<Card>
							<Card.Body>
								<Card.Title>
									Player O
								</Card.Title>
								{!playerTwoReady &&
									<Button variant="danger" onClick={() => { setPlayerTwoReady(true); showAlert('Player O is ready') }}>Start</Button>}
							</Card.Body>
						</Card>
					</Col></>}
				{gameHasStarted &&
					<Col md={{ span: 4, offset: 4 }} lg={3} style={{ marginTop: '20px' }}>
						<Card>
							<Card.Body>
								<Card.Title>
									{
										gameHasEnded && winner
											? <>Player {winner} has won:</>
											: <>The game has ended in a draw</>
									}
								</Card.Title>
								<Board
									select={turn === 'X'
										? selectCrossOnCell
										: selectNoughtOnCell}
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
								Events
							</Card.Title>
							<ErrorBoundary>
								<Table items={events} game={game}/>
							</ErrorBoundary>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</Container>
	</Fade>
}


export default Layout
