import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import {
  getFeedPosts,
  getUserPosts,
  likePost
} from '../controllers/postsController.js';

const router = express.Router();

/** POST ROUTES */
router.get('/', verifyToken, getFeedPosts);
router.get('/:userId', verifyToken, getUserPosts);
router.patch('/:postId/like', verifyToken, likePost);

export default router;