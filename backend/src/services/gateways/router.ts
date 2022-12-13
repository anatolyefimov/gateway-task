import express, { Router } from 'express';

import * as controller from './controller';

const router: Router = express.Router();

router.get('/', controller.getGatewaysList);
router.get('/:id', controller.getGateway);
router.post('/', controller.createGateway);
router.patch('/:id', controller.patchGateway);
router.delete('/:id', controller.deleteGateway);

export default router;
