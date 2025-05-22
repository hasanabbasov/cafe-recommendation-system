import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography, Paper } from '@mui/material';

const AuthSelection = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleRegister = () => {
    navigate('/signup');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2, // Adds space between elements
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome!
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleLogin}
          sx={{ marginBottom: 1 }} // Adds margin below the login button
        >
          Login
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleRegister}
        >
          Register Account
        </Button>
      </Paper>
    </Box>
  );
};

export default AuthSelection;
