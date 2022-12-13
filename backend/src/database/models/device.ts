import { model, Schema } from 'mongoose';

import { Device } from '@gateway-types';

export const deviceSchema = new Schema<Device>(
	{
		vendor: { type: String },
		isOnline: { type: Boolean, required: true },
	},
	{ timestamps: true }
);

export const DeviceModel = model<Device>('Device', deviceSchema);
