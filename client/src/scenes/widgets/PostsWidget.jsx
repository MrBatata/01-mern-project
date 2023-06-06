import { useContext, useEffect } from 'react';
import { UserContext } from 'App';
import PostWidget from './PostWidget';

const PostsWidget = () => {
  const { posts, setPosts, token, setToken, setUser } = useContext(UserContext);

  const getPosts = async () => {
    try {
      const response = await fetch('http://localhost:3001/post', {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });
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

  // const getUserPosts = async () => {
  //   const response = await fetch(`http://localhost:3001/post/${userId}`, {
  //     method: 'GET',
  //     headers: { Authorization: `Bearer ${token}` },
  //   });
  //   const data = await response.json();
  //   setPosts({ posts: data });
  // };

  useEffect(() => {
    getPosts();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
        />
      ))}
    </>
  );
};

export default PostsWidget;
