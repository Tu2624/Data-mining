const pool = require('../config/db');

class RecommendationService {
    /**
     * Thuật toán Collaborative Filtering (Rating-based)
     * Ưu tiên Rating (5 điểm), sau đó là Favorite (3), Like (2), View (1)
     */
    static async getCollaborativeRecommendations(userId, limit = 10) {
        try {
            // Lấy dữ liệu điểm tương tác từ tất cả các nguồn
            const query = `
                SELECT user_id, post_id, MAX(score) as total_score
                FROM (
                    SELECT user_id, post_id, score FROM ratings
                    UNION ALL
                    SELECT user_id, post_id, 3 as score FROM favorites
                    UNION ALL
                    SELECT user_id, post_id, 2 as score FROM likes
                    UNION ALL
                    SELECT user_id, post_id, 1 as score FROM views
                ) as interactions
                GROUP BY user_id, post_id
            `;
            const [rows] = await pool.query(query);

            if (rows.length === 0) return [];

            const matrix = {};
            rows.forEach(row => {
                if (!matrix[row.user_id]) matrix[row.user_id] = {};
                matrix[row.user_id][row.post_id] = row.total_score;
            });

            const currentUserInteractions = matrix[userId] || {};
            const otherUserIds = Object.keys(matrix).filter(id => parseInt(id) !== userId);

            // Tính toán Cosine Similarity
            const similarities = [];
            otherUserIds.forEach(otherId => {
                const sim = this.cosineSimilarity(currentUserInteractions, matrix[otherId]);
                if (sim > 0.1) { // Chỉ lấy những user đủ tương đồng
                    similarities.push({ userId: parseInt(otherId), similarity: sim });
                }
            });

            similarities.sort((a, b) => b.similarity - a.similarity);

            // Dự đoán điểm số cho các món ăn chưa xem
            const recommendedPosts = {};
            similarities.slice(0, 5).forEach(simUser => {
                const otherUserPosts = matrix[simUser.userId];
                for (const postId in otherUserPosts) {
                    if (!currentUserInteractions[postId]) {
                        if (!recommendedPosts[postId]) recommendedPosts[postId] = 0;
                        recommendedPosts[postId] += otherUserPosts[postId] * simUser.similarity;
                    }
                }
            });

            const finalRecommendations = Object.keys(recommendedPosts)
                .map(postId => ({ postId: parseInt(postId), score: recommendedPosts[postId] }))
                .sort((a, b) => b.score - a.score)
                .slice(0, limit);

            return finalRecommendations;
        } catch (error) {
            return [];
        }
    }

    /**
     * Content-based Filtering với logic Tag & Category
     */
    static async getContentBasedRecommendations(postId, limit = 5) {
        try {
            const [postInfo] = await pool.query('SELECT category_id FROM posts WHERE id = ?', [postId]);
            if (!postInfo.length) return [];

            const categoryId = postInfo[0].category_id;
            
            const query = `
                SELECT p.id, COUNT(pt.tag_id) as common_tags
                FROM posts p
                LEFT JOIN post_tags pt ON p.id = pt.post_id
                WHERE p.id != ? AND (p.category_id = ? OR pt.tag_id IN (
                    SELECT tag_id FROM post_tags WHERE post_id = ?
                ))
                GROUP BY p.id
                ORDER BY (p.category_id = ?) DESC, common_tags DESC
                LIMIT ?
            `;
            const [recommendations] = await pool.query(query, [postId, categoryId, postId, categoryId, limit]);
            return recommendations;
        } catch (error) {
            return [];
        }
    }

    static cosineSimilarity(vecA, vecB) {
        let dotProduct = 0;
        let mA = 0, mB = 0;
        const keys = new Set([...Object.keys(vecA), ...Object.keys(vecB)]);

        keys.forEach(key => {
            const valA = vecA[key] || 0;
            const valB = vecB[key] || 0;
            dotProduct += valA * valB;
            mA += valA * valA;
            mB += valB * valB;
        });

        const magnitude = Math.sqrt(mA) * Math.sqrt(mB);
        return magnitude === 0 ? 0 : dotProduct / magnitude;
    }
}

module.exports = RecommendationService;
