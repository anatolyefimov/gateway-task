import express, { Router } from 'express';

import { devicesRouter } from './services/devices';
import { gatewaysRouter } from './services/gateways';

const router: Router = express.Router();

router.use('/gateways', gatewaysRouter);
router.use('/devices', devicesRouter);

export default router;
