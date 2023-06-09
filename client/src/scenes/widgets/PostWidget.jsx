import React, { useContext, useState } from 'react';
import { UserContext } from 'App';
import FlexBetween from 'components/FlexBetween';
import Friend from 'components/Friend';
import WidgetWrapper from 'components/WidgetWrapper';
import { Box, Button, Divider, IconButton, InputBase, Typography, useTheme } from '@mui/material';
import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
  Send
} from '@mui/icons-material';
import UserImage from 'components/UserImage';

/** COMPONENT THAT DISPLAYS INDIVIDUAL POST */
const PostWidget = ({
  postId,
  postUserId,
  name,
  description,
  picturePath,
  userPicturePath,
  likes,
  comments,
  createdAt,
}) => {
  const { user, token, setUpdatedComment, setUpdatedLike } = useContext(UserContext);
  const [commentText, setCommentText] = useState('');
  const [isComments, setIsComments] = useState(false);
  const isLiked = Boolean(likes[user._id]);
  const likeCount = Object.keys(likes).length;

  /** LIKES STRUCTURE (MAP) */
  // likes e.g.
  // post.likes = {
  //   'userId1': true,
  //   'userId2': true,
  //   ....
  // } 

  /** STYLES */
  const theme = useTheme();
  const main = theme.palette.neutral.main;
  const primary = theme.palette.primary.main;


  /** FUNCTION TO LIKE A POST AND GET THE UPDATED ONE */
  const patchLike = async () => {
    try {
      const response = await fetch(`http://localhost:3001/post/${postId}/like`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user._id }),
      });
      console.log('update');

      if (!response.ok) {
        // Handle non-successful response (e.g., 404, 500)
        throw new Error('Error occurred while fetching post like');
      };

      const updatedPost = await response.json();
      setUpdatedLike(updatedPost);

    } catch (error) {
      console.log(error);
    }
  };

  /** FUNCTION TO COMMENT A POST AND GET THE UPDATED ONE */
  const patchComment = async () => {
    try {
      const response = await fetch(`http://localhost:3001/post/${postId}/comment`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user._id,
          commentText: commentText,
          firstName: user.firstName,
          lastName: user.lastName,
          picturePath: user.picturePath,
        }),
      });
      console.log('update');

      if (!response.ok) {
        // Handle non-successful response (e.g., 404, 500)
        throw new Error('Error occurred while fetching post comment');
      };

      const updatedPost = await response.json();
      setUpdatedComment(updatedPost);
      setCommentText('');

    } catch (error) {
      console.log(error);
    }
  };

  /** DATE FORMATING */
  const originalDate = new Date(createdAt);
  const utcMinus3Date = new Date(originalDate.getTime() - (3 * 60 * 60 * 1000))
  const prettierDate = utcMinus3Date.toLocaleString('es-US', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'UTC'
  });

  /** DOM */
  return (
    <WidgetWrapper m='2rem 0'>

      {/* POST USER DATA */}
      <Friend
        friendId={postUserId}
        name={name}
        subtitle={prettierDate}
        userPicturePath={userPicturePath}
      />

      {/* POST TEXT DESCRIPTION */}
      <Typography color={main} sx={{ mt: '1rem' }}>
        {description}
      </Typography>

      {picturePath && (
        <img
          width='100%'
          height='auto'
          alt='post'
          style={{ borderRadius: '0.75rem', marginTop: '0.75rem' }}
          src={`http://localhost:3001/assets/${picturePath}`}
        />
      )}

      {/* POST PICTURE */}
      <FlexBetween mt='0.25rem'>
        <FlexBetween gap='1rem'>
          <FlexBetween gap='0.3rem'>
            <IconButton onClick={patchLike}>
              {isLiked
                ? <FavoriteOutlined sx={{ color: primary }} />
                : <FavoriteBorderOutlined />
              }
            </IconButton>
            <Typography>{likeCount}</Typography>
          </FlexBetween>
          <FlexBetween gap='0.3rem'>
            <IconButton onClick={() => setIsComments(!isComments)}>
              <ChatBubbleOutlineOutlined />
            </IconButton>
            <Typography>{comments.length}</Typography>
          </FlexBetween>
        </FlexBetween>
        <IconButton>
          <ShareOutlined />
        </IconButton>
      </FlexBetween>

      {/* POST COMMENTS */}
      {isComments && (
        <Box mt='0.5rem'>
          {comments.map((eachComment) => (
            <Box key={eachComment._id}>
              <Divider variant='inset' />
              <Box display='flex' alignItems='center' gap='1rem'>
                <Box ml='2rem'>
                  <UserImage image={eachComment.picturePath} size='20px' />
                </Box>
                <Typography sx={{ color: main, my: '0.5rem' }}>
                  <b>{`${eachComment.firstName} ${eachComment.lastName}: `}</b>
                </Typography>
                <Typography sx={{ color: main, my: '0.5rem' }}>
                  {eachComment.commentText}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      )}

      {/* COMMENT INPUT */}
      <FlexBetween mt='1rem'>
        <UserImage image={user.picturePath} size='40px' />
        <InputBase
          placeholder='Comenta este posteo...'
          onChange={(e) => setCommentText(e.target.value)}
          value={commentText}
          sx={{
            margin: '0 1rem 0 1rem',
            width: '100%',
            height: '25px',
            backgroundColor: theme.palette.neutral.light,
            borderRadius: '0.75rem',
            padding: '1rem 1rem',
          }}
        />
        <Button
          disabled={!commentText}
          onClick={patchComment}
          sx={{
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.background.alt,
            '&:hover': { color: theme.palette.primary.main },
            '&:disabled': {
              backgroundColor: theme.palette.primary.light,
              color: theme.palette.neutral.medium
            },
            borderRadius: '1rem',
          }}
        >
          <Send />
        </Button>
      </FlexBetween>

    </WidgetWrapper>
  );
};

export default PostWidget;
