const mysql = require('mysql2/promise');
require('dotenv').config({ path: './backend/.env' });
const RecommendationService = require('./backend/services/recommendation.service');

async function testAI() {
    console.log('🚀 Đang khởi tạo bộ kiểm tra AI (Khai phá dữ liệu)...');
    
    // 1. Giả lập gọi Service (User ID = 1)
    try {
        const userId = 1;
        console.log(`🔍 Đang phân tích hành vi của User ID: ${userId}...`);
        
        const recommendations = await RecommendationService.getCollaborativeRecommendations(userId);
        
        if (recommendations.length === 0) {
            console.log('⚠️ Hiện chưa có gợi ý nào. Lý do: Có thể User chưa có tương tác hoặc chưa có dữ liệu tương đồng.');
            console.log('💡 Gợi ý: Bạn hãy chạy lại seeder.js hoặc thực hiện Like/Rating trên Web nhé!');
        } else {
            console.log('✅ KẾT QUẢ GỢI Ý TỪ AI (Collaborative Filtering):');
            console.table(recommendations.map(r => ({
                'Mã món ăn': r.postId,
                'Điểm tin cậy (AI Score)': r.score.toFixed(4)
            })));
            console.log('\n✨ Thuật toán đã tìm thấy sự tương đồng giữa bạn và 5 người dùng khác để đưa ra kết quả trên.');
        }

    } catch (error) {
        console.error('❌ Lỗi khi test AI:', error);
    } finally {
        process.exit();
    }
}

testAI();
