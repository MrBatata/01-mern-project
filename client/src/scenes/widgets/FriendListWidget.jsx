import { Box, Typography, useTheme } from "@mui/material";
import { UserContext } from "App";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useContext, useEffect } from "react";

const FriendListWidget = ({ userId }) => {

  const { user, token, friendList, handleFriends } = useContext(UserContext);
  const { palette } = useTheme();


  const getFriends = async () => {
    const response = await fetch(
      `http://localhost:3001/user/${user._id}/friends`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    handleFriends(data);
  };

  useEffect(() => {
    getFriends();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <WidgetWrapper>
      <Typography
        color={palette.neutral.dark}
        variant="h5"
        fontWeight="500"
        sx={{ mb: "1.5rem" }}
      >
        Friend List
      </Typography>
      <Box display="flex" flexDirection="column" gap="1.5rem">
        {friendList.map((friend) => (
          <Friend
            key={friend._id}
            friendId={friend._id}
            name={`${friend.firstName} ${friend.lastName}`}
            subtitle={friend.occupation}
            userPicturePath={friend.picturePath}
          />
        ))}
      </Box>
    </WidgetWrapper>
  );
};

export default FriendListWidget;
