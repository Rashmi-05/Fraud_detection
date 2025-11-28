import {Router} from 'express';
import { signup, login } from '../Controllers/loginController.js';
import authMiddleware from '../Middleware/authentication.js';
import { sendMoney } from '../Controllers/transactionController.js';
import { getPastReceivers, getPastTransactions, getBalance } from '../Controllers/getThings.js';

const router = Router();

router.post("/signup",signup)
router.post("/login",login)
router.post("/txn",authMiddleware,sendMoney)
router.get("/pastTxn",authMiddleware,getPastTransactions)
router.get("/receivers",authMiddleware,getPastReceivers)
router.get("/getBalance",authMiddleware,getBalance)


export default router;