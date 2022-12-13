import type { Device } from '../entities';

export type GetDevicesListRequest = Record<string, never>;

export type GetDevicesListResponse = Device[];

export type GetDevicesListParams = Record<string, never>;

export type GetDeviceRequest = Record<string, never>;

export type GetDeviceResponse = Device;

export type GetDeviceParams = { id: string };

export type CreateDeviceRequest = Partial<Pick<Device, 'vendor' | 'isOnline'>>;

export type CreateDeviceResponse = Device;

export type CreateDeviceParams = Record<string, never>;

export type PatchDeviceRequest = Partial<Pick<Device, 'vendor' | 'isOnline'>>;

export type PatchDeviceResponse = Device;

export type PatchDeviceParams = { id: string };

export type DeleteDeviceRequest = Record<string, never>;

export type DeleteDeviceResponse = Device;

export type DeleteDeviceParams = { id: string };
