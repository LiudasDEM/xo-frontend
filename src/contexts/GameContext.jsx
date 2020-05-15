import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'


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
	const [playerOneReady, setPlayerOneReady] = useState(false)
	const [playerTwoReady, setPlayerTwoReady] = useState(false)
	const [gameHasStarted, setGameHasStarted] = useState(false)
	const [gameHasEnded, setGameHasEnded] = useState(false)
	const [winner, setWinner] = useState()

	const [turn, setTurn] = useState()
	const [board, setBoard] = useState([
		['', '', ''],
		['', '', ''],
		['', '', ''],
	])

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
		if (turn !== 'X') { return }
		if (!canMarkCell(x, y)) { return }

		board[x][y] = 'X'
		setBoard([...board])
	}, [board, turn, canMarkCell])

	const selectNoughtOnCell = useCallback(function selectNoughtOnCell(x, y) {
		if (turn !== 'O') { return }
		if (!canMarkCell(x, y)) { return }

		board[x][y] = 'O'
		setBoard([...board])
	}, [board, turn, canMarkCell])

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
	}
}
