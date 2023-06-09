import React, { createContext, useMemo, useState } from 'react';
import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';
import HomePage from 'scenes/homePage/HomePage';
import ProfilePage from 'scenes/profilePage/ProfilePage';
import AuthPage from 'scenes/AuthPage/AuthPage';
import useLocalStorage from 'hooks/useLocalStorage';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { themeSettings } from 'theme';
import { Toaster } from 'react-hot-toast';
import { grey } from '@mui/material/colors';

/** CONTEXT */
export const ColorModeContext = createContext(null);
export const UserContext = createContext(null);

/** ROUTING APP */
function App() {
  const [colorMode, setColorMode] = useLocalStorage('colorMode', 'light');
  /** STATES FROM SERVER */
  const [user, setUser] = useLocalStorage('user', null);
  const [token, setToken] = useLocalStorage('token', null);
  const [posts, setPosts] = useLocalStorage('posts', []); // TODO: need to be in localStorage?
  const [friendList, setFriendList] = useLocalStorage('friendList', []); // TODO: need to be in localStorage?
  const [updatedComment, setUpdatedComment] = useState(null);
  const [updatedLike, setUpdatedLike] = useState(null);

  const isAuth = Boolean(token);
  // save in cache the result of the non-argument function untill dependency changes
  const theme = useMemo(() => createTheme(themeSettings(colorMode)), [colorMode]);

  const handleColorMode = () => {
    setColorMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    setPosts([]);
    setFriendList([]);
  };

  /** DOM */
  return (
    <div className="app">
      <BrowserRouter>
        <UserContext.Provider value={{
          user,
          setUser,
          token,
          setToken,
          posts,
          setPosts,
          friendList,
          setFriendList,
          updatedComment,
          setUpdatedComment,
          updatedLike,
          setUpdatedLike,
          handleLogout
        }}>
          <ColorModeContext.Provider value={{ handleColorMode }}>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <Toaster
                position="top-center"
                reverseOrder={false}
                gutter={8}
                containerClassName=""
                containerStyle={{
                }}
                toastOptions={{
                  // Define default options
                  className: '',
                  duration: 3000,
                  style: {
                    background: theme.palette.neutral.light,
                    color: theme.palette.neutral.dark,
                    paddingLeft: '25px'
                  },
                  // Default options for specific types
                  success: {
                    duration: 3000,
                    theme: {
                      light: 'green',
                      dark: 'black',
                    },
                  },
                }}
              />

              <Routes>
                <Route path='/' element={!isAuth ? <AuthPage /> : <Navigate to='/home' />} />
                <Route path='/home' element={isAuth ? <HomePage /> : <Navigate to='/' />} />
                <Route path='/profile/:userId' element={isAuth ? <ProfilePage /> : <Navigate to='/' />} />
              </Routes>

            </ThemeProvider>
          </ColorModeContext.Provider>
        </UserContext.Provider>
      </BrowserRouter>
    </div>
  );
};

export default App;