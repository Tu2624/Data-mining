const mysql = require('mysql2/promise');
require('dotenv').config({ path: './backend/.env' });
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const CATEGORIES = ['Phở', 'Bún chả', 'Cơm tấm', 'Bánh mì', 'Đồ uống', 'Tráng miệng', 'Lẩu & Nướng'];
const TAGS = ['Gia truyền', 'Sân vườn', 'Vỉa hè', 'Sang trọng', 'Giá sinh viên', 'Đặc sản', 'Healthy'];
const REAL_FOODS = [
    {
        title: 'Phở Bò Tái Lăn Hà Nội',
        description: 'Phở bò tái lăn với nước dùng béo ngậy, thơm mùi gừng tỏi và thịt bò xào tái vừa tới. Một hương vị đặc trưng của Hà Nội xưa.',
        price: 55000,
        category: 'Phở',
        image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1ccdce',
        tags: ['Gia truyền', 'Đặc sản']
    },
    {
        title: 'Bún Chả Hàng Mành',
        description: 'Bún chả nướng than hoa thơm lừng, ăn kèm nước chấm chua ngọt, dưa góp và rau sống thanh mát. Món ăn tinh hoa của ẩm thực Việt.',
        price: 65000,
        category: 'Bún chả',
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
        tags: ['Vỉa hè', 'Đặc sản']
    },
    {
        title: 'Bánh Mì Phượng Hội An',
        description: 'Bánh mì giòn rụm với pate béo ngậy, jambon, thịt nướng và loại sốt đặc biệt nổi danh khắp thế giới tại Hội An.',
        price: 35000,
        category: 'Bánh mì',
        image: 'https://images.unsplash.com/photo-1600454021970-351eff4a6554',
        tags: ['Gia truyền', 'Giá sinh viên']
    },
    {
        title: 'Cơm Tấm Sườn Bì Chả',
        description: 'Cơm tấm dẻo mẩy ăn cùng sườn nướng mặn ngọt, bì thính thơm lừng và chả trứng đúng điệu Sài Gòn.',
        price: 45000,
        category: 'Cơm tấm',
        image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7bb7445',
        tags: ['Dân dã', 'Healthy']
    },
    {
        title: 'Cà Phê Muối Huế',
        description: 'Sự kết hợp độc đáo giữa vị đắng của cà phê, vị béo của kem mặn tạo nên một hương vị khó quên từ cố đô.',
        price: 30000,
        category: 'Đồ uống',
        image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735',
        tags: ['Healthy', 'Sang trọng']
    },
    {
        title: 'Bún Đậu Mắm Tôm',
        description: 'Mẹt bún đầy đặn với đậu rán giòn, thịt chân giò, chả cốm và mắm tôm nồng nàn dậy vị.',
        price: 50000,
        category: 'Bún chả',
        image: 'https://images.unsplash.com/photo-1512058560566-42724afbc2db',
        tags: ['Vỉa hè', 'Dân dã']
    },
    {
        title: 'Bánh Xèo Nam Bộ',
        description: 'Bánh xèo vàng giòn rụm, nhân tôm thịt đầy đặn ăn kèm các loại rau rừng đặc trưng miền Tây.',
        price: 80000,
        category: 'Bánh mì', // Tạm để danh mục gần đúng
        image: 'https://images.unsplash.com/photo-1512058560566-42724afbc2db',
        tags: ['Dân dã', 'Đặc sản']
    }
];

