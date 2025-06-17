import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Box, ToggleButtonGroup, ToggleButton, Paper, Typography } from '@mui/material';
import './HomePage.css';

const HomePage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleTabChange = (event, value) => {
        if (value) navigate(value);
    };

    const currentTab = location.pathname.includes('for-you')
        ? 'for-you'
        : location.pathname.includes('search')
            ? 'search'
            : 'home';

    return (
        <Box className="register-container">
            {/* Animated Bubbles */}
             <Box className="bubble" />
             <Box className="bubble" />
             <Box className="bubble" />

            <Paper elevation={3} className="nav-container">
                <Typography variant="h4" className="nav-title">
                    Kafe Öneri Sistemi
                </Typography>
                <ToggleButtonGroup
                    color="primary"
                    value={currentTab}
                    exclusive
                    onChange={handleTabChange}
                    className="nav-buttons"
                >
                    <ToggleButton
                        value="/home"
                        className="nav-button"
                    >
                        ANA SAYFA
                    </ToggleButton>
                    <ToggleButton
                        value="/home/for-you"
                        className="nav-button"
                    >
                        FOR YOU
                    </ToggleButton>
                    <ToggleButton
                        value="/home/search"
                        className="nav-button"
                    >
                        ARA
                    </ToggleButton>
                </ToggleButtonGroup>
                <Box className="content-area">
                    <Outlet />
                </Box>
            </Paper>

        </Box>
    );
};

export default HomePage;