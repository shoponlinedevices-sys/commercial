"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const dataSource = new typeorm_1.DataSource({
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'commercial',
    synchronize: false,
    logging: true,
});
async function addUnitPriceColumn() {
    try {
        await dataSource.initialize();
        console.log('Database connected');
        const queryRunner = dataSource.createQueryRunner();
        try {
            const columns = await queryRunner.query(`
        SELECT COLUMN_NAME 
        FROM information_schema.columns 
        WHERE table_schema = 'commercial' 
        AND table_name = 'tbl_order_lines'
      `);
            console.log('Current columns:', columns.map(c => c.COLUMN_NAME));
            const unitPriceExists = await queryRunner.query(`
        SELECT COUNT(*) as count 
        FROM information_schema.columns 
        WHERE table_schema = 'commercial' 
        AND table_name = 'tbl_order_lines' 
        AND column_name = 'unit_price'
      `);
            if (unitPriceExists[0].count > 0) {
                console.log('Column unit_price already exists');
            }
            else {
                await queryRunner.query(`
          ALTER TABLE tbl_order_lines 
          ADD COLUMN unit_price DECIMAL(12, 2) NOT NULL DEFAULT 0.00 AFTER product_id
        `);
                console.log('Column unit_price added successfully');
            }
            const totalPriceExists = await queryRunner.query(`
        SELECT COUNT(*) as count 
        FROM information_schema.columns 
        WHERE table_schema = 'commercial' 
        AND table_name = 'tbl_order_lines' 
        AND column_name = 'total_price'
      `);
            if (totalPriceExists[0].count > 0) {
                console.log('Column total_price already exists');
            }
            else {
                await queryRunner.query(`
          ALTER TABLE tbl_order_lines 
          ADD COLUMN total_price DECIMAL(12, 2) NOT NULL DEFAULT 0.00 AFTER quantity
        `);
                console.log('Column total_price added successfully');
            }
            const subtotalExists = await queryRunner.query(`
        SELECT COUNT(*) as count 
        FROM information_schema.columns 
        WHERE table_schema = 'commercial' 
        AND table_name = 'tbl_order_lines' 
        AND column_name = 'subtotal'
      `);
            if (subtotalExists[0].count > 0) {
                console.log('Column subtotal exists, dropping it...');
                await queryRunner.query(`
          ALTER TABLE tbl_order_lines 
          DROP COLUMN subtotal
        `);
                console.log('Column subtotal dropped successfully');
            }
            const productNameExists = await queryRunner.query(`
        SELECT COUNT(*) as count 
        FROM information_schema.columns 
        WHERE table_schema = 'commercial' 
        AND table_name = 'tbl_order_lines' 
        AND column_name = 'product_name'
      `);
            if (productNameExists[0].count > 0) {
                console.log('Column product_name exists, dropping it...');
                await queryRunner.query(`
          ALTER TABLE tbl_order_lines 
          DROP COLUMN product_name
        `);
                console.log('Column product_name dropped successfully');
            }
            const priceExists = await queryRunner.query(`
        SELECT COUNT(*) as count 
        FROM information_schema.columns 
        WHERE table_schema = 'commercial' 
        AND table_name = 'tbl_order_lines' 
        AND column_name = 'price'
      `);
            if (priceExists[0].count > 0) {
                console.log('Column price exists, dropping it...');
                await queryRunner.query(`
          ALTER TABLE tbl_order_lines 
          DROP COLUMN price
        `);
                console.log('Column price dropped successfully');
            }
        }
        finally {
            await queryRunner.release();
        }
    }
    catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
    finally {
        await dataSource.destroy();
    }
}
addUnitPriceColumn();
//# sourceMappingURL=migration-add-unit-price.js.map