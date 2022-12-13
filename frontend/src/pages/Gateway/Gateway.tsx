import React, { useCallback, useEffect, useState } from 'react';

import classNames from 'classnames';
import { StatusCodes } from 'http-status-codes';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import LoadingButton from '@mui/lab/LoadingButton';
import { Button, TextField } from '@mui/material';

import { gatewaysApi } from '@/api';
import DevicesSelect from '@/components/DevicesSelect';
import Form, { FormProps } from '@/components/Form';
import Loading from '@/components/Loading';
import { newItemId, paths } from '@/router';

type GatewayForm = {
	serialNumber: string;
	name: string;
	ipV4: string;
	devices: string[];
};

const defaultValues: GatewayForm = {
	serialNumber: '',
	name: '',
	ipV4: '',
	devices: [],
};

const Gateway: React.FC = () => {
	const [isFetching, setIsFetching] = useState(true);
	const [isSending, setIsSending] = useState(false);

	const { id } = useParams();

	const navigate = useNavigate();

	const {
		control,
		reset,
		formState: { errors },
		...useFormMethods
	} = useForm<GatewayForm>({
		defaultValues,
	});

	useEffect(() => {
		async function setInitialFormValues() {
			if (id !== newItemId) {
				const { data } = await gatewaysApi.getItem(String(id));

				const { serialNumber, name, ipV4, devices } = data;

				const initialFormValues: GatewayForm = {
					serialNumber,
					name,
					ipV4,
					devices: devices.map((device) => device._id),
				};
				reset(initialFormValues);
			}
			setIsFetching(false);
		}

		setInitialFormValues().catch((error) => {
			console.error(error);

			setIsFetching(false);

			if (error.response.status === StatusCodes.NOT_FOUND) {
				navigate(paths.gateways);
			}
		});
	}, [navigate, id, reset]);

	const handleSubmit: FormProps<GatewayForm>['onSubmit'] = useCallback(
		async (formData) => {
			setIsSending(true);

			if (id === newItemId) {
				const { data: newGateway } = await gatewaysApi.createItem(formData);

				setIsSending(false);

				navigate(paths.gatewaysWithId.replace(':id', newGateway._id));
			} else {
				const {
					data: { serialNumber, name, ipV4, devices },
				} = await gatewaysApi.patchItem(String(id), formData);

				reset({
					serialNumber,
					name,
					ipV4,
					devices: devices.map((device) => device._id),
				});

				setIsSending(false);
			}
		},
		[navigate, id, reset]
	);

	const handleSubmitError: FormProps<GatewayForm>['onSubmitError'] =
		useCallback((error: unknown) => {
			console.error(error);

			setIsSending(false);
		}, []);

	return (
		<main className={classNames('main', 'main--centered')}>
			{isFetching && <Loading />}
			<Form<GatewayForm>
				useFormHandleSubmit={useFormMethods.handleSubmit}
				useFormSetError={useFormMethods.setError}
				onSubmit={handleSubmit}
				onSubmitError={handleSubmitError}
			>
				<Controller
					control={control}
					name="serialNumber"
					render={({ field }) => (
						<TextField
							label="Serial Number"
							error={Boolean(errors.serialNumber?.message)}
							helperText={errors.serialNumber?.message}
							InputProps={{
								spellCheck: false,
							}}
							disabled={isSending}
							{...field}
						/>
					)}
				/>
				<Controller
					control={control}
					name="name"
					render={({ field }) => (
						<TextField
							label="Name"
							error={Boolean(errors.name?.message)}
							helperText={errors.name?.message}
							disabled={isSending}
							{...field}
						/>
					)}
				/>
				<Controller
					control={control}
					name="ipV4"
					render={({ field }) => (
						<TextField
							label="IP address"
							error={Boolean(errors.ipV4?.message)}
							helperText={errors.ipV4?.message}
							disabled={isSending}
							{...field}
						/>
					)}
				/>
				<Controller
					control={control}
					name="devices"
					render={({ field }) => (
						<DevicesSelect
							label="Devices"
							error={Boolean(errors.devices?.message)}
							helperText={errors.devices?.message}
							disabled={isSending}
							{...field}
						/>
					)}
				/>

				<LoadingButton
					type="submit"
					variant="outlined"
					size="large"
					loading={isSending}
				>
					Submit
				</LoadingButton>
			</Form>
		</main>
	);
};

export default Gateway;
