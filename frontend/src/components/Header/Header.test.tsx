import React from 'react';

import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { fireEvent, render } from '@testing-library/react';

import '@testing-library/jest-dom';

import { paths } from '@/router';

import Header from './Header';

test('header navigation', async () => {
	const router = createMemoryRouter(
		[
			{
				path: paths.index,
				element: <Header />,
				children: [
					{
						path: paths.gateways,
						element: <></>,
					},
					{
						path: paths.devices,
						element: <></>,
					},
				],
			},
		],
		{
			initialEntries: [paths.index],
		}
	);

	const { getByTestId } = render(<RouterProvider router={router} />);

	const gatewaysLink = getByTestId('gateways-link');
	const devicesLink = getByTestId('devices-link');

	fireEvent.click(gatewaysLink);
	expect(gatewaysLink.getAttribute('aria-selected')).toBe('true');

	fireEvent.click(devicesLink);
	expect(devicesLink.getAttribute('aria-selected')).toBe('true');
});
