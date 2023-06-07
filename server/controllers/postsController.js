import Post from "../models/Post.js";
import User from "../models/User.js";

/** CONTROLLER FOR POST CREATION
 * app.use('/posts/create', verifyToken, upload.single('picture'), createPost)
 */
export const createPost = async (req, res, next) => {
  try {
    const {
      userId,
      description,
      picturePath
    } = req.body;
    // console.log('Data from input received');
    // console.log(req.body);
    const user = await User.findById(userId);
    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      userPicturePath: user.picturePath,
      localtion: user.location,
      description,
      picturePath,
      likes: {},
      comments: [],
    });
    await newPost.save();

    // const posts = await Post.find({userId}); // This would only return the posting user posts
    const posts = await Post.find(); // TODO: only return posts of friends (not myself or other users)
    res.status(201).json(posts);

  } catch (error) {
    console.log(error);
    res.status(409).json({ error: error.message });
  }
};

/** CONTROLLER TO OBTAIN FEED POSTS
 * router.get('/', verifyToken, getFeedPosts)
 */
export const getFeedPosts = async (req, res, next) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: error.message });
  }
};

/** CONTROLLER TO OBTAIN A USER POSTS HISTORY
 * router.get('/:userId/posts', verifyToken, getUserPosts)
 */
export const getUserPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({ userId: req.params.userId });
    res.status(200).json(posts);
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: error.message });
  }
};

/** CONTROLLER TO LIKE/DISLIKE A POSTS
 * router.patch('/:postId/like', verifyToken, likePost)
 */
export const likePost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { userId } = req.body; // from front-end request (click on like button)

    // const post = await Post.findById(postId);
    const { likes } = await Post.findById(postId); // same

    // Map.get() method to return a specific element among all elements in a map...
    // Map data structure here 
    // e.g.
    // const likes = new Map();
    // likes.set('userId', true/false);
    // const isLiked = post.likes.get(userId); // return boolean as set in Schema
    const isLiked = likes.get(userId); // same

    if (isLiked) {
      // Map.delete() method
      // post.likes.delete(userId);
      likes.delete(userId); // same
    } else {
      // post.likes.set(userId, true);
      likes.set(userId, true); // same
    };

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { likes },
      { new: true }
    );
    res.status(200).json(updatedPost);

  } catch (error) {
    console.log(error);
    res.status(404).json({ error: error.message });
  }
};

/** CONTROLLER TO COMMENT A POSTS
 * router.patch('/:postId/comment', verifyToken, likePost)
 */
export const commentPost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { userId, firstName, lastName, picturePath, commentText } = req.body; // from front-end request (click on comment button)

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    };

    const newComment = {
      userId, firstName, lastName, picturePath,
      commentText,
    };

    post.comments.push(newComment);
    const updatedPost = await post.save();
    res.status(200).json(updatedPost);

  } catch (error) {
    console.log(error);
    res.status(404).json({ error: error.message });
  }
};