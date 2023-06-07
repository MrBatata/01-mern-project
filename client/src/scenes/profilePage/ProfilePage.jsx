import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import FriendListWidget from "scenes/widgets/FriendListWidget";
import PostsWidget from "scenes/widgets/PostsWidget";
import UserWidget from "scenes/widgets/UserWidget";
import { UserContext } from "App";
import Navbar from "scenes/navbar/Navbar";
import { Box, useMediaQuery } from "@mui/material";

const ProfilePage = () => {
  const { token } = useContext(UserContext);
  const { userId } = useParams();
  const [userProfile, setUserProfile] = useState(null);
  const [userProfileFriendList, setUserProfileFriendList] = useState(null);

  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");

  const getUser = async () => {
    const response = await fetch(`http://localhost:3001/user/${userId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setUserProfile(data);
    // console.log(data);
  };

  const getUserFriends = async () => {
    try {
      const response = await fetch(`http://localhost:3001/user/${userId}/friends`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        // Handle non-successful response (e.g., 404, 500)
        throw new Error('Error occurred while fetching friends');
      };
      const data = await response.json();
      console.log('update');
      setUserProfileFriendList(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getUser();
    getUserFriends();
  }, [userId]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!userProfile) return null;

  return (
    <Box>
      <Navbar />
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="2rem"
        justifyContent="center"
      >
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
          <UserWidget
            userProfile={userProfile}
            isProfile={true} />
          <Box m="2rem 0" />
          <FriendListWidget
            userProfileId={userId}
            isProfile={true}
            userProfileFriendList={userProfileFriendList}
          />
        </Box>
        <Box
          flexBasis={isNonMobileScreens ? "42%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
          <PostsWidget
            userProfileId={userId}
            isProfile={true}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default ProfilePage;
