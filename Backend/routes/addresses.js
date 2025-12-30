import express from 'express';
import db from '../models/index.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/addresses
// @desc    Get all user addresses
router.get('/', auth, async (req, res) => {
    try {
        const addresses = await db.Address.findAll({
            where: { userId: req.user.id },
            order: [['isDefault', 'DESC'], ['createdAt', 'DESC']]
        });
        res.json({ success: true, data: { addresses } });
    } catch (error) {
        console.error('Get addresses error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   POST /api/addresses
// @desc    Add a new address
router.post('/', auth, async (req, res) => {
    try {
        const { type, name, address, city, zip, phone, isDefault } = req.body;

        if (isDefault) {
            await db.Address.update({ isDefault: false }, { where: { userId: req.user.id } });
        }

        const newAddress = await db.Address.create({
            userId: req.user.id,
            type,
            name,
            address,
            city,
            zip,
            phone,
            isDefault: isDefault || false
        });

        res.status(201).json({ success: true, data: { address: newAddress } });
    } catch (error) {
        console.error('Add address error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   PUT /api/addresses/:id
// @desc    Update an address
router.put('/:id', auth, async (req, res) => {
    try {
        const { type, name, address, city, zip, phone, isDefault } = req.body;
        const existingAddress = await db.Address.findOne({
            where: { id: req.params.id, userId: req.user.id }
        });

        if (!existingAddress) {
            return res.status(404).json({ success: false, message: 'Address not found' });
        }

        if (isDefault) {
            await db.Address.update({ isDefault: false }, { where: { userId: req.user.id } });
        }

        await existingAddress.update({
            type: type || existingAddress.type,
            name: name || existingAddress.name,
            address: address || existingAddress.address,
            city: city || existingAddress.city,
            zip: zip || existingAddress.zip,
            phone: phone || existingAddress.phone,
            isDefault: isDefault ?? existingAddress.isDefault
        });

        res.json({ success: true, data: { address: existingAddress } });
    } catch (error) {
        console.error('Update address error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   DELETE /api/addresses/:id
// @desc    Delete an address
router.delete('/:id', auth, async (req, res) => {
    try {
        const deleted = await db.Address.destroy({
            where: { id: req.params.id, userId: req.user.id }
        });

        if (!deleted) {
            return res.status(404).json({ success: false, message: 'Address not found' });
        }

        res.json({ success: true, message: 'Address deleted' });
    } catch (error) {
        console.error('Delete address error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

export default router;
