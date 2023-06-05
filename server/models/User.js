import mongoose from "mongoose";
const Schema = mongoose.Schema;
import pkg from 'validator';
const { isEmail } = pkg;

/** MONGOOSE SCHEMA */
const UserSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, 'Please enter a first name'],
      lowercase: true,
      min: 2,
      max: 50,
    },
    lastName: {
      type: String,
      required: [true, 'Please enter a last name'],
      lowercase: true,
      min: 2,
      max: 50,
    },
    email: {
      type: String,
      required: [true, 'Please enter an email'],
      unique: true,
      lowercase: true,
      max: 50,
      validate: [isEmail, 'Please enter a valid email']
    },
    password: {
      type: String,
      required: [true, 'Please enter a password'],
      minlength: [6, 'Minimum password length is 6 characters'],
    },
    picturePath: {
      type: String,
      default: "",
    },
    friends: {
      type: Array,
      default: [],
    },
    location: String,
    occupation: String,
    viewedProfile: Number,
    impressions: Number,
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema); // db should be called users
export default User;
