import { AxiosResponse } from 'axios';

import {
	CreateDeviceRequest,
	CreateDeviceResponse,
	DeleteDeviceResponse,
	GetDeviceResponse,
	GetDevicesListResponse,
	PatchDeviceRequest,
	PatchDeviceResponse,
} from '@gateways-types';

import { axios } from './axios';

const baseUrl = '/devices';

export const getList = async (): Promise<
	AxiosResponse<GetDevicesListResponse>
> => {
	return axios.get(baseUrl);
};

export const getItem = async (
	id: string
): Promise<AxiosResponse<GetDeviceResponse>> => {
	return axios.get(`${baseUrl}/${id}`);
};

export const createItem = async (data: CreateDeviceRequest) => {
	return axios.post<CreateDeviceResponse>(baseUrl, data);
};

export const patchItem = async (id: string, data: PatchDeviceRequest) => {
	return axios.patch<PatchDeviceResponse>(`${baseUrl}/${id}`, data);
};

export const deleteItem = async (id: string) => {
	return axios.delete<DeleteDeviceResponse>(`${baseUrl}/${id}`);
};
