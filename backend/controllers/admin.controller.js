const pool = require('../config/db');
const NotificationService = require('../services/notification.service');

class AdminController {
    static async createPost(req, res) {
        const { title, description, price, location, categoryId, imageUrl, tags } = req.body;
        const userId = req.userId;
        try {
            const [result] = await pool.query(
                'INSERT INTO posts (user_id, title, description, price, location, category_id) VALUES (?, ?, ?, ?, ?, ?)',
                [userId, title, description, price, location, categoryId]
            );
            const postId = result.insertId;

            if (imageUrl) {
                await pool.query('INSERT INTO media (post_id, url) VALUES (?, ?)', [postId, imageUrl]);
            }

            if (tags && tags.length) {
                const tagQueries = tags.map(tagId => pool.query('INSERT INTO post_tags (post_id, tag_id) VALUES (?, ?)', [postId, tagId]));
                await Promise.all(tagQueries);
            }

            // Gửi thông báo cho toàn bộ User (Real-time)
            const io = req.app.get('io');
            await NotificationService.notifyAll(io, 'new_post', `Admin vừa đăng món mới: ${title}!`);

            res.status(201).json({ message: 'Post created successfully', postId });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async deletePost(req, res) {
        const postId = req.params.id;
        try {
            await pool.query('DELETE FROM posts WHERE id = ?', [postId]);
            res.json({ message: 'Post deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async updatePost(req, res) {
        const postId = req.params.id;
        const { title, description, price, location, categoryId, imageUrl, tags } = req.body;
        try {
            await pool.query(
                'UPDATE posts SET title = ?, description = ?, price = ?, location = ?, category_id = ? WHERE id = ?',
                [title, description, price, location, categoryId, postId]
            );

            if (imageUrl !== undefined) {
                await pool.query('DELETE FROM media WHERE post_id = ?', [postId]);
                if (imageUrl) {
                    await pool.query('INSERT INTO media (post_id, url) VALUES (?, ?)', [postId, imageUrl]);
                }
            }

            if (tags !== undefined) {
                await pool.query('DELETE FROM post_tags WHERE post_id = ?', [postId]);
                if (tags && tags.length) {
                    await Promise.all(
                        tags.map(tagId => pool.query('INSERT INTO post_tags (post_id, tag_id) VALUES (?, ?)', [postId, tagId]))
                    );
                }
            }

            res.json({ message: 'Post updated successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = AdminController;
