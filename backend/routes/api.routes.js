const express = require("express");
const AuthController = require("../controllers/auth.controller");
const PostsController = require("../controllers/posts.controller");
const SocialController = require("../controllers/social.controller");
const AdminController = require("../controllers/admin.controller");
const { authMiddleware, adminOnly } = require("../middleware/auth.middleware");

const router = express.Router();

// Auth Routes
router.post("/auth/register", AuthController.register);
router.post("/auth/login", AuthController.login);

// Posts Routes
router.get("/posts", PostsController.getAll);
router.get("/posts/feed", authMiddleware, PostsController.getFeed);
router.get("/posts/:id", PostsController.getDetail);
router.post("/posts", authMiddleware, PostsController.createPost); // Cho phép User tạo bài
router.post("/interact", authMiddleware, PostsController.interact);
router.get(
  "/recommendations",
  authMiddleware,
  PostsController.getRecommendations,
);
router.get("/history", authMiddleware, PostsController.getHistory);
router.get("/categories", PostsController.getCategories);
router.get("/tags", PostsController.getTags);

// Social Routes
router.post("/social/follow", authMiddleware, SocialController.follow);
router.post("/social/unfollow", authMiddleware, SocialController.unfollow);
router.get("/social/stats/:id?", authMiddleware, SocialController.getStats);
router.get(
  "/social/following/:id?",
  authMiddleware,
  SocialController.getFollowing,
);
router.get(
  "/social/followers/:id?",
  authMiddleware,
  SocialController.getFollowers,
);
router.get(
  "/social/suggestions",
  authMiddleware,
  SocialController.getSuggestions,
);

// Favorites & Notifications
router.get("/favorites", authMiddleware, PostsController.getFavorites);
router.get("/notifications", authMiddleware, PostsController.getNotifications);
router.patch(
  "/notifications/read",
  authMiddleware,
  PostsController.markNotificationsRead,
);

// Comments
router.get("/posts/:id/comments", PostsController.getComments);
router.post("/posts/:id/comments", authMiddleware, PostsController.postComment);

// AI Lab & Analytics
router.get(
  "/ai/full-analysis/:userId?",
  authMiddleware,
  PostsController.getAIAnalysis,
);

// Admin Routes (Giữ lại cho các tác vụ quản trị khác nếu cần)
router.post(
  "/admin/posts",
  authMiddleware,
  adminOnly,
  AdminController.createPost,
);
router.delete(
  "/admin/posts/:id",
  authMiddleware,
  adminOnly,
  AdminController.deletePost,
);
router.put(
  "/admin/posts/:id",
  authMiddleware,
  adminOnly,
  AdminController.updatePost,
);

module.exports = router;
