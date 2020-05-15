import React from 'react'

import { Fade, Container, Alert, Row, Col } from 'react-bootstrap'


import ErrorBoundary from './ErrorBoundary'
import Layout from './Layout'


import { useAlerts } from '../contexts/AlertsContext'


function App() {
	const { alerts, removeAlert, showAlert } = useAlerts()

	return <Fade in>
		<Container>
			<ErrorBoundary>
				<h1>Lets play some <strong onClick={() => { showAlert('Let\'s gooo') }}>tick tack toe</strong></h1>
				<Layout />
			</ErrorBoundary>
			<Row style={{ marginTop: '20px' }}>
				<Col md={{ span: 3, offset: 9 }} lg={2}>
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
