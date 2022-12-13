import { RequestHandler } from 'express';
import { body } from 'express-validator';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import type {
	CreateDeviceParams,
	CreateDeviceRequest,
	CreateDeviceResponse,
	DeleteDeviceParams,
	DeleteDeviceRequest,
	DeleteDeviceResponse,
	GetDeviceParams,
	GetDeviceRequest,
	GetDeviceResponse,
	GetDevicesListParams,
	GetDevicesListRequest,
	GetDevicesListResponse,
	PatchDeviceParams,
	PatchDeviceRequest,
	PatchDeviceResponse,
} from '@gateway-types';

import { DeviceModel } from '../../database/models/device';
import { ResponseOrError } from '../../types';
import { errorMessages, validateMiddleware } from '../../utils/validation';

export const getDevicesList: RequestHandler<
	GetDevicesListParams,
	ResponseOrError<GetDevicesListResponse>,
	GetDevicesListRequest
> = async (req, res) => {
	try {
		const devices = await DeviceModel.find({}).exec();

		return res.status(StatusCodes.OK).send(devices);
	} catch (error) {
		console.error(error);
		return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
	}
};

export const getDevice: RequestHandler<
	GetDeviceParams,
	ResponseOrError<GetDeviceResponse>,
	GetDeviceRequest
> = async (req, res) => {
	try {
		if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
			return res
				.status(StatusCodes.NOT_FOUND)
				.send({ message: errorMessages.notFound('Device') });
		}

		const device = await DeviceModel.findById(req.params.id).exec();

		if (!device) {
			return res
				.status(StatusCodes.NOT_FOUND)
				.send({ message: errorMessages.notFound('Device') });
		}

		return res.status(StatusCodes.OK).send(device);
	} catch (error) {
		console.error(error);
		return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
	}
};

const deviceValidationChains = [
	body('vendor').notEmpty().withMessage(errorMessages.required('Vendor')),
];

const createDeviceHandler: RequestHandler<
	CreateDeviceParams,
	ResponseOrError<CreateDeviceResponse>,
	CreateDeviceRequest
> = async (req, res) => {
	try {
		const newDevice = await DeviceModel.create(req.body);

		res.status(StatusCodes.OK).send(newDevice);
	} catch (error) {
		console.error(error);
		return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
	}
};
export const createDevice = [
	validateMiddleware(deviceValidationChains),
	createDeviceHandler,
];

const patchDeviceHandler: RequestHandler<
	PatchDeviceParams,
	ResponseOrError<PatchDeviceResponse>,
	PatchDeviceRequest
> = async (req, res) => {
	try {
		const patchData = req.body;
		const newDevice = await DeviceModel.findByIdAndUpdate(
			req.params.id,
			patchData,
			{ new: true }
		).exec();

		if (!newDevice) {
			return res
				.status(StatusCodes.NOT_FOUND)
				.send({ message: errorMessages.notFound('Device') });
		}

		res.status(StatusCodes.OK).send(newDevice);
	} catch (error) {
		console.error(error);
		return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
	}
};
export const patchDevice = [
	validateMiddleware(deviceValidationChains),
	patchDeviceHandler,
];

export const deleteDevice: RequestHandler<
	DeleteDeviceParams,
	ResponseOrError<DeleteDeviceResponse>,
	DeleteDeviceRequest
> = async (req, res) => {
	try {
		const deletedDevice = await DeviceModel.findByIdAndDelete(
			req.params.id
		).exec();

		if (!deletedDevice) {
			return res
				.status(StatusCodes.NOT_FOUND)
				.send({ message: errorMessages.notFound('Device') });
		}

		res.status(StatusCodes.OK).send(deletedDevice);
	} catch (error) {
		console.error(error);
		return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
	}
};
