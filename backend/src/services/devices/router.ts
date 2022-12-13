import express, { Router } from 'express';

import * as controller from './controller';

const router: Router = express.Router();

router.get('/', controller.getDevicesList);
router.get('/:id', controller.getDevice);
router.post('/', controller.createDevice);
router.patch('/:id', controller.patchDevice);
router.delete('/:id', controller.deleteDevice);

export default router;
