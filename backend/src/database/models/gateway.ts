import { model, Schema } from 'mongoose';

import { Gateway } from '@gateway-types';

const gatewaySchema = new Schema<Gateway>({
	serialNumber: { type: String, required: true },
	name: { type: String, required: true },
	ipV4: { type: String },
	devices: [{ type: Schema.Types.ObjectId, ref: 'Device' }],
});

export const GatewayModel = model<Gateway>('Gateway', gatewaySchema);
