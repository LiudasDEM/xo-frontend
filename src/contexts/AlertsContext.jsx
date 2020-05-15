import React, { createContext, useState, useContext, useCallback } from 'react'
import PropTypes from 'prop-types'


const AlertContext = createContext()


export function ProvideAlerts({ children }) {
	const alerts = useProvideAlerts()
	return <AlertContext.Provider value={alerts}>{children}</AlertContext.Provider>
}


ProvideAlerts.propTypes = {
	children: PropTypes.any,
}


export function useAlerts() {
	return useContext(AlertContext)
}


export function useProvideAlerts() {
	const [alerts, setAlerts] = useState([])

	const removeAlert = useCallback(function removeAlert(alert) {
		clearTimeout(alert.timeout)
		setAlerts(alerts => alerts.filter(x => x !== alert))
	}, [])

	const showAlert = useCallback(function showAlert(value) {
		let alert = {}

		if (value instanceof TypeError) {
			console.error(value)
			alert = {
				text: 'Something went wrong',
				variant: 'danger',
			}
		}
		else if (value instanceof Error) {
			alert = {
				text: value.message,
				variant: 'danger',
			}
		}
		else if (value.status) {
			alert = {
				text: value.data && value.data.extra
					? value.data.extra
					: value.statusText,
				variant: 'danger',
			}
		}
		else if (value.text) {
			alert = {
				...value,
			}
		}
		else {
			alert = {
				text: value,
				variant: 'success',
			}
		}

		alert.timeout = setTimeout(() => removeAlert(alert), 5000)
		setAlerts(alerts => [...alerts, alert])
	}, [removeAlert])

	return { alerts, setAlerts, removeAlert, showAlert }
}
