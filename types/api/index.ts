export * from './gateways'
export * from  './devices'

export type FieldError<T = string> = { field: T; message: string };

export type ErrorResponse<T = string> = {
	fieldErrors?: FieldError<T>[];
	message?: string;
};

export type ResponseOrError<T, F = string> = T | ErrorResponse<F>;
