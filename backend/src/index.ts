import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import { StatusCodes } from 'http-status-codes';

import 'dotenv/config';

import config from './config';
import db, { seedDatabase } from './database';
import router from './router';

const app = express();

app.use(bodyParser.json());

app.use(cors({ origin: true, credentials: true }));

db.connect()
	.then(() => seedDatabase())
	.then(() => {
		app.listen(config.port, () => {
			console.log(`Listening on port ${config.port}`);
		});
	})
	.catch((error) => {
		console.log(`Error connecting to database: ${error}`);
	});

const baseUrl = '/api';
app.use(baseUrl, router);

app.get('/', (req: express.Request, res: express.Response) => {
	return res.status(StatusCodes.OK).send('Successful health check.');
});
