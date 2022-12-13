import { RequestHandler } from 'express';
import { body, ValidationChain } from 'express-validator';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import type {
	CreateGatewayParams,
	CreateGatewayRequest,
	CreateGatewayResponse,
	DeleteGatewayParams,
	DeleteGatewayRequest,
	DeleteGatewayResponse,
	GetGatewayParams,
	GetGatewayRequest,
	GetGatewayResponse,
	GetGatewaysListParams,
	GetGatewaysListRequest,
	GetGatewaysListResponse,
	PatchGatewayParams,
	PatchGatewayRequest,
	PatchGatewayResponse,
} from '@gateway-types';

import { GatewayModel } from '../../database';
import { ResponseOrError } from '../../types';
import { errorMessages, validateMiddleware } from '../../utils/validation';

export const getGatewaysList: RequestHandler<
	GetGatewaysListParams,
	GetGatewaysListResponse,
	GetGatewaysListRequest
> = async (req, res) => {
	try {
		const gateways = await GatewayModel.find({}).populate('devices').exec();

		return res.status(StatusCodes.OK).send(gateways);
	} catch (error) {
		console.error(error);
		return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
	}
};

export const getGateway: RequestHandler<
	GetGatewayParams,
	ResponseOrError<GetGatewayResponse>,
	GetGatewayRequest
> = async (req, res) => {
	try {
		if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
			return res
				.status(StatusCodes.NOT_FOUND)
				.send({ message: errorMessages.notFound('Gateway') });
		}

		const gateway = await GatewayModel.findById(req.params.id)
			.populate('devices')
			.exec();

		if (!gateway) {
			return res
				.status(StatusCodes.NOT_FOUND)
				.send({ message: errorMessages.notFound('Gateway') });
		}

		return res.status(StatusCodes.OK).send(gateway);
	} catch (error) {
		console.error(error);
		return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
	}
};

const gatewayValidationChains: ValidationChain[] = [
	body('serialNumber')
		.notEmpty()
		.withMessage(errorMessages.required('Serial number')),
	body('name').notEmpty().withMessage(errorMessages.required('Name')),
	body('ipV4')
		.optional()
		.isIP(4)
		.withMessage(errorMessages.invalidFormat('IP address')),
	body('devices')
		.custom((devices) => Array.isArray(devices) && devices.length <= 10)
		.withMessage('Gateway can contain no more than 10 devices'),
];

const createGatewayHandler: RequestHandler<
	CreateGatewayParams,
	ResponseOrError<CreateGatewayResponse>,
	CreateGatewayRequest
> = async (req, res) => {
	try {
		if (req.body.serialNumber) {
			const gatewayBySerialNumber = await GatewayModel.findOne({
				serialNumber: req.body.serialNumber,
			}).exec();

			if (gatewayBySerialNumber) {
				return res.status(StatusCodes.CONFLICT).send({
					fieldErrors: [
						{
							field: 'serialNumber',
							message: 'Gateway with this Serial Number already exists',
						},
					],
				});
			}
		}

		const newGateway = await GatewayModel.create(req.body);

		return res.status(StatusCodes.OK).send(newGateway);
	} catch (error) {
		console.error(error);
		return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
	}
};
export const createGateway = [
	validateMiddleware(gatewayValidationChains),
	createGatewayHandler,
];

const patchGatewayHandler: RequestHandler<
	PatchGatewayParams,
	ResponseOrError<PatchGatewayResponse>,
	PatchGatewayRequest
> = async (req, res) => {
	try {
		const patchData = req.body;

		if (patchData.serialNumber) {
			const gatewayBySerialNumber = await GatewayModel.findOne({
				serialNumber: patchData.serialNumber,
			}).exec();

			if (
				gatewayBySerialNumber &&
				gatewayBySerialNumber._id.toString() !== req.params.id
			) {
				return res.status(StatusCodes.CONFLICT).send({
					fieldErrors: [
						{
							field: 'serialNumber',
							message: 'Gateway with this Serial Number already exists',
						},
					],
				});
			}
		}

		const newGateway = await GatewayModel.findByIdAndUpdate(
			req.params.id,
			patchData,
			{ new: true }
		)
			.populate('devices')
			.exec();

		if (!newGateway) {
			return res
				.status(StatusCodes.NOT_FOUND)
				.send({ message: errorMessages.notFound('Gateway') });
		}

		res.status(StatusCodes.OK).send(newGateway);
	} catch (error) {
		console.error(error);
		return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
	}
};
export const patchGateway = [
	validateMiddleware(gatewayValidationChains),
	patchGatewayHandler,
];

export const deleteGateway: RequestHandler<
	DeleteGatewayParams,
	ResponseOrError<DeleteGatewayResponse>,
	DeleteGatewayRequest
> = async (req, res) => {
	try {
		const deletedGateway = await GatewayModel.findByIdAndDelete(
			req.params.id
		).exec();

		if (!deletedGateway) {
			return res
				.status(StatusCodes.NOT_FOUND)
				.send({ message: errorMessages.notFound('Gateway') });
		}

		res.status(StatusCodes.OK).send(deletedGateway);
	} catch (error) {
		console.error(error);
		return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
	}
};
