import express from 'express';
import {
	ValidationChain,
	ValidationError as ExpressValidationError,
	validationResult,
} from 'express-validator';
import StatusCodes from 'http-status-codes';

import { FieldError } from '@gateway-types';

export const validateMiddleware = (
	validations: ValidationChain[]
): express.Handler => {
	return async (
		req: express.Request,
		res: express.Response,
		next: express.NextFunction
	) => {
		await Promise.all(validations.map((validation) => validation.run(req)));

		const errors = validationResult(req).formatWith(formatExpressError);

		if (errors.isEmpty()) {
			return next();
		}

		res
			.status(StatusCodes.UNPROCESSABLE_ENTITY)
			.json({ fieldErrors: errors.array() });
	};
};

const formatExpressError = ({
	param,
	msg,
}: ExpressValidationError): FieldError => {
	return {
		field: param,
		message: msg,
	};
};

export const errorMessages = {
	required: (fieldName: string): string => `${fieldName} is required`,
	invalidFormat: (fieldName: string): string =>
		`${fieldName} is in an invalid format`,
	notFound: (fieldName: string): string => `${fieldName} not found`,
};
