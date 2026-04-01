const pool = require('../config/db');
const RecommendationService = require('../services/recommendation.service');
const NotificationService = require('../services/notification.service');

class PostsController {
    static async getAll(req, res) {
        const { categoryId, minPrice, maxPrice, q } = req.query;
        try {
            // Sửa SQL để tương thích với ONLY_FULL_GROUP_BY
            let query = `
                SELECT 
                    p.id, p.user_id, p.title, p.description, p.price, p.location, p.category_id, p.created_at,
                    MIN(m.url) as image_url, 
                    MIN(c.name) as category_name, 
                    COALESCE(AVG(r.score), 0) as avg_rating
                FROM posts p
                LEFT JOIN media m ON p.id = m.post_id
                LEFT JOIN categories c ON p.category_id = c.id
                LEFT JOIN ratings r ON p.id = r.post_id
                WHERE 1=1
            `;
            const params = [];

            if (categoryId) {
                query += ' AND p.category_id = ?';
                params.push(categoryId);
            }
            if (minPrice) {
                query += ' AND p.price >= ?';
                params.push(minPrice);
            }
            if (maxPrice) {
                query += ' AND p.price <= ?';
                params.push(maxPrice);
            }
            if (q) {
                query += ' AND p.title LIKE ?';
                params.push(`%${q}%`);
            }

            query += ' GROUP BY p.id ORDER BY p.created_at DESC';
            
            const [posts] = await pool.query(query, params);
            res.json(posts);
        } catch (error) {
            console.error('SQL Error in getAll:', error);
            res.status(500).json({ error: 'Database query error', details: error.message });
        }
    }

    static async getDetail(req, res) {
        const postId = req.params.id;
        const userId = req.userId; // Có thể null nếu chưa đăng nhập
        try {
            // Lấy thông tin bài đăng
            const [posts] = await pool.query(`
                SELECT p.*, m.url as image_url, c.name as category_name
                FROM posts p
                LEFT JOIN media m ON p.id = m.post_id
                LEFT JOIN categories c ON p.category_id = c.id
                WHERE p.id = ?
            `, [postId]);

            if (!posts.length) return res.status(404).json({ error: 'Post not found' });

            // Ghi nhận lượt xem (View) - Trọng số 1 cho AI
            if (userId) {
                await pool.query('INSERT INTO views (user_id, post_id) VALUES (?, ?)', [userId, postId]);
            }

            // Lấy các món ăn tương tự (Content-based AI)
            const similarPosts = await RecommendationService.getContentBasedRecommendations(postId);

            res.json({
                post: posts[0],
                similar: similarPosts
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getRecommendations(req, res) {
        const userId = req.userId;
        try {
            // Lấy gợi ý dựa trên User (Collaborative Filtering AI)
            const recommendationsData = await RecommendationService.getCollaborativeRecommendations(userId);
            
            if (recommendationsData.length === 0) {
                // Nếu chưa có tương tác, gợi ý các bài mới nhất/phổ biến nhất
                const [topPosts] = await pool.query(`
                    SELECT p.*, m.url as image_url
                    FROM posts p
                    LEFT JOIN media m ON p.id = m.post_id
                    LIMIT 10
                `);
                return res.json(topPosts);
            }

            // Lấy chi tiết các bài được gợi ý
            const postIds = recommendationsData.map(r => r.postId);
            const [posts] = await pool.query(`
                SELECT p.*, m.url as image_url
                FROM posts p
                LEFT JOIN media m ON p.id = m.post_id
                WHERE p.id IN (?)
            `, [postIds]);

            res.json(posts);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async interact(req, res) {
        const { postId, action, score, comment } = req.body;
        const userId = req.userId;
        try {
            if (action === 'like') {
                await pool.query('INSERT IGNORE INTO likes (user_id, post_id) VALUES (?, ?)', [userId, postId]);
            } else if (action === 'favorite') {
                await pool.query('INSERT IGNORE INTO favorites (user_id, post_id) VALUES (?, ?)', [userId, postId]);
            } else if (action === 'rate') {
                await pool.query(
                    'INSERT INTO ratings (user_id, post_id, score, comment) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE score = VALUES(score), comment = VALUES(comment)',
                    [userId, postId, score, comment]
                );

                // Gửi thông báo cho chủ bài viết (Notification)
                const [postAuthor] = await pool.query('SELECT user_id, title FROM posts WHERE id = ?', [postId]);
                if (postAuthor.length) {
                    const io = req.app.get('io');
                    await NotificationService.notifyUser(io, postAuthor[0].user_id, 'new_rating', `Món ăn "${postAuthor[0].title}" của bạn vừa nhận được đánh giá ${score} sao!`);
                }
            }
            res.json({ message: `Successfully ${action}d` });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getHistory(req, res) {
        const userId = req.userId;
        try {
            const [history] = await pool.query(`
                SELECT p.*, m.url as image_url, v.viewed_at
                FROM views v
                JOIN posts p ON v.post_id = p.id
                LEFT JOIN media m ON p.id = m.post_id
                WHERE v.user_id = ?
                ORDER BY v.viewed_at DESC
                LIMIT 20
            `, [userId]);
            res.json(history);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getCategories(req, res) {
        try {
            const [categories] = await pool.query('SELECT * FROM categories');
            res.json(categories);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getTags(req, res) {
        try {
            const [tags] = await pool.query('SELECT * FROM tags');
            res.json(tags);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = PostsController;
