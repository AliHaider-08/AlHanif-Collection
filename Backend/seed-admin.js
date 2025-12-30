import db from './models/index.js';
import dotenv from 'dotenv';

dotenv.config();

const seedAdmin = async () => {
    try {
        await db.sequelize.authenticate();

        const adminEmail = 'admin@alhanif.com';
        const existingAdmin = await db.User.findOne({ where: { email: adminEmail } });

        if (existingAdmin) {
            console.log('Admin already exists.');
        } else {
            await db.User.create({
                firstName: 'System',
                lastName: 'Admin',
                email: adminEmail,
                password: 'admin123', // This will be hashed by the model hook
                role: 'admin',
                isActive: true
            });
            console.log('✅ Admin user created successfully!');
            console.log('Email: admin@alhanif.com');
            console.log('Password: admin123');
        }
    } catch (error) {
        console.error('Error seeding admin:', error);
    } finally {
        process.exit();
    }
};

seedAdmin();
