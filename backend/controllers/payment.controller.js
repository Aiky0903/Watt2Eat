// payment.controller.js
import axios from 'axios';

// check controller code
//help me research and find tng base url
// build mongodb schema for tng payment

const TNG_API_BASE =    process.env.TNG_API_BASE || 'https://api.tng.com.my'; // Replace with actual TNG API base URL
const TNG_API_KEY = process.env.TNG_API_KEY;
const TNG_MERCHANT_ID = process.env.TNG_MERCHANT_ID;

// Function to initiate payment
export const initiatePayment = async (req, res) => {
    const { orderId, totalAmount, serviceFee, dsWallet } = req.body;
    const dsAmount = totalAmount - serviceFee;

    try {
        const paymentPayload = {
            merchantId: TNG_MERCHANT_ID,
            orderId,
            amount: totalAmount,
            currency: 'MYR',
            callbackUrl: 'https://yourdomain.com/api/payment/callback'
        };

        const paymentResponse = await axios.post(
            `${TNG_API_BASE}/payment/initiate`,
            paymentPayload,
            {
                headers: {
                    'Authorization': `Bearer ${TNG_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        res.json({
            message: 'Payment initiated successfully',
            data: paymentResponse.data,
            dsAmount
        });
    } catch (error) {
        console.error('Payment initiation error:', error);
        res.status(500).json({ error: 'Failed to initiate payment' });
    }
};

// Function to handle payment callback
export const handlePaymentCallback = async (req, res) => {
    const paymentResult = req.body;
    console.log('Payment Callback Received:', paymentResult);

    if (paymentResult.status === 'SUCCESS') {
        try {
            const payoutPayload = {
                merchantId: TNG_MERCHANT_ID,
                payoutRef: paymentResult.orderId,
                amount: paymentResult.amount /* deduct serviceFee if not already handled */,
                recipientWallet: paymentResult.dsWallet,
                currency: 'MYR'
                // Add other necessary fields
            };

            const payoutResponse = await axios.post(
                `${TNG_API_BASE}/payout`,
                payoutPayload,
                {
                    headers: {
                        'Authorization': `Bearer ${TNG_API_KEY}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log('Payout initiated:', payoutResponse.data);
        } catch (err) {
            console.error('Error initiating payout:', err);
        }
    }

    res.sendStatus(200);
};