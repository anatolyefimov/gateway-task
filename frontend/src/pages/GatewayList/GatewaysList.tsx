import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { Link } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { IconButton } from '@mui/material';
import { DataGrid, GridColumns, GridRowIdGetter } from '@mui/x-data-grid';

import { Gateway } from '@gateways-types';

import { gatewaysApi } from '@/api';
import { paths } from '@/router';

import DevicesGridCell from './DevicesGridCell';
import GridToolbar from './GridToolbar';

const GatewaysList: React.FC = () => {
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [gateways, setGateways] = useState<Gateway[]>([]);

	useEffect(() => {
		async function getData() {
			const { data } = await gatewaysApi.getList();

			setGateways(data);
		}

		getData()
			.catch((error) => {
				console.error(error);
			})
			.finally(() => setIsLoading(false));
	}, []);

	const getRowId: GridRowIdGetter<Gateway> = useCallback(({ _id }) => _id, []);

	const columns: GridColumns<Gateway> = useMemo(
		() => [
			{
				field: 'serialNumber',
				headerName: 'Serial Number',
				sortable: false,
				width: 150,
			},
			{ field: 'name', headerName: 'Name', sortable: false, flex: 1 },
			{ field: 'ipV4', headerName: 'IP Address', sortable: false, width: 150 },
			{
				field: 'devices',
				headerName: 'Devices',
				renderCell: (params) => (
					<DevicesGridCell devices={params.row.devices} />
				),
				sortable: false,
				width: 400,
			},
			{
				field: 'actions',
				type: 'actions',
				getActions: (params) => [
					<IconButton
						key="delete"
						onClick={async () => {
							try {
								setIsLoading(true);
								const { data: deletedGateway } = await gatewaysApi.deleteItem(
									String(params.id)
								);
								setGateways((gateways) =>
									gateways.filter(
										(gateway) => gateway._id !== deletedGateway._id
									)
								);
							} catch (error) {
								console.error(error);
							} finally {
								setIsLoading(false);
							}
						}}
					>
						<DeleteIcon />
					</IconButton>,
					<IconButton
						component={Link}
						to={paths.gatewaysWithId.replace(':id', String(params.id))}
						key="edit"
					>
						<EditIcon />
					</IconButton>,
				],
			},
		],
		[]
	);

	return (
		<main className="main" data-testid="gateways-grid">
			<DataGrid<Gateway>
				columns={columns}
				rows={gateways}
				getRowId={getRowId}
				getRowHeight={() => 'auto'}
				disableColumnMenu
				disableSelectionOnClick
				sx={{
					'& .MuiDataGrid-cellContent': {
						overflow: 'hidden',
						textOverflow: 'ellipsis',
						whiteSpace: 'nowrap',
					},
				}}
				loading={isLoading}
				components={{
					Toolbar: GridToolbar,
				}}
			/>
		</main>
	);
};

export default React.memo(GatewaysList);
