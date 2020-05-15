import React from 'react'
import PropTypes from 'prop-types'


import { Table } from 'react-bootstrap'


function Board({ board, select }) {
	return <Table bordered>
		<tbody>
			{board.map((row, i) => <tr key={i}>
				{row.map((cell, j) => <td
					onClick={() => select(i, j)} key={j}>
					{cell}
				</td>)}
			</tr>)}
		</tbody>
	</Table>
}


Board.propTypes = {
	board: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
	select: PropTypes.func.isRequired,
}


export default Board
