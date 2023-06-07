import { useContext, useEffect, useState } from 'react';
import { UserContext } from 'App';
import PostWidget from './PostWidget';

const PostsWidget = ({ userProfileId, isProfile = false }) => {
  const { posts, setPosts, token, setToken, setUser } = useContext(UserContext);
  const [updatedLike, setUpdatedLike] = useState(null);

  const getPosts = async () => {
    try {
      const response = await fetch('http://localhost:3001/post', {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('update');

      if (!response.ok) {
        // Handle non-successful response (e.g., 404, 500)
        setToken(null);
        setUser(null);
        setPosts([]);
        throw new Error('Error occurred while fetching posts');
      };
      const data = await response.json();
      const sortedPosts = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setPosts(sortedPosts);

    } catch (error) {
      // Handle the error
      console.error(error);
      setToken(null);
      setUser(null);
      setPosts([]);
      // You can show an error message to the user or perform any other necessary actions
    }
  };

  const getUserPosts = async () => {
    try {
      const response = await fetch(`http://localhost:3001/post/${userProfileId}`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('update');

      if (!response.ok) {
        // Handle non-successful response (e.g., 404, 500)
        setToken(null);
        setUser(null);
        setPosts([]);
        throw new Error('Error occurred while fetching posts');
      };

      const data = await response.json();
      const sortedPosts = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setPosts(sortedPosts);

    } catch (error) {
      console.error(error);
      setToken(null);
      setUser(null);
      setPosts([]);
    }
  };

  // not necessary if updatedLike in dependencies....
  // const updateLikes = () => {
  //   const updatedPosts = posts.map((eachPost) => {
  //     if (eachPost._id === updatedLike._id) return updatedLike;
  //     return eachPost;
  //   })
  //   setPosts(updatedPosts);
  // };
  // useEffect(() => {
  //   updateLikes();
  // }, [updatedLike]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isProfile) {
      getUserPosts();
    } else {
      getPosts();
    }    // updatedLike in dependencies to refresh all posts when liking/disliking
  }, [updatedLike, userProfileId]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {posts.map((eachPost) => (
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
          setUpdatedLike={setUpdatedLike}
        />
      ))}
    </>
  );
};

export default PostsWidget;
