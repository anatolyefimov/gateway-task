import React, { useCallback } from 'react';

import classNames from 'classnames';
import {
	FieldValues,
	SubmitHandler,
	UseFormReturn,
	UseFormSetError,
} from 'react-hook-form';

import { isApiError } from '@/api';

import './Form.css';

export type FormProps<T extends FieldValues> = React.PropsWithChildren<{
	useFormSetError: UseFormReturn<T>['setError'];
	useFormHandleSubmit: UseFormReturn<T>['handleSubmit'];
	onSubmit: SubmitHandler<T>;
	onSubmitError?: (error: unknown) => void;
	isLoading?: boolean;
	className?: string;
}>;

function getFormErrorSetter<T extends FieldValues>(
	setError: UseFormSetError<T>
) {
	return (error: unknown) => {
		if (isApiError(error)) {
			error.response?.data.fieldErrors?.forEach(({ field, message }) => {
				setError(field, { message }, { shouldFocus: true });
			});
		}
	};
}

function Form<T extends FieldValues>({
	useFormSetError,
	useFormHandleSubmit,
	onSubmit,
	onSubmitError,
	children,
	className = '',
}: FormProps<T>) {
	const submitHandler: SubmitHandler<T> = useCallback(
		async (data) => {
			if (!onSubmit) {
				return;
			}

			try {
				await onSubmit(data);
			} catch (error) {
				if (onSubmitError) {
					onSubmitError(error);
				}
				getFormErrorSetter<T>(useFormSetError)(error);
			}
		},
		[onSubmit, onSubmitError, useFormSetError]
	);

	return (
		<form
			onSubmit={useFormHandleSubmit(submitHandler)}
			className={classNames('form', className)}
		>
			{children}
		</form>
	);
}

export default Form;
