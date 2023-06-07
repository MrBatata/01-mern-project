import User from "../models/User.js";

/** CONTROLLER FOR USERS LIST
 * router.get('/allusers', verifyToken, allUsers)
 */
export const allUsers = async (req, res, next) => {
  // even if User.find is a promise and we could use .then().catch()
  // a try/catch aproach is more readalbe and modern
  try {
    const users = await User.find();
    // console.log(user);
    res.status(200).json(users);
  } catch (err) {
    res.status(404).json({ error: err.message })
  }
};

/** CONTROLLER FOR USER DATA
 * router.get('/:userId', verifyToken, getUser)
 */
export const getUser = async (req, res, next) => {
  // even if User.findById is a promise and we could use .then().catch()
  // a try/catch aproach is more readalbe and modern
  try {
    const { userId } = req.params;
    // console.log(id);
    const user = await User.findById(userId);

    const { _id, firstName, lastName, occupation, location, picturePath, createdAt, friends, impressions, viewedProfile } = user;
    const formattedUser = { _id, firstName, lastName, occupation, location, picturePath, createdAt, friends, impressions, viewedProfile };

    // console.log(user);
    res.status(200).json(formattedUser);
  } catch (err) {
    res.status(404).json({ error: err.message })
  }
};

/** CONTROLLER FOR FRIENDS ROUTE
 * router.get('/:userId/friends', verifyToken, getUserFriends)
 */
export const getUserFriends = async (req, res, next) => {
  // even if User.findById is a promise and we could use .then().catch()
  // a try/catch aproach is more readalbe and modern
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    // console.log(user);

    // get modified and formatted (no password) user friend list
    const friends = await Promise.all(
      user.friends.map((eachId) => User.findById(eachId))
      // TODO: we have all passwords here... is this safe?
    );
    // console.log(friends);
    const formattedFriends = friends.map(({ _id, firstName, lastName, occupation, location, picturePath }) => {
      return { _id, firstName, lastName, occupation, location, picturePath };
    });
    // console.log(formattedFriends);

    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

/** CONTROLLER FOR FRIEND ADD/REMOVE
 * router.patch('/:userId/:friendId', verifyToken, addRemoveFriend)
 */
export const addRemoveFriend = async (req, res) => {
  try {
    const { userId, friendId } = req.params;
    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    // if friendId is already in the user friends list, we should delete it
    // also remove user from the friend friends list
    if (user.friends.includes(friendId)) {
      user.friends = user.friends.filter((eachId) => eachId != friendId);
      friend.friends = friend.friends.filter((eachId) => eachId != userId);
    } else {
      // if friendId is not in the user friends list, we should add it
      friend.friends.push(userId);
      user.friends.push(friendId);
    }

    await user.save();
    await friend.save();

    // get modified and formatted (no password) user friend list
    const friends = await Promise.all(
      user.friends.map((eachId) => User.findById(eachId))
      // TODO: we have all passwords here... is this safe?
    );
    const formattedFriends = friends.map(({ _id, firstName, lastName, occupation, location, picturePath }) => {
      return { _id, firstName, lastName, occupation, location, picturePath };
    });

    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};