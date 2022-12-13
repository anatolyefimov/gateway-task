import React, { useMemo, useState } from 'react';

import { Link as RouterLink } from 'react-router-dom';
import { Link } from '@mui/material';

import { Device } from '@gateways-types';

import { paths } from '@/router';

import './DevicesGridCell.css';

const maxDevicesAmount = 2;

type DevicesGridCellProps = {
	devices: Device[];
};

const DevicesGridCell: React.FC<DevicesGridCellProps> = ({ devices }) => {
	const [expanded, setExpanded] = useState(false);

	const devicesToRender = useMemo(
		() => (expanded ? devices : devices.slice(0, maxDevicesAmount)),
		[expanded, devices]
	);

	return (
		<ul className="devices-grid-cell">
			{devicesToRender.map((device) => (
				<li key={device._id}>
					<RouterLink
						className="devices-grid-cell__link"
						to={paths.devicesWithId.replace(':id', device._id)}
					>
						<span className="devices-grid-cell__vendor">{device.vendor}</span> (
						{device._id})
					</RouterLink>
				</li>
			))}
			{devices.length > maxDevicesAmount && (
				<Link
					type="button"
					component="button"
					sx={{ fontSize: 'inherit' }}
					onClick={() => setExpanded(!expanded)}
				>
					{expanded ? 'view less' : 'view more'}
				</Link>
			)}
		</ul>
	);
};

export default DevicesGridCell;
