import React from 'react';

import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { render, waitForElementToBeRemoved } from '@testing-library/react';

import '@testing-library/jest-dom';

import { routes } from '@/router';

test('renders app layout', () => {
	const router = createMemoryRouter(routes);

	const { getByTestId, getByRole } = render(<RouterProvider router={router} />);

	const header = getByTestId('header');
	const main = getByTestId('gateways-grid');

	waitForElementToBeRemoved(() => getByRole('progressbar'));

	expect(header).toBeInTheDocument();
	expect(main).toBeInTheDocument();
});
