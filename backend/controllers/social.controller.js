const pool = require('../config/db');
const NotificationService = require('../services/notification.service');

class SocialController {
    static async follow(req, res) {
        const followerId = req.userId;
        const { followingId } = req.body;

        if (followerId === parseInt(followingId)) {
            return res.status(400).json({ error: 'Bạn không thể theo dõi chính mình' });
        }

        try {
            await pool.query(
                'INSERT IGNORE INTO follows (follower_id, following_id) VALUES (?, ?)',
                [followerId, followingId]
            );

            // Gửi thông báo cho người được follow
            const [[follower]] = await pool.query('SELECT username FROM users WHERE id = ?', [followerId]);
            const io = req.app.get('io');
            await NotificationService.notifyUser(
                io,
                followingId,
                'new_follower',
                `${follower.username} đã bắt đầu theo dõi bạn!`
            );

            res.json({ message: 'Đã theo dõi thành công' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async unfollow(req, res) {
        const followerId = req.userId;
        const { followingId } = req.body;

        try {
            await pool.query(
                'DELETE FROM follows WHERE follower_id = ? AND following_id = ?',
                [followerId, followingId]
            );
            res.json({ message: 'Đã bỏ theo dõi' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getStats(req, res) {
        const userId = req.params.id || req.userId;
        try {
            const [[followers]] = await pool.query('SELECT COUNT(*) as count FROM follows WHERE following_id = ?', [userId]);
            const [[following]] = await pool.query('SELECT COUNT(*) as count FROM follows WHERE follower_id = ?', [userId]);
            const [[posts]] = await pool.query('SELECT COUNT(*) as count FROM posts WHERE user_id = ?', [userId]);

            res.json({
                followers: followers.count,
                following: following.count,
                posts: posts.count
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getFollowing(req, res) {
        const userId = req.userId;
        try {
            const [following] = await pool.query(`
                SELECT u.id, u.username, u.avatar_url
                FROM users u
                JOIN follows f ON u.id = f.following_id
                WHERE f.follower_id = ?
            `, [userId]);
            res.json(following);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getSuggestions(req, res) {
        const userId = req.userId;
        try {
            // Gợi ý những người chưa follow (ngẫu nhiên)
            const [suggestions] = await pool.query(`
                SELECT id, username, avatar_url
                FROM users
                WHERE id != ? AND id NOT IN (
                    SELECT following_id FROM follows WHERE follower_id = ?
                )
                ORDER BY RAND()
                LIMIT 10
            `, [userId, userId]);
            res.json(suggestions);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = SocialController;
