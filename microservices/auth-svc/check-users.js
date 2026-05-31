const mysql = require('mysql2/promise');

async function checkUsers() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '06081990',
    database: 'commercial'
  });

  try {
    // Check if tbl_account exists
    const [tables] = await connection.query("SHOW TABLES LIKE 'tbl_account'");
    console.log('Tables found:', tables);

    if (tables.length === 0) {
      console.log('tbl_account table does not exist. Creating it...');
      await connection.query(`
        CREATE TABLE IF NOT EXISTS tbl_account (
          id INT AUTO_INCREMENT PRIMARY KEY,
          username VARCHAR(255) NOT NULL UNIQUE,
          password_hash VARCHAR(255) NOT NULL,
          email VARCHAR(100) DEFAULT NULL,
          full_name VARCHAR(100) DEFAULT NULL,
          role ENUM('user','admin') DEFAULT 'user',
          status TINYINT DEFAULT '1',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX idx_username (username)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);
      console.log('tbl_account table created.');
    }

    // Check existing users
    const [users] = await connection.query('SELECT id, username, password_hash, email, status FROM tbl_account');
    console.log('Existing users:', users);

    if (users.length === 0) {
      console.log('No users found. Adding default admin user...');
      const crypto = require('crypto');
      const password = '123';
      const passwordHash = crypto.createHash('sha256').update(password).digest('hex');
      
      await connection.query(
        'INSERT INTO tbl_account (username, password_hash, role, status) VALUES (?, ?, ?, ?)',
        ['admin', passwordHash, 'admin', 1]
      );
      console.log('Default admin user added. Username: admin, Password: 123');
      
      // Verify the user was added
      const [newUsers] = await connection.query('SELECT id, username, password_hash, email, status FROM tbl_account');
      console.log('Users after adding:', newUsers);
    } else {
      // Check if users have empty usernames and fix them
      const usersWithEmptyUsername = users.filter(u => !u.username || u.username === '');
      if (usersWithEmptyUsername.length > 0) {
        console.log('Found users with empty usernames. Fixing them...');
        for (const user of usersWithEmptyUsername) {
          const username = user.email ? user.email.split('@')[0] : `user${user.id}`;
          console.log(`Updating user ${user.id} to username: ${username}`);
          await connection.query(
            'UPDATE tbl_account SET username = ? WHERE id = ?',
            [username, user.id]
          );
        }
        
        // Verify the fix
        const [fixedUsers] = await connection.query('SELECT id, username, password_hash, email, status FROM tbl_account');
        console.log('Users after fixing:', fixedUsers);
      }

      // Check if admin user exists, if not add it
      const adminExists = users.some(u => u.username === 'admin');
      if (!adminExists) {
        console.log('Admin user does not exist. Adding admin user...');
        const crypto = require('crypto');
        const password = '123';
        const passwordHash = crypto.createHash('sha256').update(password).digest('hex');
        
        await connection.query(
          'INSERT INTO tbl_account (username, password_hash, role, status) VALUES (?, ?, ?, ?)',
          ['admin', passwordHash, 'admin', 1]
        );
        console.log('Admin user added. Username: admin, Password: 123');
        
        // Verify the user was added
        const [newUsers] = await connection.query('SELECT id, username, password_hash, email, status FROM tbl_account');
        console.log('Users after adding admin:', newUsers);
      }
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await connection.end();
  }
}

checkUsers();
