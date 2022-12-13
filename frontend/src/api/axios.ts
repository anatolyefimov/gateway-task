import Axios, { AxiosError } from 'axios';
import { Path } from 'react-hook-form';

import { ErrorResponse } from '@gateways-types';

const baseURL =
	process.env.REACT_APP_BACKEND_URL || 'http://localhost:8080/api';

export const axios = Axios.create({
	baseURL,
});

export function isApiError<T>(
	error: unknown
): error is AxiosError<ErrorResponse<Path<T>>> {
	return Boolean(error) && Axios.isAxiosError(error);
}
