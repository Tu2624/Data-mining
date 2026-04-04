const pool = require("../config/db");
const RecommendationService = require("../services/recommendation.service");
const NotificationService = require("../services/notification.service");

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
                    COALESCE(AVG(r.score), 0) as avg_rating,
                    COUNT(r.score) as rating_count,
                    u.username, u.avatar_url,
                    IF(f.id IS NOT NULL, TRUE, FALSE) as is_following_author
                FROM posts p
                    LEFT JOIN media m ON p.id = m.post_id
                    LEFT JOIN categories c ON p.category_id = c.id
                    LEFT JOIN ratings r ON p.id = r.post_id
                    LEFT JOIN users u ON p.user_id = u.id
                    LEFT JOIN follows f ON (f.follower_id = ? AND f.following_id = p.user_id)
                WHERE 1=1
            `;
      const params = [req.userId || 0];


      if (categoryId) {
        query += " AND p.category_id = ?";
        params.push(categoryId);
      }
      if (minPrice) {
        query += " AND p.price >= ?";
        params.push(minPrice);
      }
      if (maxPrice) {
        query += " AND p.price <= ?";
        params.push(maxPrice);
      }
      if (q) {
        query += " AND p.title LIKE ?";
        params.push(`%${q}%`);
      }

      query += " GROUP BY p.id";
      if (req.query.sort === "popular") {
        query += " ORDER BY avg_rating DESC, rating_count DESC";
      } else {
        query += " ORDER BY p.created_at DESC";
      }

      const [posts] = await pool.query(query, params);
      res.json(posts);
    } catch (error) {
      console.error("SQL Error in getAll:", error);
      res
        .status(500)
        .json({ error: "Database query error", details: error.message });
    }
  }

  static async getDetail(req, res) {
    const postId = req.params.id;
    const userId = req.userId; // Có thể null nếu chưa đăng nhập
    try {
      // Lấy thông tin bài đăng
      const [posts] = await pool.query(
        `
                SELECT p.*, m.url as image_url, c.name as category_name, 
                       u.username as author_name, u.avatar_url as author_avatar,
                       EXISTS(SELECT 1 FROM follows WHERE follower_id = ? AND following_id = p.user_id) as is_following_author
                FROM posts p
                LEFT JOIN media m ON p.id = m.post_id
                LEFT JOIN categories c ON p.category_id = c.id
                LEFT JOIN users u ON p.user_id = u.id
                WHERE p.id = ?
            `,
        [userId || 0, postId],
      );


      if (!posts.length)
        return res.status(404).json({ error: "Post not found" });

      // Ghi nhận lượt xem (View) - Trọng số 1 cho AI
      if (userId) {
        await pool.query("INSERT INTO views (user_id, post_id) VALUES (?, ?)", [
          userId,
          postId,
        ]);
      }

      // Lấy các món ăn tương tự (Content-based AI)
      const similarPosts =
        await RecommendationService.getContentBasedRecommendations(postId);

      res.json({
        post: posts[0],
        similar: similarPosts,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getRecommendations(req, res) {
    const userId = req.userId;
    try {
      // Lấy gợi ý dựa trên User (Collaborative Filtering AI)
      const recommendationsData =
        await RecommendationService.getCollaborativeRecommendations(userId);

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
      const postIds = recommendationsData.map((r) => r.postId);
      const [posts] = await pool.query(
        `
                SELECT p.*, m.url as image_url
                FROM posts p
                LEFT JOIN media m ON p.id = m.post_id
                WHERE p.id IN (?)
            `,
        [postIds],
      );

      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async interact(req, res) {
    const { postId, action, score, comment } = req.body;
    const userId = req.userId;
    try {
      if (action === "like") {
        const [existing] = await pool.query(
          "SELECT * FROM likes WHERE user_id = ? AND post_id = ?",
          [userId, postId],
        );
        if (existing.length > 0) {
          await pool.query(
            "DELETE FROM likes WHERE user_id = ? AND post_id = ?",
            [userId, postId],
          );
          await pool.query(
            "DELETE FROM favorites WHERE user_id = ? AND post_id = ?",
            [userId, postId],
          ); // Xóa khỏi favorites
        } else {
          await pool.query(
            "INSERT IGNORE INTO likes (user_id, post_id) VALUES (?, ?)",
            [userId, postId],
          );
          await pool.query(
            "INSERT IGNORE INTO favorites (user_id, post_id) VALUES (?, ?)",
            [userId, postId],
          );
        }
      } else if (action === "favorite") {
        const [existingFav] = await pool.query(
          "SELECT * FROM favorites WHERE user_id = ? AND post_id = ?",
          [userId, postId],
        );
        if (existingFav.length > 0) {
          await pool.query(
            "DELETE FROM favorites WHERE user_id = ? AND post_id = ?",
            [userId, postId],
          );
        } else {
          await pool.query(
            "INSERT IGNORE INTO favorites (user_id, post_id) VALUES (?, ?)",
            [userId, postId],
          );
        }
      } else if (action === "view") {
        await pool.query("INSERT INTO views (user_id, post_id) VALUES (?, ?)", [
          userId,
          postId,
        ]);
      } else if (action === "rate") {
        await pool.query(
          "INSERT INTO ratings (user_id, post_id, score, comment) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE score = VALUES(score), comment = VALUES(comment)",
          [userId, postId, score, comment],
        );

        // Gửi thông báo cho chủ bài viết (Notification)
        const [postAuthor] = await pool.query(
          "SELECT user_id, title FROM posts WHERE id = ?",
          [postId],
        );
        if (postAuthor.length) {
          const io = req.app.get("io");
          await NotificationService.notifyUser(
            io,
            postAuthor[0].user_id,
            "new_rating",
            `Món ăn "${postAuthor[0].title}" của bạn vừa nhận được đánh giá ${score} sao!`,
          );
        }
      }
      res.json({ message: `Successfully interacted with action: ${action}` });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getHistory(req, res) {
    const userId = req.userId;
    try {
      const [history] = await pool.query(
        `
                SELECT p.*, m.url as image_url, v.viewed_at
                FROM views v
                JOIN posts p ON v.post_id = p.id
                LEFT JOIN media m ON p.id = m.post_id
                WHERE v.user_id = ?
                ORDER BY v.viewed_at DESC
                LIMIT 20
            `,
        [userId],
      );
      res.json(history);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getCategories(req, res) {
    try {
      const [categories] = await pool.query("SELECT * FROM categories");
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getTags(req, res) {
    try {
      const [tags] = await pool.query("SELECT * FROM tags");
      res.json(tags);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getFavorites(req, res) {
    const userId = req.userId;
    try {
      const [favorites] = await pool.query(
        `
                SELECT p.id, p.title, p.description, p.price, p.location, p.created_at,
                       MIN(m.url) as image_url,
                       MIN(c.name) as category_name,
                       COALESCE(AVG(r.score), 0) as avg_rating
                FROM favorites f
                JOIN posts p ON f.post_id = p.id
                LEFT JOIN media m ON p.id = m.post_id
                LEFT JOIN categories c ON p.category_id = c.id
                LEFT JOIN ratings r ON p.id = r.post_id
                WHERE f.user_id = ?
                GROUP BY p.id
                ORDER BY f.created_at DESC
            `,
        [userId],
      );
      res.json(favorites);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getNotifications(req, res) {
    const userId = req.userId;
    const limit = parseInt(req.query.limit) || 20;
    try {
      const [notifications] = await pool.query(
        "SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT ?",
        [userId, limit],
      );
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async markNotificationsRead(req, res) {
    const userId = req.userId;
    try {
      await pool.query(
        "UPDATE notifications SET is_read = TRUE WHERE user_id = ?",
        [userId],
      );
      res.json({ message: "All notifications marked as read" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getComments(req, res) {
    const postId = req.params.id;
    try {
      const [comments] = await pool.query(
        `
                SELECT c.id, c.content, c.created_at,
                       u.id as user_id, u.username, u.avatar_url
                FROM comments c
                JOIN users u ON c.user_id = u.id
                WHERE c.post_id = ?
                ORDER BY c.created_at ASC
            `,
        [postId],
      );
      res.json(comments);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async postComment(req, res) {
    const postId = req.params.id;
    const userId = req.userId;
    const { content } = req.body;
    if (!content || !content.trim()) {
      return res
        .status(400)
        .json({ error: "Nội dung bình luận không được để trống" });
    }
    try {
      const [result] = await pool.query(
        "INSERT INTO comments (user_id, post_id, content) VALUES (?, ?, ?)",
        [userId, postId, content.trim()],
      );

      // Gửi thông báo cho chủ bài (không gửi nếu tự comment bài mình)
      const [[postRow]] = await pool.query(
        "SELECT user_id, title FROM posts WHERE id = ?",
        [postId],
      );
      if (postRow && postRow.user_id !== userId) {
        const [[commenter]] = await pool.query(
          "SELECT username FROM users WHERE id = ?",
          [userId],
        );
        const io = req.app.get("io");
        await NotificationService.notifyUser(
          io,
          postRow.user_id,
          "new_comment",
          `${commenter.username} đã bình luận về "${postRow.title}"`,
        );
      }

      res.status(201).json({
        id: result.insertId,
        content: content.trim(),
        user_id: userId,
        post_id: parseInt(postId),
        created_at: new Date(),
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async createPost(req, res) {
    const {
      title,
      description,
      price,
      location,
      categoryId,
      imageUrl,
      originalPostId,
    } = req.body;
    const userId = req.userId;
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const isShared = !!originalPostId;
      const [result] = await connection.query(
        "INSERT INTO posts (user_id, title, description, price, location, category_id, is_shared, original_post_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [
          userId,
          title,
          description,
          price,
          location,
          categoryId,
          isShared,
          originalPostId,
        ],
      );
      const postId = result.insertId;

      if (imageUrl) {
        await connection.query(
          "INSERT INTO media (post_id, url) VALUES (?, ?)",
          [postId, imageUrl],
        );
      }

      // TỰ ĐỘNG TÁCH HASHTAG
      const hashtagRegex = /#([\w\u00C0-\u1EF9]+)/g; // Hỗ trợ Tiếng Việt
      const hashtags = [...new Set(description.match(hashtagRegex) || [])];

      for (let tag of hashtags) {
        const tagName = tag.substring(1).toLowerCase();
        await connection.query(
          "INSERT IGNORE INTO hashtags (name) VALUES (?)",
          [tagName],
        );
        const [[hashtagRow]] = await connection.query(
          "SELECT id FROM hashtags WHERE name = ?",
          [tagName],
        );
        await connection.query(
          "INSERT IGNORE INTO post_hashtags (post_id, hashtag_id) VALUES (?, ?)",
          [postId, hashtagRow.id],
        );
      }

      if (isShared) {
        await connection.query(
          "INSERT INTO shares (user_id, post_id) VALUES (?, ?)",
          [userId, originalPostId],
        );
      }

      await connection.commit();

      const io = req.app.get("io");
      const [[user]] = await connection.query(
        "SELECT username FROM users WHERE id = ?",
        [userId],
      );
      await NotificationService.notifyAll(
        io,
        "new_post",
        `${user.username} vừa đăng một bài viết mới! ${hashtags.join(" ")}`,
      );

      res
        .status(201)
        .json({ message: "Đăng bài thành công!", postId, hashtags });
    } catch (error) {
      await connection.rollback();
      res.status(500).json({ error: error.message });
    } finally {
      connection.release();
    }
  }

  static async getFeed(req, res) {
    const userId = req.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const streamLimit = limit / 2;
    const streamOffset = (page - 1) * streamLimit;

    try {
      // 1. LẤY BÀI VIẾT TỪ NGƯỜI FOLLOW
      const followsQuery = `
                SELECT 
                    p.id, p.user_id, p.title, p.description, p.price, p.location, p.category_id, p.created_at,
                    u.username, u.avatar_url, 
                    MIN(m.url) as image_url,
                    (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as like_count,
                    (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comment_count,
                    (SELECT COUNT(*) FROM shares WHERE post_id = p.id) as share_count,
                    EXISTS(SELECT 1 FROM likes WHERE post_id = p.id AND user_id = ?) as is_liked,
                    TRUE as is_following_author
                FROM posts p
                JOIN users u ON p.user_id = u.id
                JOIN follows f ON p.user_id = f.following_id
                LEFT JOIN media m ON p.id = m.post_id
                WHERE f.follower_id = ?
                GROUP BY p.id

                ORDER BY p.created_at DESC
                LIMIT ? OFFSET ?
            `;
      const [followsPosts] = await pool.query(followsQuery, [
        userId,
        userId,
        streamLimit,
        streamOffset,
      ]);

      // 2. LẤY GỢI Ý TỪ AI
      const recs = await RecommendationService.getCollaborativeRecommendations(
        userId,
        20,
      );
      const recIds = recs.map((r) => r.postId);

      let aiPosts = [];
      if (recIds.length > 0) {
        const recsQuery = `
                    SELECT 
                        p.id, p.user_id, p.title, p.description, p.price, p.location, p.category_id, p.created_at,
                        u.username, u.avatar_url, 
                        MIN(m.url) as image_url,
                        (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as like_count,
                        (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comment_count,
                        (SELECT COUNT(*) FROM shares WHERE post_id = p.id) as share_count,
                        EXISTS(SELECT 1 FROM likes WHERE post_id = p.id AND user_id = ?) as is_liked,
                        EXISTS(SELECT 1 FROM follows WHERE follower_id = ? AND following_id = p.user_id) as is_following_author
                    FROM posts p
                    JOIN users u ON p.user_id = u.id
                    LEFT JOIN media m ON p.id = m.post_id
                    WHERE p.id IN (?)
                    GROUP BY p.id
                    LIMIT ? OFFSET ?
                `;
        [aiPosts] = await pool.query(recsQuery, [
          userId,
          recIds,
          userId,
          streamLimit,
          streamOffset,
        ]);

      }

      // 3. XEN KẼ 1:1 (INTERLEAVING)
      const finalFeed = [];
      const maxLength = Math.max(followsPosts.length, aiPosts.length);
      const seenIds = new Set();

      for (let i = 0; i < maxLength; i++) {
        if (followsPosts[i] && !seenIds.has(followsPosts[i].id)) {
          finalFeed.push({ ...followsPosts[i], is_ai_recommendation: false });
          seenIds.add(followsPosts[i].id);
        }
        if (aiPosts[i] && !seenIds.has(aiPosts[i].id)) {
          finalFeed.push({ ...aiPosts[i], is_ai_recommendation: true });
          seenIds.add(aiPosts[i].id);
        }
      }

      // FALLBACK: Nếu feed quá ít, lấy thêm bài mới nhất toàn hệ thống
      if (finalFeed.length < 5) {
        const processedIds = Array.from(seenIds).concat([0]);
        const fallbackQuery = `
                    SELECT 
                        p.id, p.user_id, p.title, p.description, p.price, p.location, p.category_id, p.created_at,
                        u.username, u.avatar_url, 
                        MIN(m.url) as image_url,
                        (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as like_count,
                        (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comment_count,
                        (SELECT COUNT(*) FROM shares WHERE post_id = p.id) as share_count,
                        EXISTS(SELECT 1 FROM likes WHERE post_id = p.id AND user_id = ?) as is_liked,
                        EXISTS(SELECT 1 FROM follows WHERE follower_id = ? AND following_id = p.user_id) as is_following_author
                    FROM posts p
                    JOIN users u ON p.user_id = u.id
                    LEFT JOIN media m ON p.id = m.post_id
                    WHERE p.id NOT IN (?)
                    GROUP BY p.id
                    ORDER BY p.created_at DESC
                    LIMIT ?
                `;
        const [extraFeed] = await pool.query(fallbackQuery, [
          userId,
          userId,
          processedIds,
          limit - finalFeed.length,
        ]);

        finalFeed.push(
          ...extraFeed.map((p) => ({ ...p, is_ai_recommendation: false })),
        );
      }

      res.json(finalFeed);
    } catch (error) {
      console.error("Interleaved Feed Error:", error);
      res.status(500).json({ error: error.message });
    }
  }

  static async getAIAnalysis(req, res) {
    const userId = parseInt(req.params.userId || req.userId);
    try {
      const analysis =
        await RecommendationService.getComprehensiveAnalysis(userId);
      res.json(analysis);
    } catch (error) {
      console.error("AI Analysis Error:", error);
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = PostsController;
