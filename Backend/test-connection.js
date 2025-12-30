import mysql from 'mysql2/promise';

// Test basic MySQL connection
async function testConnection() {
  try {
    console.log('Testing MySQL connection...');
    
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '', // XAMPP uses no password by default
    });
    
    console.log('✅ MySQL connection successful!');
    
    // Create database if it doesn't exist
    await connection.execute('CREATE DATABASE IF NOT EXISTS alhanif_collection');
    console.log('✅ Database created/verified!');
    
    // Test using the database
    await connection.execute('USE alhanif_collection');
    console.log('✅ Connected to alhanif_collection database!');
    
    await connection.end();
    console.log('✅ Connection closed');
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
  }
}

testConnection();
