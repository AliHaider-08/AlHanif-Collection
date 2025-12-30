import express from 'express';
import db from '../models/index.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/payments
// @desc    Get all user payment methods
router.get('/', auth, async (req, res) => {
    try {
        const paymentMethods = await db.PaymentMethod.findAll({
            where: { userId: req.user.id },
            order: [['isDefault', 'DESC'], ['createdAt', 'DESC']]
        });
        res.json({ success: true, data: { paymentMethods } });
    } catch (error) {
        console.error('Get payments error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   POST /api/payments
// @desc    Add a new payment method
router.post('/', auth, async (req, res) => {
    try {
        const { brand, last4, expiryMonth, expiryYear, cardholderName, isDefault } = req.body;

        if (isDefault) {
            await db.PaymentMethod.update({ isDefault: false }, { where: { userId: req.user.id } });
        }

        const newPaymentMethod = await db.PaymentMethod.create({
            userId: req.user.id,
            brand,
            last4,
            expiryMonth,
            expiryYear,
            cardholderName,
            isDefault: isDefault || false
        });

        res.status(201).json({ success: true, data: { paymentMethod: newPaymentMethod } });
    } catch (error) {
        console.error('Add payment error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   DELETE /api/payments/:id
// @desc    Delete a payment method
router.delete('/:id', auth, async (req, res) => {
    try {
        const deleted = await db.PaymentMethod.destroy({
            where: { id: req.params.id, userId: req.user.id }
        });

        if (!deleted) {
            return res.status(404).json({ success: false, message: 'Payment method not found' });
        }

        res.json({ success: true, message: 'Payment method deleted' });
    } catch (error) {
        console.error('Delete payment error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

export default router;
