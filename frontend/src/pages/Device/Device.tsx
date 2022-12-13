import React, { useCallback, useEffect, useState } from 'react';

import classNames from 'classnames';
import { StatusCodes } from 'http-status-codes';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import LoadingButton from '@mui/lab/LoadingButton';
import { Button, Stack, Switch, TextField, Typography } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { devicesApi, gatewaysApi } from '@/api';
import Form, { FormProps } from '@/components/Form';
import Loading from '@/components/Loading';
import { newItemId, paths } from '@/router';

type DeviceForm = {
	uid: string;
	vendor: string;
	createdAt: string;
	isOnline: boolean;
};

const defaultValues: DeviceForm = {
	uid: '',
	vendor: '',
	isOnline: false,
	createdAt: '',
};

const Device: React.FC = () => {
	const [isFetching, setIsFetching] = useState(true);
	const [isSending, setIsSending] = useState(false);

	const { id } = useParams();

	const navigate = useNavigate();

	const {
		control,
		reset,
		formState: { errors },
		...useFormMethods
	} = useForm<DeviceForm>({
		defaultValues,
	});

	useEffect(() => {
		async function setInitialFormValues() {
			setIsFetching(true);
			if (id !== newItemId) {
				const { data } = await devicesApi.getItem(String(id));

				const { _id, vendor, isOnline, createdAt } = data;

				const initialFormValues: DeviceForm = {
					uid: _id,
					createdAt,
					vendor,
					isOnline,
				};

				reset(initialFormValues);
			}

			setIsFetching(false);
		}

		setInitialFormValues().catch((error) => {
			setIsFetching(false);

			if (error.response.status === StatusCodes.NOT_FOUND) {
				navigate(paths.devices);
			}

			console.error(error);
		});
	}, [navigate, id, reset]);

	const handleSubmit: FormProps<DeviceForm>['onSubmit'] = useCallback(
		async (formData) => {
			setIsSending(true);
			if (id === newItemId) {
				const { data: newDevice } = await devicesApi.createItem(formData);

				setIsSending(false);

				navigate(paths.devicesWithId.replace(':id', newDevice._id));
			} else {
				const {
					data: { vendor, isOnline },
				} = await devicesApi.patchItem(String(id), {
					vendor: formData.vendor,
					isOnline: formData.isOnline,
				});

				reset((formValues) => ({
					...formValues,
					vendor,
					isOnline,
				}));

				setIsSending(false);
			}
		},
		[navigate, id, reset]
	);

	const handleSubmitError: FormProps<DeviceForm>['onSubmitError'] = useCallback(
		(error: unknown) => {
			setIsSending(false);
			console.error(error);
		},
		[]
	);

	return (
		<main className={classNames('main', 'main--centered')}>
			{isFetching && <Loading />}
			<LocalizationProvider dateAdapter={AdapterDayjs}>
				<Form<DeviceForm>
					useFormHandleSubmit={useFormMethods.handleSubmit}
					useFormSetError={useFormMethods.setError}
					onSubmit={handleSubmit}
					onSubmitError={handleSubmitError}
				>
					{id !== newItemId && (
						<>
							<Controller
								control={control}
								name="uid"
								render={({ field: { value } }) => (
									<TextField
										value={value}
										label="UID"
										InputProps={{ spellCheck: 'false' }}
										disabled={isSending}
									/>
								)}
							/>
							<Controller
								control={control}
								name="createdAt"
								render={({ field }) => (
									<DateTimePicker
										label="Creation Date"
										readOnly
										disabled={isSending}
										renderInput={(params) => (
											<TextField {...params} error={false} />
										)}
										{...field}
									/>
								)}
							/>
						</>
					)}

					<Controller
						control={control}
						name="vendor"
						render={({ field }) => (
							<TextField
								label="Vendor"
								error={Boolean(errors.vendor?.message)}
								helperText={errors.vendor?.message}
								disabled={isSending}
								{...field}
							/>
						)}
					/>

					<Stack direction="row" spacing={1} alignItems="center">
						<Typography>Offline</Typography>
						<Controller
							control={control}
							name="isOnline"
							render={({ field: { value, ...restField } }) => (
								<Switch checked={value} disabled={isSending} {...restField} />
							)}
						/>

						<Typography>Online</Typography>
					</Stack>

					<LoadingButton
						type="submit"
						variant="outlined"
						size="large"
						loading={isSending}
					>
						Submit
					</LoadingButton>
				</Form>
			</LocalizationProvider>
		</main>
	);
};

export default Device;
