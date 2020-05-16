import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'

import http from '../http'
import { buildQuery } from '../util'

import { useAlerts } from './AlertsContext'

const GameContext = createContext()


export function ProvideGame({ children }) {
	const game = useProvideGame()
	return <GameContext.Provider value={game}>{children}</GameContext.Provider>
}


ProvideGame.propTypes = {
	children: PropTypes.any,
}


export function useGame() {
	return useContext(GameContext)
}


export function useProvideGame() {
	const { showAlert } = useAlerts()

	const [playerOneReady, setPlayerOneReady] = useState(false)
	const [playerTwoReady, setPlayerTwoReady] = useState(false)
	const [gameHasStarted, setGameHasStarted] = useState(false)
	const [gameHasEnded, setGameHasEnded] = useState(false)

	const [game, setGame] = useState(null)
	const [events, setEvents] = useState([])

	const [winner, setWinner] = useState()

	const [turn, setTurn] = useState()
	const [board, setBoard] = useState([
		['', '', ''],
		['', '', ''],
		['', '', ''],
	])

	const reloadEvents = useCallback(function reloadEvents(gameId) {
		http.get(`/api/games/${gameId || game._id}/events?${buildQuery({
			select: 'createdAt row column action player',
			page: 0, size: 20,
		})}`).then(res => {
			setEvents(res.data)
		}, showAlert)
	}, [game, showAlert])

	const loadGame = useCallback(function loadGame(id) {
		return http.get(`/api/games/${id}?${buildQuery({
			select: 'createdAt status modifiedAt winner',
		})}`).then(res => {
			setGame(res.data)
			return res.data._id
		}, showAlert)
	}, [showAlert])

	const createGame = useCallback(function createGame() {
		return http.post('/api/games').then(res => {
			loadGame(res.headers.get('location').split('/').pop())
				.then(reloadEvents)
		}, showAlert)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [loadGame, showAlert, reloadEvents])

	const resetEverything = useCallback(function resetEverything() {
		setPlayerOneReady(false)
		setPlayerTwoReady(false)
		setGameHasStarted(false)
		setGameHasEnded(false)
		setWinner()
		setTurn()
		setBoard([
			['', '', ''],
			['', '', ''],
			['', '', ''],
		])
		setGame(null)
		setEvents([])
		createGame()
	}, [createGame])

	useEffect(() => {
		if (!gameHasEnded) {
			return
		}
		http.post(`/api/games/${game._id}/finished`, {
			board, winner: !winner ? 'tie' : `Player ${winner}`,
		}).then(res => {
			loadGame(res.headers.get('location').split('/').pop())
				.then(reloadEvents)
		}, showAlert)

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [showAlert, loadGame, gameHasEnded])

	useEffect(() => {
		createGame()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {
		if (!playerOneReady) {
			return
		}

		http.post('/api/events', {
			action: 'started',
			player: 'Player X',
			row: 0, column: 0,
			game: game._id,
		}).then(() => reloadEvents(), showAlert)

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [showAlert, playerOneReady])

	useEffect(() => {
		if (!playerTwoReady) {
			return
		}

		http.post('/api/events', {
			action: 'started',
			player: 'Player O',
			row: 0, column: 0,
			game: game._id,
		}).then(() => reloadEvents(), showAlert)

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [showAlert, playerTwoReady])

	useEffect(() => {
		if (gameHasStarted) {
			setTurn(t => t === 'X' ? 'O' : 'X')
		}
	}, [board, gameHasStarted])

	useEffect(() => {
		if (playerOneReady && playerTwoReady) {
			setGameHasStarted(true)
		}
	}, [playerOneReady, playerTwoReady])

	const canMarkCell = useCallback(function canMarkCell(x, y) {
		const row = board[x]
		if (!row) {
			return false
		}

		const cell = row[y]
		if (cell == null) {
			return false
		}

		if (cell === 'X' || cell === 'O') {
			return false
		}

		return true
	}, [board])

	const selectCrossOnCell = useCallback(function selectCrossOnCell(x, y) {
		if (gameHasEnded) { return }
		if (turn !== 'X') { return }
		if (!canMarkCell(x, y)) { return }

		board[x][y] = 'X'
		setBoard([...board])

		http.post('/api/events', {
			action: 'checked',
			player: 'Player X',
			row: x, column: y,
			game: game._id,
		}).then(() => reloadEvents(), showAlert)
	}, [board, turn, canMarkCell, gameHasEnded, game, reloadEvents, showAlert])

	const selectNoughtOnCell = useCallback(function selectNoughtOnCell(x, y) {
		if (gameHasEnded) { return }
		if (turn !== 'O') { return }
		if (!canMarkCell(x, y)) { return }

		board[x][y] = 'O'
		setBoard([...board])

		http.post('/api/events', {
			action: 'checked',
			player: 'Player O',
			row: x, column: y,
			game: game._id,
		}).then(() => reloadEvents(), showAlert)
	}, [board, turn, canMarkCell, gameHasEnded, game, reloadEvents, showAlert])

	useEffect(() => {
		function invertMatrix(matrix) {
			const newMatrix = [
				['', '', ''],
				['', '', ''],
				['', '', ''],
			]

			for (const rowIndex in matrix) {
				for (const colIndex in matrix[rowIndex]) {
					newMatrix[colIndex][rowIndex] = matrix[rowIndex][colIndex]
				}
			}

			return newMatrix
		}

		function isLineFilled(line) {
			const filledCells = line.filter(x => x)
			const set = new Set(filledCells)
			return [...set].length === 1 && filledCells.length === 3
		}

		const completelyFilledCol = board.find(isLineFilled)

		if (completelyFilledCol) {
			setGameHasEnded(true)
			setWinner(completelyFilledCol[0] === 'X' ? 'X' : 'O')
			return
		}

		const completelyFilledRow = invertMatrix(board).find(isLineFilled)

		if (completelyFilledRow) {
			setGameHasEnded(true)
			setWinner(completelyFilledRow[0] === 'X' ? 'X' : 'O')
			return
		}

		const diagonals = [
			[board[0][0], board[1][1], board[2][2]],
			[board[0][2], board[1][1], board[2][0]],
		]

		const completelyFilledDiagonal = diagonals.find(isLineFilled)

		if (completelyFilledDiagonal) {
			setGameHasEnded(true)
			setWinner(completelyFilledDiagonal[0] === 'X' ? 'X' : 'O')
			return
		}

		const everythingIsFilled = board.every(row => row.every(x => x))
		if (everythingIsFilled) {
			setGameHasEnded(true)
			return
		}
	}, [board])

	return {
		playerOneReady, setPlayerOneReady,
		playerTwoReady, setPlayerTwoReady,
		turn, board, gameHasStarted,
		winner, gameHasEnded,
		selectCrossOnCell, selectNoughtOnCell,
		resetEverything, game, events,
	}
}