async function seed() {
    let pool;
    // 0. Tạo kết nối ban đầu không cần database để tạo DB nếu chưa có
    const initialPool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        multipleStatements: true // Quan trọng để chạy schema.sql
    });

    try {
        console.log('🚀 Initializing Database...');
        await initialPool.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME} DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
        
        // 1. Kết nối vào Database chính
        pool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            multipleStatements: true
        });

        // 2. Tự động khởi tạo bảng từ schema.sql
        console.log('🏗 Building Tables from schema.sql...');
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');
        await pool.query(schemaSql);

        console.log('📦 Starting Seeding Data...');

        // 1. Clear existing data
        await pool.query('SET FOREIGN_KEY_CHECKS = 0');
        await pool.query('TRUNCATE TABLE post_tags');
        await pool.query('TRUNCATE TABLE media');
        await pool.query('TRUNCATE TABLE comments');
        await pool.query('TRUNCATE TABLE likes');
        await pool.query('TRUNCATE TABLE favorites');
        await pool.query('TRUNCATE TABLE views');
        await pool.query('TRUNCATE TABLE ratings');
        await pool.query('TRUNCATE TABLE notifications');
        await pool.query('TRUNCATE TABLE recommendations_cache');
        await pool.query('TRUNCATE TABLE posts');
        await pool.query('TRUNCATE TABLE tags');
        await pool.query('TRUNCATE TABLE categories');
        await pool.query('TRUNCATE TABLE users');
        await pool.query('SET FOREIGN_KEY_CHECKS = 1');

        // 2. Seed Categories
        for (const cat of CATEGORIES) {
            await pool.query('INSERT INTO categories (name) VALUES (?)', [cat]);
        }
        const [categoryRows] = await pool.query('SELECT id FROM categories');
        console.log('✅ Categories seeded');

        // 3. Seed Tags
        for (const tag of TAGS) {
            await pool.query('INSERT INTO tags (name) VALUES (?)', [tag]);
        }
        const [tagRows] = await pool.query('SELECT id FROM tags');
        console.log('✅ Tags seeded');

        // 4. Seed Users
        const hashedPassword = await bcrypt.hash('123456', 10);
        const users = [];
        // Admin
        const [adminResult] = await pool.query('INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)', 
            ['admin', 'admin@foodrec.com', hashedPassword, 'admin']);
        
        // Users for demo
        for (let i = 1; i <= 20; i++) {
            const username = `user${i}`;
            const [result] = await pool.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', 
                [username, `${username}@gmail.com`, hashedPassword]);
            users.push(result.insertId);
        }
        console.log('✅ Users seeded');

        // 5. Seed Real Posts
        const posts = [];
        for (let i = 0; i < 40; i++) {
            const food = REAL_FOODS[i % REAL_FOODS.length];
            // Find or insert category
            let [catRows] = await pool.query('SELECT id FROM categories WHERE name = ?', [food.category]);
            let catId;
            if (catRows.length > 0) {
                catId = catRows[0].id;
            } else {
                const [newCat] = await pool.query('INSERT INTO categories (name) VALUES (?)', [food.category]);
                catId = newCat.insertId;
            }

            const userId = users[Math.floor(Math.random() * users.length)];
            const [result] = await pool.query(
                'INSERT INTO posts (user_id, title, description, price, location, category_id) VALUES (?, ?, ?, ?, ?, ?)',
                [
                    userId, 
                    i > REAL_FOODS.length ? `${food.title} (${i})` : food.title, 
                    food.description, 
                    food.price + (Math.random() * 5000), 
                    'Hà Nội, Việt Nam',
                    catId
                ]
            );
            const postId = result.insertId;
            posts.push(postId);

            // Seed Media
            const imageUrl = `${food.image}?auto=format&fit=crop&w=800&q=80`;
            await pool.query('INSERT INTO media (post_id, url) VALUES (?, ?)', [postId, imageUrl]);

            // Seed specific Tags for post
            for (const tagName of food.tags) {
                let [tagRows] = await pool.query('SELECT id FROM tags WHERE name = ?', [tagName]);
                if (tagRows.length > 0) {
                    await pool.query('INSERT IGNORE INTO post_tags (post_id, tag_id) VALUES (?, ?)', [postId, tagRows[0].id]);
                }
            }
        }
        console.log('✅ Real Posts seeded');

        // 6. Seed Interactions (Critical for Collaborative Filtering)
        for (const userId of users) {
            const numInteractions = Math.floor(Math.random() * 15) + 8;
            const shuffledPosts = [...posts].sort(() => 0.5 - Math.random());
            const interactedPosts = shuffledPosts.slice(0, numInteractions);

            for (const postId of interactedPosts) {
                await pool.query('INSERT INTO views (user_id, post_id) VALUES (?, ?)', [userId, postId]);
                
                if (Math.random() > 0.4) {
                    await pool.query('INSERT INTO likes (user_id, post_id) VALUES (?, ?)', [userId, postId]);
                }

                if (Math.random() > 0.7) {
                    await pool.query('INSERT INTO favorites (user_id, post_id) VALUES (?, ?)', [userId, postId]);
                }

                // 60% Chance to Rate
                if (Math.random() > 0.4) {
                    const score = Math.floor(Math.random() * 5) + 1;
                    await pool.query('INSERT INTO ratings (user_id, post_id, score, comment) VALUES (?, ?, ?, ?)', 
                        [userId, postId, score, `Bình luận mẫu từ user ${userId} cho món ${postId}`]);
                }
            }
        }
        console.log('✅ Interactions & Ratings seeded');

        console.log('💖 All data seeded successfully!');
    } catch (error) {
        console.error('❌ Seeding failed:', error);
    } finally {
        if (initialPool) await initialPool.end();
        if (pool) await pool.end();
    }
}

seed();
