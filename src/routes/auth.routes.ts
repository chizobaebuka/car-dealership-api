import express from 'express';
import { register, login } from '../controllers/auth.controller';

const router = express.Router();


/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: API for managing authentication
 */

router.post('/register', register);
router.post('/login', login);

export default router;