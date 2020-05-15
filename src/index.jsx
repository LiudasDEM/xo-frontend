import React from 'react'
import ReactDOM from 'react-dom'

import 'bootstrap/dist/css/bootstrap.min.css'


import App from './components/App'
import ErrorBoundary from './components/ErrorBoundary'


window._logError = function (event) {
	new Image().src = '/api/error/?msg=' + encodeURIComponent(event.error.stack)
	window.removeEventListener('error', window._logError)
	window._logError = null
}


window.addEventListener('error', window._logError)


ReactDOM.render(<ErrorBoundary><App /></ErrorBoundary>, document.getElementById('app'))
