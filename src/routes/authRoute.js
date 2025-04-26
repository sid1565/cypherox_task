import express from 'express';
import { customer_register, login } from '../controllers/userController.js';

const router = express.Router();

router.get('/',function (req, res) {
        res.send("Hello all, This is auth route")}
    )

router.post('/register', customer_register);
router.post('/login', login);

 
export default router;