export * from './devices';
export * from './gateways';

export type FieldError<T = string> = { field: T; message: string };

export type ErrorResponse<T = string> = {
	fieldErrors?: FieldError<T>[];
	message?: string;
};

export type ResponseOrError<T, F = string> = T | ErrorResponse<F>;
