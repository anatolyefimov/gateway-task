import { MongoMemoryServer } from 'mongodb-memory-server';
import * as mongoose from 'mongoose';

import config from '../config';

import { deviceSchema } from './models/device';

let mongod: MongoMemoryServer | null = null;

const connect = async () => {
	mongod = await MongoMemoryServer.create({ instance: { dbPath: './' } });

	const uri = mongod.getUri();

	await mongoose.connect(uri, { dbName: config.dbName });

	console.log(`Successful connection to the database ${uri}`);
};

const disconnect = async () => {
	await mongoose.disconnect();
	await mongod?.stop();
};

export default { connect, disconnect };
