import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import {
  allUsers, // TODO: remove
  getUser,
  getUserFriends,
  addRemoveFriend
} from '../controllers/usersControler.js';

const router = express.Router();

/** USER ROUTES */
router.get('/allusers', verifyToken, allUsers)
router.get('/:userId', verifyToken, getUser);
router.get('/:userId/friends', verifyToken, getUserFriends);
router.patch('/:userId/:friendId', verifyToken, addRemoveFriend);

export default router;