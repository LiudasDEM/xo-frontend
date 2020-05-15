import React from 'react'
import ReactDOM from 'react-dom'

import 'bootstrap/dist/css/bootstrap.min.css'

import { ProvideAlerts } from './contexts/AlertsContext'
import App from './components/App'


window._logError = function (event) {
	new Image().src = '/api/error/?msg=' + encodeURIComponent(event.error.stack)
	window.removeEventListener('error', window._logError)
	window._logError = null
}


window.addEventListener('error', window._logError)


const jsx = <ProvideAlerts>
	<App />
</ProvideAlerts>


ReactDOM.render(jsx, document.getElementById('app'))
