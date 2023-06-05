import express from 'express';
import { login } from '../controllers/authsController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

/** AUTH ROUTES */
// app.post('/auth/register', upload.single('picture'), registerController); // TODO: possible to move to auth routes? Problem is we need upload middleware
router.post('/login', login);
router.get('/protected', verifyToken, (req, res) => { res.send('User verified!') });

export default router;