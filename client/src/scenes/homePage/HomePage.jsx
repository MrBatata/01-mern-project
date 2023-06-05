import React from 'react';
import Navbar from 'scenes/navbar/Navbar';
import { Box, useMediaQuery } from '@mui/material';
import UserWidget from 'scenes/widgets/UserWidget';
import MyPostWidget from 'scenes/widgets/MyPostWidget';
import PostsWidget from 'scenes/widgets/PostsWidget';

const HomePage = () => {
  const isNonMobileScreens = useMediaQuery("(min-width:1100px)");

  return (
    <Box>
      <Navbar />
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="0.5rem"
        justifyContent="space-between"
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
          <Box flexBasis="26%"> Section 3
            <Box m="2rem 0" />
          </Box>
        )}
      </Box>
    </Box>
  )
};

export default HomePage;