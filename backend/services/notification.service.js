const pool = require('../config/db');

class NotificationService {
    /**
     * Gửi thông báo cho 1 user cụ thể
     */
    static async notifyUser(io, userId, type, content) {
        try {
            // 1. Lưu vào Database
            const [result] = await pool.query(
                'INSERT INTO notifications (user_id, type, content) VALUES (?, ?, ?)',
                [userId, type, content]
            );

            // 2. Gửi qua Socket.io (nếu user đang online)
            io.to(`user_${userId}`).emit('new_notification', {
                id: result.insertId,
                type,
                content,
                is_read: false,
                created_at: new Date()
            });

            return result.insertId;
        } catch (error) {
            console.error('Notification Error:', error);
        }
    }

    /**
     * Gửi thông báo cho toàn bộ người dùng (ví dụ: món mới từ Admin)
     */
    static async notifyAll(io, type, content) {
        try {
            const [users] = await pool.query('SELECT id FROM users');
            
            for (const user of users) {
                await this.notifyUser(io, user.id, type, content);
            }
        } catch (error) {
            console.error('NotifyAll Error:', error);
        }
    }
}

module.exports = NotificationService;
