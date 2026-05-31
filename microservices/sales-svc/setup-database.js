const mysql = require('mysql2/promise');

async function setupDatabase() {
  // First connect without specifying database to create it
  const connection = await mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '06081990',
  });

  try {
    // Create database
    await connection.execute('CREATE DATABASE IF NOT EXISTS commercial');
    console.log('Database created or already exists');
    await connection.end();
  } catch (error) {
    console.error('Error creating database:', error);
    await connection.end();
    return;
  }

  // Now connect to the commercial database
  const dbConnection = await mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '06081990',
    database: 'commercial',
  });

  try {
    // Create TypeORM metadata table
    await dbConnection.execute(`
      CREATE TABLE IF NOT EXISTS typeorm_metadata (
        type VARCHAR(100) NOT NULL,
        \`database\` VARCHAR(100) NOT NULL,
        \`schema\` VARCHAR(100) NOT NULL,
        \`table\` VARCHAR(100) NOT NULL,
        value TEXT,
        PRIMARY KEY (type, \`database\`, \`schema\`, \`table\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    console.log('TypeORM metadata table created');

    // Create orders table
    await dbConnection.execute(`
      CREATE TABLE IF NOT EXISTS orders (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        user_id BIGINT UNSIGNED NOT NULL,
        total_amount DECIMAL(10, 2) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        shipping_address TEXT,
        fcm_token TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_user_id (user_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    console.log('Orders table created');

    // Create order_lines table
    await dbConnection.execute(`
      CREATE TABLE IF NOT EXISTS tbl_order_lines (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        order_id BIGINT UNSIGNED NOT NULL,
        product_id BIGINT UNSIGNED NOT NULL,
        unit_price DECIMAL(12, 2) NOT NULL,
        quantity INT DEFAULT 1,
        total_price DECIMAL(12, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_order_id (order_id),
        INDEX idx_product_id (product_id),
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    console.log('Order lines table created');

    console.log('Database setup completed successfully!');
  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    await dbConnection.end();
  }
}

setupDatabase();
