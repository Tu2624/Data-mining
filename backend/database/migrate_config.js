const mysql = require('mysql2/promise');
require('dotenv').config();

async function migrate() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    try {
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS system_configs (
                id INT AUTO_INCREMENT PRIMARY KEY,
                \`key\` VARCHAR(50) UNIQUE NOT NULL,
                value FLOAT NOT NULL,
                description TEXT,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);

        const weights = [
            ['weight_rating', 1.0, 'Trọng số cho điểm đánh giá sao'],
            ['weight_favorite', 3.0, 'Trọng số cho hành động yêu thích'],
            ['weight_like', 2.0, 'Trọng số cho hành động thích'],
            ['weight_view', 1.0, 'Trọng số cho lượt xem']
        ];

        for (const [key, val, desc] of weights) {
            await connection.execute(
                'INSERT IGNORE INTO system_configs (\`key\`, value, description) VALUES (?, ?, ?)',
                [key, val, desc]
            );
        }

        console.log('Migration successful');
    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        await connection.end();
    }
}

migrate();
