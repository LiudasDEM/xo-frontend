import React from 'react'
import PropTypes from 'prop-types'


import { Table } from 'react-bootstrap'


function Board({ board, symbol, select }) {
	return <Table>
		<tbody>
			{board.map((row, i) => <tr key={i}>
				{row.map((cell, j) => <td
					onClick={() => select(i, j)} style={{ color: cell && symbol && (cell === symbol ? 'green' : 'red') }} key={j}>
					{cell ? cell : '[]'}
				</td>)}
			</tr>)}
		</tbody>
	</Table>
}


Board.propTypes = {
	board: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
	symbol: PropTypes.oneOf(['X', 'O']),
	select: PropTypes.func.isRequired,
}


export default Board
