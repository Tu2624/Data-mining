const express = require('express');
const AuthController = require('../controllers/auth.controller');
const PostsController = require('../controllers/posts.controller');
const AdminController = require('../controllers/admin.controller');
const { authMiddleware, adminOnly } = require('../middleware/auth.middleware');

const router = express.Router();

// Auth Routes
router.post('/auth/register', AuthController.register);
router.post('/auth/login', AuthController.login);

// Posts Routes
router.get('/posts', PostsController.getAll);
router.get('/posts/:id', authMiddleware, PostsController.getDetail);
router.post('/interact', authMiddleware, PostsController.interact);
router.get('/recommendations', authMiddleware, PostsController.getRecommendations);
router.get('/history', authMiddleware, PostsController.getHistory);
router.get('/categories', PostsController.getCategories);
router.get('/tags', PostsController.getTags);

// Admin Routes
router.post('/admin/posts', authMiddleware, adminOnly, AdminController.createPost);
router.delete('/admin/posts/:id', authMiddleware, adminOnly, AdminController.deletePost);

module.exports = router;
