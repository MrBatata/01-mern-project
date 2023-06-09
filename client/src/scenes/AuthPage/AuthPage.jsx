import React from 'react';
import Form from './Form';
import { Box, Typography, useTheme, useMediaQuery } from '@mui/material';

const AuthPage = () => {
  /** STYLES */
  const theme = useTheme();
  const isNonMobileScreens = useMediaQuery('(min-width: 1000px)');

  /** DOM */
  return (
    <Box>
      <Box width='100%'
        p='1rem 6%'
        textAlign='center'
        backgroundColor={theme.palette.background.alt}
      >
        <Typography fontWeight='bold' fontSize='32px' color='primary'>
          MrBatata's club
        </Typography>
      </Box>
      <Box width={isNonMobileScreens ? '50%' : '93%'}
        p='2rem'
        m='2rem auto'
        borderRadius='1.5rem'
        backgroundColor={theme.palette.background.alt}
      >
        <Typography fontWeight='500' variant='h5' sx={{ mb: '1.5rem' }}>
          MrBatata welcomes you!
        </Typography>

        {/* REGISTER OR LOGIN */}
        <Form />

      </Box>
    </Box>
  );
};

export default AuthPage;