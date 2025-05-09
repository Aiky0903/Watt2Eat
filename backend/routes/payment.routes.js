// payment.routes.js
import express from 'express';
import { initiatePayment, handlePaymentCallback } from '../controllers/payment.controller.js';

const router = express.Router();

router.post('/initiate', initiatePayment);
router.post('/callback', handlePaymentCallback);

export default router;
