import { AxiosResponse } from 'axios';

import {
	CreateGatewayRequest,
	CreateGatewayResponse,
	DeleteGatewayResponse,
	GetGatewayResponse,
	GetGatewaysListResponse,
	PatchGatewayRequest,
	PatchGatewayResponse,
} from '@gateways-types';

import { axios } from './axios';

const baseUrl = '/gateways';

export const getList = async () => {
	return axios.get<GetGatewaysListResponse>(baseUrl);
};

export const getItem = async (id: string) => {
	return axios.get<GetGatewayResponse>(`${baseUrl}/${id}`);
};

export const createItem = async (data: CreateGatewayRequest) => {
	return axios.post<CreateGatewayResponse>(baseUrl, data);
};

export const patchItem = async (id: string, data: PatchGatewayRequest) => {
	return axios.patch<PatchGatewayResponse>(`${baseUrl}/${id}`, data);
};

export const deleteItem = async (id: string) => {
	return axios.delete<DeleteGatewayResponse>(`${baseUrl}/${id}`);
};
