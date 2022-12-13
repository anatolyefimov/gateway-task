import { Document } from 'mongoose';

import { Device, Gateway } from '@gateway-types';

import { DeviceModel } from './models/device';
import { GatewayModel } from './models/gateway';

const generateSerialNumber = (length: number) => {
	let result = '';
	const characters =
		'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	const charactersLength = characters.length;
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
};

const getRandomSubsequence = (array: Document[]) => {
	array.sort(() => 0.5 - Math.random());

	const n = Math.min(Math.floor(Math.random() * array.length + 1), 10);

	return array.slice(0, n);
};

const devices: Omit<Device, '_id' | 'uid' | 'createdAt'>[] = [
	...Array(15).keys(),
].map((index) => ({
	vendor: `Vendor: ${index}`,
	isOnline: Boolean(Math.floor(Math.random() * 2)),
}));

export const seedDatabase = async () => {
	try {
		const deviceDocs = await DeviceModel.insertMany(devices);

		const gateways: Omit<Gateway, '_id'>[] = [...Array(50).keys()].map(
			(index) => ({
				serialNumber: generateSerialNumber(12),
				name: `Gateway: ${index}`,
				ipV4: '111.111.111.111',
				devices: getRandomSubsequence(deviceDocs).map((doc) => doc._id),
			})
		);

		await GatewayModel.insertMany(gateways);
	} catch (error) {
		console.error(`Seeding databse error: ${error}`);
	}
};
