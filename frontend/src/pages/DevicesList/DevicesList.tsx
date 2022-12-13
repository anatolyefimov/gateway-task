import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { Link } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { IconButton } from '@mui/material';
import { DataGrid, GridColumns, GridRowIdGetter } from '@mui/x-data-grid';

import { Device } from '@gateways-types';

import { devicesApi } from '@/api';
import StatusBadge from '@/components/StatusBadge';
import { paths } from '@/router';

import GridToolbar from './GridToolbar';

const DevicesList: React.FC = () => {
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [devices, setDevices] = useState<Device[]>([]);

	useEffect(() => {
		async function getData() {
			const { data } = await devicesApi.getList();

			setDevices(data);
		}

		getData()
			.catch((error) => {
				console.error(error);
			})
			.finally(() => setIsLoading(false));
	}, []);

	const getRowId: GridRowIdGetter<Device> = useCallback(({ _id }) => _id, []);

	const columns: GridColumns<Device> = useMemo(
		() => [
			{
				field: '_id',
				headerName: 'UID',
				sortable: false,
				width: 250,
			},
			{ field: 'vendor', headerName: 'Vendor', sortable: false, flex: 1 },
			{
				field: 'createdAt',
				type: 'dateTime',
				headerName: 'Creation Date',
				valueGetter: ({ value }) => value && new Date(value),
				sortable: false,
				width: 180,
			},
			{
				field: 'status',
				headerName: 'Status',
				renderCell: (params) => <StatusBadge isOnline={params.row.isOnline} />,
				sortable: false,
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
								const { data: deletedDevice } = await devicesApi.deleteItem(
									String(params.id)
								);
								setDevices((devices) =>
									devices.filter((device) => device._id !== deletedDevice._id)
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
						to={paths.devicesWithId.replace(':id', String(params.id))}
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
		<main className="main">
			<DataGrid<Device>
				columns={columns}
				rows={devices}
				getRowId={getRowId}
				disableColumnMenu
				disableSelectionOnClick
				loading={isLoading}
				components={{
					Toolbar: GridToolbar,
				}}
			/>
		</main>
	);
};

export default React.memo(DevicesList);
