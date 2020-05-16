import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

import { Table } from 'react-bootstrap'

function TableComponent({ items, game }) {
	return <Table>
		<thead>
			<tr>
				<td>Date</td>
				<td>Action</td>
				<td>Player</td>
				<td>Row</td>
				<td>Column</td>
				<td>Winner</td>
			</tr>
		</thead>
		<tbody>
			{
				items.length
					? items.map(item => <tr key={item.createdAt}>
						<td>{moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss:ms')}</td>
						<td>{item.action}</td>
						<td>{item.player || 'Game'}</td>
						<td>{(item.action === 'checked' && item.row != null) ? item.row : '-'} </td>
						<td>{(item.action === 'checked' && item.column != null) ? item.column : '-'} </td>
						<td>{item.action === 'finished' ? game.winner : '-'}</td>
					</tr>)
					: <tr><td>No events</td></tr>
			}
		</tbody>
	</Table>
}


TableComponent.propTypes = {
	items: PropTypes.arrayOf(PropTypes.shape({
		action: PropTypes.string.isRequired,
		player: PropTypes.string,
		createdAt: PropTypes.any.isRequired,
		column: PropTypes.number,
		row: PropTypes.number,
	})).isRequired,
	game: PropTypes.shape({ winner: PropTypes.string }),
}


export default TableComponent
