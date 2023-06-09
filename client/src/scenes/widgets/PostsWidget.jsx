import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from 'App';
import PostWidget from './PostWidget';
import WidgetWrapper from 'components/WidgetWrapper';

const PostsWidget = ({ userProfilePosts, isProfile = false }) => {
  const { posts, setPosts, token, updatedComment, updatedLike } = useContext(UserContext);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);

  const getPosts = async () => {
    try {
      const response = await fetch('http://localhost:3001/post', {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('update');

      if (!response.ok) {
        // Handle non-successful response (e.g., 404, 500)
        setIsLoadingPosts(false);
        throw new Error('Error occurred while fetching posts');
      };

      const data = await response.json();
      const sortedPosts = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setPosts(sortedPosts);
      setTimeout(() => {
        setIsLoadingPosts(false);
      }, 1000);

    } catch (error) {
      // Handle the error
      console.error(error);
      setIsLoadingPosts(false);
    }
  };

  useEffect(() => {
    getPosts();
    // updatedLike in dependencies to refresh all posts when liking/disliking
  }, [updatedLike, updatedComment]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {
        ((!isProfile)
          ? (isLoadingPosts
            ? <WidgetWrapper m='2rem 0'>Loading...</WidgetWrapper>
            : (posts.map((eachPost) => (
              <PostWidget
                key={eachPost._id}
                postId={eachPost._id}
                postUserId={eachPost.userId}
                name={`${eachPost.firstName} ${eachPost.lastName}`}
                description={eachPost.description}
                picturePath={eachPost.picturePath}
                userPicturePath={eachPost.userPicturePath}
                likes={eachPost.likes}
                comments={eachPost.comments}
                createdAt={eachPost.createdAt}
              />)
            )))
          : (userProfilePosts.map((eachPost) => (
            <PostWidget
              key={eachPost._id}
              postId={eachPost._id}
              postUserId={eachPost.userId}
              name={`${eachPost.firstName} ${eachPost.lastName}`}
              description={eachPost.description}
              picturePath={eachPost.picturePath}
              userPicturePath={eachPost.userPicturePath}
              likes={eachPost.likes}
              comments={eachPost.comments}
              createdAt={eachPost.createdAt}
            />)
          ))
        )
      }
    </>
  );
};

export default PostsWidget;
