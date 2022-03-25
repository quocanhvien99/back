import { Router } from 'express';
import * as userController from '../controllers/user';
import protectedRoute from '../Middleware/protectedRoute';

const router = Router();

router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/info', protectedRoute, userController.info);
router.post('/token', userController.getToken);

export default router;
