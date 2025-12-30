import db from './models/index.js';
import dotenv from 'dotenv';

dotenv.config();

async function syncDatabase() {
  try {
    console.log('🔄 Connecting to database...');
    
    // Test connection
    await db.sequelize.authenticate();
    console.log('✅ Database connection successful!');
    
    // Sync all models (create tables)
    console.log('🔄 Creating database tables...');
    await db.sequelize.sync({ force: true });
    console.log('✅ Database tables created successfully!');
    
    // List all tables
    const [results] = await db.sequelize.query("SHOW TABLES");
    console.log('📋 Tables created:', results.map(row => Object.values(row)[0]));
    
    console.log('🎉 Database is ready!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error syncing database:', error);
    process.exit(1);
  }
}

syncDatabase();
