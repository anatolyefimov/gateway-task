import React from 'react';

import { createBrowserRouter, Navigate, RouteObject } from 'react-router-dom';

import App from '@/App';
import Device from '@/pages/Device';
import DevicesList from '@/pages/DevicesList';
import Gateway from '@/pages/Gateway';
import GatewaysList from '@/pages/GatewayList';

export const paths = {
	index: '/',
	gateways: '/gateways',
	gatewaysWithId: '/gateways/:id',
	devices: '/devices',
	devicesWithId: '/devices/:id',
};

export const newItemId = 'new';

export const routes: RouteObject[] = [
	{
		path: paths.index,
		element: <App />,
		children: [
			{
				path: paths.gateways,
				element: <GatewaysList />,
			},
			{
				path: paths.gatewaysWithId,
				element: <Gateway />,
			},
			{ path: paths.devices, element: <DevicesList /> },
			{ path: paths.devicesWithId, element: <Device /> },
			{ path: '/', element: <Navigate to={paths.gateways} /> },
		],
	},
	{ path: '*', element: <Navigate to={paths.gateways} /> },
];

export const router = createBrowserRouter(routes);
