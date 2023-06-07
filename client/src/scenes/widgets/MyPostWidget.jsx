import { useContext, useEffect, useState } from 'react';
import { UserContext } from 'App';
import FlexBetween from 'components/FlexBetween';
import Dropzone from 'react-dropzone';
import UserImage from 'components/UserImage';
import WidgetWrapper from 'components/WidgetWrapper';
import {
  EditOutlined,
  DeleteOutlined,
  AttachFileOutlined,
  GifBoxOutlined,
  ImageOutlined,
  MicOutlined,
  MoreHorizOutlined,
} from '@mui/icons-material';
import {
  Box,
  Divider,
  Typography,
  InputBase,
  useTheme,
  Button,
  IconButton,
  useMediaQuery,
} from '@mui/material';

const MyPostWidget = () => {
  /** DATA */
  const { token, setToken, user, setUser, setPosts } = useContext(UserContext);
  const [postDescription, setPost] = useState('');
  const [image, setImage] = useState(null);
  const [isImage, setIsImage] = useState(false);

  /** STYLES */
  const isNonMobileScreens = useMediaQuery('(min-width: 1000px)');
  const { palette } = useTheme();
  const mediumMain = palette.neutral.mediumMain;
  const medium = palette.neutral.medium;

  const getUser = async () => {
    try {
      const response = await fetch(`http://localhost:3001/user/${user._id}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('update');

      if (!response.ok) {
        // Handle non-successful response (e.g., 404, 500)
        setToken(null);
        setUser(null);
        setPosts([]);
        throw new Error('Error occurred while fetching user');
      };

    } catch (error) {
      // Handle the error
      setToken(null);
      setUser(null);
      setPosts([]);
      console.error(error);
      // You can show an error message to the user or perform any other necessary actions
    }
  };

  const handlePost = async () => {
    try {
      const formData = new FormData();
      formData.append('userId', user._id);
      formData.append('description', postDescription);
      if (image) {
        console.log(image);
        formData.append('picture', image);
        formData.append('picturePath', image.name);
      }

      const response = await fetch(`http://localhost:3001/posts/create`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      console.log('update');

      if (!response.ok) {
        // Handle non-successful response (e.g., 404, 500)
        setToken(null);
        setUser(null);
        setPosts([]);
        throw new Error('Error occurred while creating a post');
      }

      const data = await response.json();
      const sortedPosts = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setPosts(sortedPosts);
      setImage(null);
      setPost('');

    } catch (error) {
      // Handle the error
      setToken(null);
      setUser(null);
      setPosts([]);
      console.error(error);
      // You can show an error message to the user or perform any other necessary actions
    }
  };

  useEffect(() => {
    getUser();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <WidgetWrapper>
      <FlexBetween gap='1.5rem'>
        <UserImage image={user.picturePath} />
        <InputBase
          placeholder="What's on your mind..."
          onChange={(e) => setPost(e.target.value)}
          value={postDescription}
          sx={{
            width: '100%',
            backgroundColor: palette.neutral.light,
            borderRadius: '2rem',
            padding: '1rem 2rem',
          }}
        />
      </FlexBetween>
      {isImage && (
        <Box
          borderRadius='5px'
          mt='1rem'
          p='1rem'
        >
          <Dropzone
            acceptedFiles='.jpg,.jpeg,.png'
            multiple={false}
            onDrop={(acceptedFiles) => setImage(acceptedFiles[0])}
          >
            {({ getRootProps, getInputProps }) => (
              <FlexBetween>
                <Box
                  {...getRootProps()}
                  border={`2px dashed ${palette.primary.main}`}
                  borderRadius='10px'
                  p='1rem'
                  width='100%'
                  sx={{ '&:hover': { cursor: 'pointer' } }}
                >
                  <input {...getInputProps()} />
                  {!image ? (
                    <p>Add Image Here</p>
                  ) : (
                    <FlexBetween>
                      <Typography>{image.name}</Typography>
                      <EditOutlined />
                    </FlexBetween>
                  )}
                </Box>
                {image && (
                  <IconButton
                    onClick={() => setImage(null)}
                    sx={{ marginLeft: '1rem', padding: '1rem' }}
                  >
                    <DeleteOutlined />
                  </IconButton>
                )}
              </FlexBetween>
            )}
          </Dropzone>
        </Box>
      )}

      <Divider sx={{ margin: '1.25rem 0' }} />

      <FlexBetween>
        <FlexBetween gap='0.25rem' onClick={() => setIsImage(!isImage)}>
          <ImageOutlined sx={{ color: mediumMain }} />
          <Typography
            color={mediumMain}
            sx={{ '&:hover': { cursor: 'pointer', color: medium } }}
          >
            Image
          </Typography>
        </FlexBetween>

        {isNonMobileScreens ? (
          <>
            <FlexBetween gap='0.25rem'>
              <GifBoxOutlined sx={{ color: mediumMain }} />
              <Typography color={mediumMain}>Clip</Typography>
            </FlexBetween>

            <FlexBetween gap='0.25rem'>
              <AttachFileOutlined sx={{ color: mediumMain }} />
              <Typography color={mediumMain}>Attachment</Typography>
            </FlexBetween>

            <FlexBetween gap='0.25rem'>
              <MicOutlined sx={{ color: mediumMain }} />
              <Typography color={mediumMain}>Audio</Typography>
            </FlexBetween>
          </>
        ) : (
          <FlexBetween gap='0.25rem'>
            <MoreHorizOutlined sx={{ color: mediumMain }} />
          </FlexBetween>
        )}

        <Button
          disabled={!postDescription}
          onClick={handlePost}
          sx={{
            backgroundColor: palette.primary.main,
            color: palette.background.alt,
            '&:hover': { color: palette.primary.main },
            '&:disabled': { color: medium, backgroundColor: mediumMain },
            borderRadius: '3rem',
          }}
        >
          POST
        </Button>
      </FlexBetween>
    </WidgetWrapper>
  );
};

export default MyPostWidget;
