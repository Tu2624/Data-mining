const pool = require('../config/db');

class RecommendationService {
    /**
     * Thuật toán Collaborative Filtering (Mean-Centered Cosine Similarity)
     */
    static async getCollaborativeRecommendations(userId, limit = 10, targetMatrix = null) {
        try {
            const matrix = targetMatrix || await this.getInteractionMatrix();
            if (!matrix[userId]) return [];

            const userMeans = this.calculateUserMeans(matrix);
            const adjustedMatrix = this.getAdjustedMatrix(matrix, userMeans);

            const currentUserAdjusted = adjustedMatrix[userId];
            const similarities = [];

            for (const otherId in adjustedMatrix) {
                if (parseInt(otherId) === userId) continue;
                const sim = this.cosineSimilarity(currentUserAdjusted, adjustedMatrix[otherId]);
                if (sim > 0) {
                    similarities.push({ userId: parseInt(otherId), similarity: sim });
                }
            }

            similarities.sort((a, b) => b.similarity - a.similarity);
            const topNeighbors = similarities.slice(0, 7);

            const predictions = {};
            const simSum = {};

            topNeighbors.forEach(neighbor => {
                const neighborRatings = matrix[neighbor.userId];
                for (const postId in neighborRatings) {
                    if (!matrix[userId][postId]) {
                        if (!predictions[postId]) {
                            predictions[postId] = 0;
                            simSum[postId] = 0;
                        }
                        const adjustedRating = neighborRatings[postId] - userMeans[neighbor.userId];
                        predictions[postId] += neighbor.similarity * adjustedRating;
                        simSum[postId] += Math.abs(neighbor.similarity);
                    }
                }
            });

            const finalRecs = [];
            for (const postId in predictions) {
                if (simSum[postId] > 0) {
                    const predictedRating = userMeans[userId] + (predictions[postId] / simSum[postId]);
                    finalRecs.push({ 
                        postId: parseInt(postId), 
                        score: parseFloat(predictedRating.toFixed(2)) 
                    });
                }
            }

            return finalRecs.sort((a, b) => b.score - a.score).slice(0, limit);
        } catch (error) {
            console.error('Rec System Error:', error);
            return [];
        }
    }

    /**
     * PHÂN TÍCH CHI TIẾT (Cho AI LAB 2.0)
     */
    static async getComprehensiveAnalysis(userId) {
        try {
            const matrix = await this.getInteractionMatrix();
            if (!matrix[userId]) {
                // FALLBACK: Nếu User chưa có tương tác nào
                const [users] = await pool.query('SELECT id, username FROM users WHERE id = ?', [userId]);
                return {
                    user: users[0] || { id: userId, username: 'User' },
                    matrix: matrix,
                    userMeans: {},
                    similarities: [],
                    neighbors: [],
                    currentUserInteractions: [],
                    recommendations: [],
                    mae: 0
                };
            }
            const userMeans = this.calculateUserMeans(matrix);
            const [users] = await pool.query('SELECT id, username FROM users');
            const [posts] = await pool.query('SELECT id, title FROM posts');
            const userMap = users.reduce((acc, u) => ({ ...acc, [u.id]: u }), {});
            const postMap = posts.reduce((acc, p) => ({ ...acc, [p.id]: p }), {});

            const adjustedMatrix = this.getAdjustedMatrix(matrix, userMeans);
            const similarities = [];
            for (const otherId in adjustedMatrix) {
                if (parseInt(otherId) === userId) continue;
                const sim = this.cosineSimilarity(adjustedMatrix[userId], adjustedMatrix[otherId]);
                if (sim > 0.01) {
                    similarities.push({ 
                        userId: parseInt(otherId), 
                        username: userMap[otherId]?.username || `User ${otherId}`,
                        score: parseFloat(sim.toFixed(4)) 
                    });
                }
            }
            similarities.sort((a, b) => b.score - a.score);

            const recommendations = await this.getCollaborativeRecommendations(userId, 10, matrix);
            const mae = await this.calculateMAE(userId, matrix);

            const currentUserInteractions = matrix[userId] || {};

            return {
                user: userMap[userId],
                matrix: matrix,
                userMeans,
                similarities: similarities.slice(0, 10),
                neighbors: similarities.slice(0, 5),
                currentUserInteractions: Object.entries(currentUserInteractions).map(([pid, score]) => ({
                    postId: pid,
                    title: postMap[pid]?.title || `Món ${pid}`,
                    score
                })),
                recommendations: recommendations.map(r => {
                    // Tìm các contributors cho món ăn này
                    const contributors = [];
                    for (const otherId in matrix) {
                        const sim = this.cosineSimilarity(adjustedMatrix[userId], adjustedMatrix[otherId]);
                        if (sim > 0 && matrix[otherId][r.postId]) {
                            contributors.push({
                                username: userMap[otherId]?.username || `U${otherId}`,
                                contribution: sim * (matrix[otherId][r.postId] - userMeans[otherId])
                            });
                        }
                    }
                    return {
                        ...r,
                        title: postMap[r.postId]?.title || `Món ${r.postId}`,
                        contributors: contributors.sort((a, b) => b.contribution - a.contribution).slice(0, 5)
                    };
                }),
                mae: parseFloat(mae.toFixed(4))
            };
        } catch (error) {
            console.error('Analysis Error:', error);
            throw error;
        }
    }

