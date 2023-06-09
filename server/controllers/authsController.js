import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/** JSON WEB TOKEN CREATION */
const maxAge = 30 * 60; // time duration of token within server (2 hours in seconds)
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: maxAge
  });
};

/** USER REGISTER CONTROLLER */
export const registerController = async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      friends,
      location,
      occupation
    } = req.body;
    console.log('Data from input received');

    const salt = await bcrypt.genSalt(); // could be done as mongoose pre hook
    const passwordHash = await bcrypt.hash(password, salt);
    // console.log(passwordHash);
    console.log('Password successfully hashed');

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      picturePath,
      friends,
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 10000),
      impressions: Math.floor(Math.random() * 10000),
    });
    const savedUser = await newUser.save();

    const token = createToken(savedUser._id);
    // Need to send status, token as cookie and user (just id or email) to the browser
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 }); // cookie duration in miliseconds

    res.status(201).json(savedUser);

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

/** USER LOGIN CONTROLLER */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log('Data from input received');

    const loggedUser = await User.findOne({ email });
    if (!loggedUser) return res.status(400).json({ msg: 'User does not exist.' });
    // console.log('user exists');

    const isAuth = await bcrypt.compare(password, loggedUser.password);
    if (!isAuth) return res.status(400).json({ msg: 'Password is incorrect.' });
    // console.log(loggedUser);
    // console.log('user successfully logged in');
    // to make sure not sent to front-end
    const userWithoutPassword = loggedUser.toObject(); // convert to plain JavaScript object, cannot delete property if it's a schema
    delete userWithoutPassword.password; // delete the "password" property

    const token = createToken(loggedUser._id);
    // Need to send status, token as cookie and user (just id or email) to the browser
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 }); // cookie duration in miliseconds
    res.status(200).json({ userWithoutPassword, token });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

/** USER LOGOUT CONTROLLER */
// export const logout_get = (req, res) => {
// 	// not possible to delete cookie from browser
// 	// so we update the jwt cookie for a dummy one and with a almost null duration (1 milisec)
// 	res.cookie('jwt', '', { maxAge: 1 });
// 	res.redirect('/');
// };