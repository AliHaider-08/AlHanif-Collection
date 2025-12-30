import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const PaymentMethod = sequelize.define('PaymentMethod', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    brand: {
        type: DataTypes.STRING, // e.g., 'visa', 'mastercard'
        allowNull: false
    },
    last4: {
        type: DataTypes.STRING(4),
        allowNull: false
    },
    expiryMonth: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    expiryYear: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    isDefault: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    cardholderName: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: true
});

export default PaymentMethod;
