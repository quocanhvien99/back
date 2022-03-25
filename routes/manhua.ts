import { Router } from 'express';
import * as manhuaController from '../controllers/manhua';

const router = Router();

router.get('/', manhuaController.getManhuaList);
router.get('/:siteID', manhuaController.getManhua);
router.get('/:siteID/:chapter', manhuaController.getSources);

export default router;
