import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Box, ToggleButtonGroup, ToggleButton, Paper, Typography } from '@mui/material';

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
        <Box sx={{ backgroundColor: '#fdf6ee', minHeight: '100vh', py: 4 }}>
            <Paper elevation={3} sx={{ mb: 4, py: 2, px: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: 3 }}>
                <Typography variant="h4" fontWeight="bold">Kafe Öneri Sistemi</Typography>
                <ToggleButtonGroup
                    color="primary"
                    value={currentTab}
                    exclusive
                    onChange={handleTabChange}
                >
                    <ToggleButton value="/home">ANA SAYFA</ToggleButton>
                    <ToggleButton value="/home/for-you">FOR YOU</ToggleButton>
                    <ToggleButton value="/home/search">ARA</ToggleButton>
                </ToggleButtonGroup>
            </Paper>
            <Box px={3}>
                <Outlet />
            </Box>
        </Box>
    );
};

export default HomePage;