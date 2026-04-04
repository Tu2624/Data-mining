const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const bcrypt = require('bcryptjs');
const fs = require('fs');


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
        image: 'https://images.unsplash.com/photo-1521017432531-fbd92d74426b',
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
        category: 'Bánh mì',
        image: 'https://images.unsplash.com/photo-1551443874-884ec9298379',
        tags: ['Dân dã', 'Đặc sản']
    }
];

async function seed() {
    let pool;
    const initialPool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        multipleStatements: true
    });

    try {
        console.log('🚀 Initializing Database...');
        await initialPool.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME} DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
        
        pool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            multipleStatements: true
        });

        console.log('🏗 Building Tables from schema.sql...');
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');
        await pool.query(schemaSql);

        console.log('📦 Starting Seeding Data...');

        await pool.query('SET FOREIGN_KEY_CHECKS = 0');
        const tables = ['post_tags', 'media', 'comments', 'likes', 'favorites', 'views', 'ratings', 'notifications', 'recommendations_cache', 'follows', 'posts', 'tags', 'categories', 'users', 'post_hashtags', 'hashtags', 'shares'];
        for (const table of tables) {
            await pool.query(`TRUNCATE TABLE ${table}`);
        }
        await pool.query('SET FOREIGN_KEY_CHECKS = 1');

        for (const cat of CATEGORIES) {
            await pool.query('INSERT INTO categories (name) VALUES (?)', [cat]);
        }
        console.log('✅ Categories seeded');

        for (const tag of TAGS) {
            await pool.query('INSERT INTO tags (name) VALUES (?)', [tag]);
        }
        console.log('✅ Tags seeded');

        const adminHash = await bcrypt.hash('admin123', 10);
        const userHash = await bcrypt.hash('123456', 10);
        
        const users = [];
        await pool.query('INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)', 
            ['admin', 'admin@foodrec.com', adminHash, 'admin']);
        
        for (let i = 1; i <= 21; i++) {
            const username = `user${i}`;
            const [result] = await pool.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', 
                [username, `${username}@gmail.com`, userHash]);
            users.push(result.insertId);
        }
        console.log('✅ Users seeded');

        const posts = [];
        for (let i = 0; i < 40; i++) {
            const food = REAL_FOODS[i % REAL_FOODS.length];
            let [catRows] = await pool.query('SELECT id FROM categories WHERE name = ?', [food.category]);
            let catId = catRows[0].id;

            const userId = users[Math.floor(Math.random() * users.length)];
            const [result] = await pool.query(
                'INSERT INTO posts (user_id, title, description, price, location, category_id) VALUES (?, ?, ?, ?, ?, ?)',
                [userId, i >= REAL_FOODS.length ? `${food.title} (${i})` : food.title, food.description, food.price + (Math.random() * 5000), 'Hà Nội', catId]
            );
            const postId = result.insertId;
            posts.push(postId);

            // Gán Media
            await pool.query('INSERT INTO media (post_id, url) VALUES (?, ?)', [postId, `${food.image}?auto=format&fit=crop&w=800&q=80`]);

            // Gán Tags (Content-based AI)
            if (food.tags) {
                for (const tagName of food.tags) {
                    const [[tagRow]] = await pool.query('SELECT id FROM tags WHERE name = ?', [tagName]);
                    if (tagRow) {
                        await pool.query('INSERT IGNORE INTO post_tags (post_id, tag_id) VALUES (?, ?)', [postId, tagRow.id]);
                    }
                }
            }

            // Trích xuất Hashtags (Discovery system)
            const hashtagRegex = /#([\w\u00C0-\u1EF9]+)/g;
            const hashtags = food.description.match(hashtagRegex) || [];
            for (const tag of hashtags) {
                const name = tag.substring(1).toLowerCase();
                await pool.query('INSERT IGNORE INTO hashtags (name) VALUES (?)', [name]);
                const [[hRow]] = await pool.query('SELECT id FROM hashtags WHERE name = ?', [name]);
                await pool.query('INSERT IGNORE INTO post_hashtags (post_id, hashtag_id) VALUES (?, ?)', [postId, hRow.id]);
            }
        }
        console.log('✅ Real Posts seeded');

        console.log('👥 Creating User Personas for accurate AI Clustering...');
        const noodleLovers = users.slice(0, 7);
        const fastfoodFans = users.slice(7, 14);
        const healthyEaters = users.slice(14, 21);

        const getPostsByCat = async (catName) => {
            const [rows] = await pool.query('SELECT p.id FROM posts p JOIN categories c ON p.category_id = c.id WHERE c.name = ?', [catName]);
            return rows.map(r => r.id);
        };

        const phos = await getPostsByCat('Phở');
        const buncas = await getPostsByCat('Bún chả');
        const banhmis = await getPostsByCat('Bánh mì');
        const drinks = await getPostsByCat('Đồ uống');
        const comtams = await getPostsByCat('Cơm tấm');

        const seedPersona = async (userList, targetPosts, otherPosts, highRate = true) => {
            for (const userId of userList) {
                for (const postId of targetPosts) {
                    const rand = Math.random();
                    if (rand > 0.2) {
                        const score = highRate ? (Math.floor(Math.random() * 2) + 4) : (Math.floor(Math.random() * 2) + 1);
                        await pool.query('INSERT INTO ratings (user_id, post_id, score) VALUES (?, ?, ?)', [userId, postId, score]);
                        
                        // Thêm Like cho AI (Trọng số 2)
                        if (score >= 4) {
                            await pool.query('INSERT IGNORE INTO likes (user_id, post_id) VALUES (?, ?)', [userId, postId]);
                            if (Math.random() > 0.5) {
                                await pool.query('INSERT IGNORE INTO favorites (user_id, post_id) VALUES (?, ?)', [userId, postId]);
                            }
                        }
                    }
                    // Thêm View ngẫu nhiên (Trọng số 1)
                    if (Math.random() > 0.4) {
                        await pool.query('INSERT INTO views (user_id, post_id) VALUES (?, ?)', [userId, postId]);
                    }
                }
                const randomOthers = otherPosts.sort(() => 0.5 - Math.random()).slice(0, 3);
                for (const postId of randomOthers) {
                    const score = Math.floor(Math.random() * 3) + 2;
                    await pool.query('INSERT INTO ratings (user_id, post_id, score) VALUES (?, ?, ?)', [userId, postId, score]);
                }
            }
        };

        await seedPersona(noodleLovers, [...phos, ...buncas], [...drinks, ...comtams]);
        await seedPersona(fastfoodFans, [...banhmis, ...comtams], [...phos, ...drinks]);
        await seedPersona(healthyEaters, [...drinks], [...phos, ...buncas]);

        console.log('✅ Interactions & Ratings seeded with Persona Clusters');

        for (let i = 0; i < users.length; i++) {
            const numFollowing = Math.floor(Math.random() * 3) + 1;
            const shuffled = [...users].filter(u => u !== users[i]).sort(() => 0.5 - Math.random());
            const toFollow = shuffled.slice(0, numFollowing);
            for (const targetId of toFollow) {
                await pool.query('INSERT IGNORE INTO follows (follower_id, following_id) VALUES (?, ?)', [users[i], targetId]);
            }
        }
        console.log('✅ Follows seeded');

        console.log('\n🎯 TẠO DỮ LIỆU THỬ NGHIỆM ĐỘ CHÍNH XÁC AI (GOLD SET)...');
        const u1 = users[0];
        const u2 = users[1];
        const [[hiddenGem]] = await pool.query('SELECT p.id, p.title FROM posts p JOIN categories c ON p.category_id = c.id WHERE c.name = ? LIMIT 1 OFFSET 2', ['Phở']);
        if (hiddenGem) {
            await pool.query('INSERT IGNORE INTO ratings (user_id, post_id, score) VALUES (?, ?, 5)', [u2, hiddenGem.id]);
            await pool.query('INSERT IGNORE INTO ratings (user_id, post_id, score) VALUES (?, ?, 4)', [u1, phos[0]]);
            await pool.query('INSERT IGNORE INTO ratings (user_id, post_id, score) VALUES (?, ?, 4)', [u2, phos[0]]);
            console.log(`✅ Kết quả mong đợi: AI sẽ gợi ý "${hiddenGem.title}" cho User 1.`);
        }

        console.log('\n💖 All data seeded successfully!');
    } catch (error) {
        console.error('❌ Seeding failed:', error);
    } finally {
        if (initialPool) await initialPool.end();
        if (pool) await pool.end();
    }
}

seed();
