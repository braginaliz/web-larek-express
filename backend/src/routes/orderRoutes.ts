import { Router } from 'express';
import { check, validationResult } from 'express-validator';
import { createOrder } from '../controllers/orderController.js';

const router = Router();

router.post('/order', [
    check('payment').isIn(['card', 'online']),
    check('email').isEmail(),
    check('phone').notEmpty(),
    check('address').notEmpty(),
    check('total').isNumeric(),
    check('items').isArray().notEmpty(),
], (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}, createOrder);

export default router;