import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import FriendListWidget from 'scenes/widgets/FriendListWidget';
import PostsWidget from 'scenes/widgets/PostsWidget';
import UserWidget from 'scenes/widgets/UserWidget';
import { UserContext } from 'App';
import Navbar from 'scenes/navbar/Navbar';
import { Box, useMediaQuery } from '@mui/material';

const ProfilePage = () => {
  const { token, friendList, updatedComment, updatedLike } = useContext(UserContext);
  const { userId } = useParams();
  const [userProfile, setUserProfile] = useState(null);
  const [userProfileFriendList, setUserProfileFriendList] = useState(null);
  const [userProfilePosts, setUserProfilePosts] = useState(null);

  /** STYLES */
  const isNonMobileScreens = useMediaQuery('(min-width:1000px)');

  /** FETCH USER FOR PROFILE PAGE DATA */
  const getUserData = async () => {
    try {
      const response = await fetch(`http://localhost:3001/user/${userId}`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        // Handle non-successful response (e.g., 404, 500)
        throw new Error('Error occurred while fetching profile user data');
      };

      console.log('update');
      const data = await response.json();
      setUserProfile(data);

    } catch (error) {
      console.error(error);
    }
  };

  /** FETCH USER FOR PROFILE PAGE FRIEND LIST */
  const getUserFriends = async () => {
    try {
      const response = await fetch(`http://localhost:3001/user/${userId}/friends`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        // Handle non-successful response (e.g., 404, 500)
        throw new Error('Error occurred while fetching profile user friends');
      };

      console.log('update');
      const data = await response.json();
      setUserProfileFriendList(data);

    } catch (error) {
      console.error(error);
    }
  };

  /** FETCH USER FOR PROFILE PAGE FRIEND POSTS */
  const getUserPosts = async () => {
    try {
      const response = await fetch(`http://localhost:3001/post/${userId}`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        // Handle non-successful response (e.g., 404, 500)
        throw new Error('Error occurred while fetching profile user posts');
      };

      console.log('update');
      const data = await response.json();
      const sortedPosts = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setUserProfilePosts(sortedPosts);

    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getUserData();
    getUserFriends();
    getUserPosts();
  }, [userId, friendList, updatedComment, updatedLike]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!userProfile) return null;

  /** DOM */
  return (
    <Box>
      <Navbar />

      <Box
        width='100%'
        padding='2rem 6%'
        display={isNonMobileScreens ? 'flex' : 'block'}
        gap='2rem'
        justifyContent='center'
      >
        {/* USER DATA */}
        <Box flexBasis={isNonMobileScreens ? '26%' : undefined}>

          {/* USER PROFILE */}
          <UserWidget
            userProfile={userProfile}
            isProfile={true}
          />

          <Box mb='2rem' />

          {/* USER FRIENDS */}
          {userProfileFriendList && (
            <FriendListWidget
              userProfileFriendList={userProfileFriendList}
              isProfile={true}
            />
          )}
        </Box>

        {/* USER POSTS */}
        <Box
          flexBasis={isNonMobileScreens ? '42%' : undefined}
          mt={isNonMobileScreens ? undefined : '2rem'}
        >
          {userProfilePosts && (
            <PostsWidget
              userProfilePosts={userProfilePosts}
              isProfile={true}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ProfilePage;
