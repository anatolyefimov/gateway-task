export type Gateway = {
	_id: string
	serialNumber: string
	name: string;
	ipV4: string;
	devices: Device[]
};

export type Device = {
	_id: string
	vendor: string;
	createdAt: string;
	isOnline: boolean
};
