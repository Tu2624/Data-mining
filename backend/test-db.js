const mysql = require('mysql2/promise');
require('dotenv').config();

async function testConnection() {
    try {
        console.log('--- KIỂM TRA KẾT NỐI ---');
        
        // 1. Kết nối không cần tên Database để liệt kê danh sách
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD
        });

        const [databases] = await connection.query('SHOW DATABASES');
        console.log('\n--- Danh sách các Database hiện có trên MySQL của bạn ---');
        databases.forEach(db => console.log(`- ${db.Database}`));
        console.log('-------------------------------------------------------\n');
        await connection.end();

        // 2. Kiểm tra xem database trong .env có trong danh mục không
        const dbName = process.env.DB_NAME;
        const exists = databases.some(db => db.Database === dbName);

        if (!exists) {
            console.error(`LỖI: Không tìm thấy database '${dbName}' trong danh sách trên.`);
            console.log('Hãy chắc chắn bạn đã tạo database này hoặc sửa file .env cho đúng tên.');
            return;
        }

        // 3. Nếu tồn tại, thử kết nối qua Pool
        const pool = require('./config/db');
        const [rows] = await pool.query('SELECT 1 + 1 AS result');
        console.log(`Kết nối thành công tới Database: ${dbName}`);
        
        try {
            const [tables] = await pool.query('SHOW TABLES');
            const tableList = tables.map(t => Object.values(t)[0]);
            console.log('Các bảng hiện có:', tableList.length > 0 ? tableList.join(', ') : '(Trống)');
            
            if (!tableList.includes('users')) {
                console.log('\nCẢNH BÁO: Database chưa có bảng "users". Bạn cần chạy seeder.');
            }
        } catch (e) {
            console.error('Không thể liệt kê bảng:', e.message);
        }

    } catch (error) {
        console.error('Lỗi kết nối MySQL:', error.message);
        console.error('Mã lỗi:', error.code);
    } finally {
        process.exit();
    }
}

testConnection();
