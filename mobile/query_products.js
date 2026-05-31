const mysql = require('mysql2/promise');
(async () => {
  try {
    const conn = await mysql.createConnection({ host: 'localhost', user: 'root', password: '06081990', database: 'commercial' });
    const [rows] = await conn.execute('SELECT id,name,price,old_price,badge,sku,unit,moq,image_url FROM tbl_product LIMIT 10');
    console.log(JSON.stringify(rows, null, 2));
    await conn.end();
  } catch (err) {
    console.error(err.message || err);
  }
})();
