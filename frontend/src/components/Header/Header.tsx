import React from 'react';

import { Link } from 'react-router-dom';
import { Box, Tab, Tabs } from '@mui/material';

import { paths, useRouteMatch } from '@/router';

const Header: React.FC = () => {
	const routeMatch = useRouteMatch([
		paths.gatewaysWithId,
		paths.gateways,
		paths.devices,
	]);

	const currentTab = routeMatch?.pattern?.path.startsWith(paths.gateways)
		? paths.gateways
		: paths.devices;

	return (
		<header>
			<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
				<Tabs centered value={currentTab}>
					<Tab
						label="Gateways"
						value={paths.gateways}
						to={paths.gateways}
						component={Link}
					/>
					<Tab
						label="Devices"
						value={paths.devices}
						to={paths.devices}
						component={Link}
					/>
				</Tabs>
			</Box>
		</header>
	);
};

export default Header;
