import React, { useEffect, useState } from 'react';

import {
	FormControl,
	FormControlProps,
	FormHelperText,
	InputLabel,
	MenuItem,
	Select,
	SelectProps,
	TextFieldProps,
} from '@mui/material';

import { Device } from '@gateways-types';

import { devicesApi } from '@/api';

const MenuProps: SelectProps['MenuProps'] = {
	PaperProps: {
		style: {
			maxHeight: 300,
		},
	},
};

type DeviceSelectProps = SelectProps<string[]> &
	Pick<FormControlProps, 'error'> &
	Pick<TextFieldProps, 'helperText'>;

const DevicesSelect = React.forwardRef<SelectProps['ref'], DeviceSelectProps>(
	({ value = [], label, error = false, helperText, ...restProps }, ref) => {
		const [devices, setDevices] = useState<Device[]>([]);

		useEffect(() => {
			async function getData() {
				const { data } = await devicesApi.getList();

				setDevices(data);
			}

			getData().catch((error) => {
				console.error(error);
			});
		}, []);

		return (
			<FormControl fullWidth error={error}>
				<InputLabel>{label}</InputLabel>
				<Select
					multiple
					value={value}
					MenuProps={MenuProps}
					label={label}
					{...restProps}
				>
					{devices.map((device) => (
						<MenuItem key={device._id} value={device._id}>
							{device.vendor}
						</MenuItem>
					))}
				</Select>
				<FormHelperText>{helperText}</FormHelperText>
			</FormControl>
		);
	}
);

DevicesSelect.displayName = 'DevicesSelect';
export default DevicesSelect;
