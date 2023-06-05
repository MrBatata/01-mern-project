/** IMPORTING MODULES */
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import helmet from 'helmet';
import morgan from 'morgan';

/** NATIVE PACKAGES CONFIG
 * (for directories configuration)
 */
import path from 'path';
import { fileURLToPath } from 'url';
import { registerController } from './controllers/authsController.js';

/** IMPORT MODELS, ROUTES, CONTROLLERS, CUSTOM MIDDLEWARES */
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';
import { verifyToken } from './middleware/authMiddleware.js';
import { createPost } from './controllers/postsController.js';
import User from './models/User.js';
import Post from './models/Post.js';
import { dummyUsers, dummyPosts } from './data/index.js';

/** MIDDLEWARE CONFIG */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** ENVIRONMENT VARIABLES LOADING */
dotenv.config();

/** EXPRESS APP CREATION */
const app = express();
app.set('view engine', 'ejs');

/** MIDDLEWARE SETUP */
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use(morgan('common'));
// starting from Express 4.16 onwards, the express.json() and express.urlencoded() middleware are included by default in Express, 
// eliminating the need for explicitly requiring and configuring body-parser. 
// app.use(bodyParser.json({ limit: '30mb', extended: true })); // 
// app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ limit: '30mb', extended: true }));
app.use(cors());
app.use('/assets', express.static(path.join(__dirname, 'public/assets')));

/** MULTER SETUP
 * Middleware for file uploads (e.g. pictures)
 * The disk storage engine gives you full control on storing files to disk.
 * https://github.com/expressjs/multer
 */
const storage = multer.diskStorage({
  // determine within which folder the uploaded files should be stored
  destination: function (req, file, cb) {
    cb(null, 'public/assets');
  },
  // determine what the file should be named inside the folder
  filename: function (req, file, cb) {
    // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    // cb(null, file.fieldname + '-' + uniqueSuffix)
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

/** ROUTES WITH FILES */
// app.post(PATH, MIDDLEWARE, CONTROLLER)
app.post('/auth/register', upload.single('picture'), registerController); // TODO: possible to move to auth routes? Problem is we need upload middleware
app.use('/posts/create', verifyToken, upload.single('picture'), createPost);

/** ROUTES */
app.get('/', (req, res, next) => {
  res.render('home')
});
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/post', postRoutes);

/** MONGODB CONNECTION WITH MONGOOSE */
const PORT = process.env.PORT || 6001; // 6001 backup port
const MONGO_URL = process.env.MONGO_URL;
mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then((res) => {
    app.listen(PORT, () => console.log(`connected to http://localhost:${PORT}/`));

    // ADD DUMMY DATA ONLY ONE TIME
    // User.insertMany(dummyUsers);
    // Post.insertMany(dummyPosts);
  })
  .catch((err) => console.log(`not connected due to: ${err}`));