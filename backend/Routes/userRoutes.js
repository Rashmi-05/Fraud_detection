import {Router} from 'express';
import { signup, login } from '../Controllers/loginController.js';
import authMiddleware from '../Middleware/authentication.js';

const router = Router();

router.post("/signup",signup)
router.post("/login",login)

export default router;