import React from 'react'

import { Fade, Container, Alert, Row, Col } from 'react-bootstrap'


import ErrorBoundary from './ErrorBoundary'
import Layout from './Layout'


import { useAlerts } from '../contexts/AlertsContext'
import { useGame } from '../contexts/GameContext'


function App() {
	const { alerts, removeAlert } = useAlerts()
	const { turn, gameHasStarted, gameHasEnded } = useGame()

	return <Fade in>
		<Container>
			<ErrorBoundary>
				<h1>Lets play some tick tack toe!</h1>
				<h2>{gameHasStarted && !gameHasEnded && <>Player&apos;s <strong>{turn}</strong> turn</>}</h2>
				<h2>{!gameHasStarted && !gameHasEnded && <>Waiting for players to start the game</>}</h2>
				<h2>{gameHasEnded && <>Game over!</>}</h2>
				<Layout />
			</ErrorBoundary>
			<Row style={{ marginTop: '20px' }}>
				<Col md={{ span: 3, offset: 9 }} lg={3}>
					<div className="alert-box">
						{alerts.map((alert, i) => (
							<Alert
								className="alert__content" key={i} dismissible
								variant={alert.variant} onClose={() => removeAlert(alert)}>
								{alert.text}
							</Alert>
						))}
					</div>
				</Col>
			</Row>
		</Container>
	</Fade>
}


export default App
