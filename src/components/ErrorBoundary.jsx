import * as React from 'react'
import PropTypes from 'prop-types'


import { Card, Fade, Container, Row, Col } from 'react-bootstrap'


class ErrorBoundary extends React.Component {
	constructor(props) {
		super(props)
		this.state = { hasError: false }
	}

	static getDerivedStateFromError() {
		return { hasError: true }
	}

	componentDidUpdate(prevProps) {
		if (this.state.hasError && this.props.path !== prevProps.path) {
			this.setState({ hasError: false })
		}
	}

	componentDidCatch(error) {
		window._logError && window._logError({ error })
	}

	render() {
		if (this.state.hasError) {
			return (
				<Fade in appear>
					<Container>
						<Row>
							<Col>
								<Card>
									<Card.Body>
										<h4>Something went wrong...</h4>
									</Card.Body>
								</Card>
							</Col>
						</Row>
					</Container>
				</Fade>
			)
		}

		return this.props.children
	}
}


ErrorBoundary.propTypes = {
	children: PropTypes.any,
	path: PropTypes.string,
}


export default ErrorBoundary
