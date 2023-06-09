import React from 'react';
import Navbar from 'scenes/navbar/Navbar';
import { Box, useMediaQuery } from '@mui/material';
import UserWidget from 'scenes/widgets/UserWidget';
import MyPostWidget from 'scenes/widgets/MyPostWidget';
import PostsWidget from 'scenes/widgets/PostsWidget';
import FriendListWidget from 'scenes/widgets/FriendListWidget';

const HomePage = () => {
  const isNonMobileScreens = useMediaQuery("(min-width:1100px)");

  /** DOM */
  return (
    <Box>
      <Navbar />

      <Box
        display={isNonMobileScreens ? "flex" : "block"}
        justifyContent="space-between"
        width="100%"
        padding="2rem 6%"
        gap="0.5rem"
      >
        {/* SECTION 1 */}
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
          <UserWidget />
        </Box>

        {/* SECTION 2 */}
        <Box
          flexBasis={isNonMobileScreens ? "42%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
          <MyPostWidget />
          <PostsWidget />
        </Box>

        {/* SECTION 3: only desktop */}
        {isNonMobileScreens && (
          <Box flexBasis="26%">
            <FriendListWidget />
          </Box>
        )}
      </Box>
    </Box>
  )
};

export default HomePage;