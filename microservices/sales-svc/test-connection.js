const mysql = require('mysql2/promise');

async function testConnection() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: '06081990',
      database: 'commercial',
    });
    
    console.log('Successfully connected to MySQL database');
    
    const [rows] = await connection.execute('SHOW TABLES');
    console.log('Tables in commercial database:', rows);
    
    await connection.end();
  } catch (error) {
    console.error('Connection failed:', error.message);
  }
}

testConnection();
