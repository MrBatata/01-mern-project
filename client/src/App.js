import React, { createContext, useMemo } from 'react';
import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';
import HomePage from 'scenes/homePage/HomePage';
import ProfilePage from 'scenes/profilePage/ProfilePage';
import AuthPage from 'scenes/AuthPage/AuthPage';
import useLocalStorage from 'hooks/useLocalStorage';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { themeSettings } from 'theme';

/** CONTEXT */
export const ColorModeContext = createContext(null);
export const UserContext = createContext(null);

/** ROUTING APP */
function App() {
  const [colorMode, setColorMode] = useLocalStorage('colorMode', 'light');
  /** STATES FROM SERVER */
  const [user, setUser] = useLocalStorage('user', null);
  const [token, setToken] = useLocalStorage('token', null);
  const [posts, setPosts] = useLocalStorage('posts', []);
  const [friendList, setFriendList] = useLocalStorage('friendList', []);
  const isAuth = Boolean(token);

  const handleColorMode = () => {
    setColorMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    setPosts([]);
    setFriendList([]);
  };

  // save in cache the result of the non-argument function untill dependency changes
  const theme = useMemo(() => createTheme(themeSettings(colorMode)), [colorMode]);

  /** DOM */
  return (
    <div className="app">
      <BrowserRouter>

        <UserContext.Provider value={{ user, setUser, token, setToken, posts, setPosts, friendList, setFriendList, handleLogout }}>
          <ColorModeContext.Provider value={{ handleColorMode }}>
            <ThemeProvider theme={theme}>
              <CssBaseline />

              <Routes>
                <Route path='/' element={(!isAuth) ? <AuthPage /> : <Navigate to='/home' />} />
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