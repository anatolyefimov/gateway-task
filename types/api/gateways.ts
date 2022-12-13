import type { Gateway } from '../entities';

export type GetGatewaysListRequest = Record<string, never>;

export type GetGatewaysListResponse = Gateway[];

export type GetGatewaysListParams = Record<string, never>;

export type GetGatewayRequest = Record<string, never>;

export type GetGatewayResponse = Gateway;

export type GetGatewayParams = { id: string };

export type CreateGatewayRequest = Partial<
	Omit<Gateway, 'devices'> & { devices: string[] }
>;

export type CreateGatewayResponse = Gateway;

export type CreateGatewayParams = Record<string, never>;

export type PatchGatewayRequest = Partial<
	Omit<Gateway, 'devices'> & { devices: string[] }
>;

export type PatchGatewayResponse = Gateway;

export type PatchGatewayParams = { id: string };

export type DeleteGatewayRequest = Record<string, never>;

export type DeleteGatewayResponse = Gateway;

export type DeleteGatewayParams = { id: string };
