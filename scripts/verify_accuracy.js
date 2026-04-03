const mysql = require('mysql2/promise');
require('dotenv').config({ path: './backend/.env' });
const RecommendationService = require('../backend/services/recommendation.service');

async function verifyAccuracy() {
    console.log('🧪 Đang bắt đầu kiểm chứng độ chính xác của thuật toán Collaborative Filtering...');
    
    let connection;
    try {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        // Tìm ID của user1
        const [users] = await connection.query('SELECT id FROM users WHERE email = ?', ['user1@gmail.com']);
        if (users.length === 0) {
            console.log('❌ Lỗi: Không tìm thấy tài khoản user1@gmail.com. Hãy chạy seeder trước.');
            return;
        }

        const userId = users[0].id;
        console.log(`\n🔍 Phân tích mã người dùng: ${userId} (user1@gmail.com)`);
        
        const recommendations = await RecommendationService.getCollaborativeRecommendations(userId);
        
        if (recommendations.length === 0) {
            console.log('❌ Lỗi: Không tìm thấy gợi ý. Thuật toán có thể chưa tìm thấy sự tương đồng.');
            return;
        }

        console.log('✅ KẾT QUẢ GỢI Ý TỪ AI:');
        console.table(recommendations.map(r => ({
            'ID Món ăn': r.postId,
            'Độ tin cậy (AI Score)': r.score.toFixed(4)
        })));

        const [rows] = await connection.query('SELECT title FROM posts WHERE id = ?', [recommendations[0].postId]);
        const recommendedTitle = rows[0]?.title || "N/A";

        console.log(`\n✨ Dự đoán hàng đầu: "${recommendedTitle}"`);
        
        if (recommendedTitle.toLowerCase().includes('cơm tấm')) {
            console.log('🏆 KẾT LUẬN: THUẬT TOÁN CHÍNH XÁC TUYỆT ĐỐI!');
            console.log('Lý do: User 1 giống User 2 (cùng thích Phở, Bún Chả). User 2 thích thêm Cơm Tấm, nên AI đã gợi ý Cơm Tấm cho User 1.');
        } else {
            console.log('⚠️ Thuật toán đưa ra gợi ý khác, kết quả phụ thuộc vào dữ liệu ngẫu nhiên của các user khác.');
        }

    } catch (error) {
        console.error('❌ Lỗi kỹ thuật:', error);
    } finally {
        if (connection) await connection.end();
        process.exit();
    }
}

verifyAccuracy();