    static async getInteractionMatrix() {
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
        const matrix = {};
        rows.forEach(row => {
            if (!matrix[row.user_id]) matrix[row.user_id] = {};
            matrix[row.user_id][row.post_id] = row.total_score;
        });
        return matrix;
    }

    static calculateUserMeans(matrix) {
        const means = {};
        for (const userId in matrix) {
            const ratings = Object.values(matrix[userId]);
            const sum = ratings.reduce((a, b) => a + b, 0);
            means[userId] = sum / ratings.length;
        }
        return means;
    }

    static getAdjustedMatrix(matrix, means) {
        const adjusted = {};
        for (const userId in matrix) {
            adjusted[userId] = {};
            for (const postId in matrix[userId]) {
                adjusted[userId][postId] = matrix[userId][postId] - means[userId];
            }
        }
        return adjusted;
    }

    static async calculateMAE(userId, matrix) {
        const userRatings = matrix[userId];
        if (!userRatings || Object.keys(userRatings).length < 2) return 0;

        const postIds = Object.keys(userRatings);
        const testSize = Math.max(1, Math.floor(postIds.length * 0.2));
        const testPosts = postIds.sort(() => 0.5 - Math.random()).slice(0, testSize);

        const trainMatrix = { ...matrix, [userId]: { ...userRatings } };
        testPosts.forEach(pid => delete trainMatrix[userId][pid]);

        let totalError = 0;
        let count = 0;

        for (const pid of testPosts) {
            const prediction = await this.predictSingle(userId, parseInt(pid), trainMatrix);
            if (prediction !== null) {
                totalError += Math.abs(prediction - userRatings[pid]);
                count++;
            }
        }

        return count === 0 ? 0 : totalError / count;
    }

    static async predictSingle(userId, postId, matrix) {
        const userMeans = this.calculateUserMeans(matrix);
        const adjustedMatrix = this.getAdjustedMatrix(matrix, userMeans);
        const similarities = [];

        for (const otherId in adjustedMatrix) {
            if (parseInt(otherId) === userId) continue;
            const sim = this.cosineSimilarity(adjustedMatrix[userId], adjustedMatrix[otherId]);
            if (sim > 0 && matrix[otherId][postId]) {
                similarities.push({ userId: parseInt(otherId), similarity: sim });
            }
        }

        if (similarities.length === 0) return null;

        let num = 0;
        let den = 0;
        similarities.forEach(s => {
            num += s.similarity * (matrix[s.userId][postId] - userMeans[s.userId]);
            den += Math.abs(s.similarity);
        });

        return userMeans[userId] + (num / den);
    }

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
        let dotProduct = 0, mA = 0, mB = 0;
        const commonPosts = Object.keys(vecA).filter(p => vecB[p] !== undefined);
        if (commonPosts.length === 0) return 0;
        commonPosts.forEach(p => {
            dotProduct += vecA[p] * vecB[p];
        });
        Object.values(vecA).forEach(v => mA += v * v);
        Object.values(vecB).forEach(v => mB += v * v);
        const mag = Math.sqrt(mA) * Math.sqrt(mB);
        return mag === 0 ? 0 : dotProduct / mag;
    }
}

module.exports = RecommendationService;
