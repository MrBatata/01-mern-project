import mongoose from "mongoose";
const Schema = mongoose.Schema;

const CommentSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    commentText: {
      type: String,
      required: true,
    },
    picturePath: String,
  },
  { timestamps: true }
);

/** MONGOOSE SCHEMA */
const PostSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    userPicturePath: String,
    location: String,
    description: {
      type: String,
      max: 200,
    },
    picturePath: String,
    likes: {
      type: Map,
      of: Boolean,
    },
    comments: [CommentSchema], // Array of comments
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", PostSchema); // db should be called posts
export default Post;
