import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import useLocalStorage from 'hooks/useLocalStorage';
import { createContext, useMemo } from 'react';
import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';
import HomePage from 'scenes/homePage/HomePage';
import LoginPage from 'scenes/AuthPage/AuthPage';
import ProfilePage from 'scenes/profilePage/ProfilePage';
import { themeSettings } from 'theme';

export const ColorModeContext = createContext(null);
export const UserContext = createContext(null);

function App() {

  const [colorMode, setColorMode] = useLocalStorage('colorMode', 'light');

  const [user, setUser] = useLocalStorage('user', null);
  const [token, setToken] = useLocalStorage('token', null);
  const [posts, setPosts] = useLocalStorage('posts', []);
  const isAuth = Boolean(token);

  const handleColorMode = () => {
    setColorMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    setPosts([]);
  };

  const handleFriends = (friends) => {
    if (user) {
      setUser(
        ...user,
        user.friends = friends
      )
    } else {
      console.error('user friends non-existent');
    }
  };

  // save in cache the result of the non-argument function untill dependency changes
  const theme = useMemo(() => createTheme(themeSettings(colorMode)), [colorMode]);

  return (
    <div className="app">
      <BrowserRouter>

        <UserContext.Provider value={{ user, setUser, token, setToken, posts, setPosts, handleLogout, handleFriends }}>
          <ColorModeContext.Provider value={{ handleColorMode }}>
            <ThemeProvider theme={theme}>
              <CssBaseline />

              <Routes>
                <Route path='/' element={(!isAuth) ? <LoginPage /> : <Navigate to='/home' />} />
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