import express from 'express';
import { register, login } from '../controllers/auth.controller';
import { validate } from '../middlewares/validate.middleware';
import { registerSchema, loginSchema } from '../validations/auth.validation';
import { authorizeRoles, protect } from '../middlewares/auth.middleware';

const router = express.Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);

export default router;