import React from 'react';
import { Grid, Button, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import background from '../../assets/background.png';
import './landingPage.css';

const LandingPage = () => {
    const navigate = useNavigate();


    const handleClick = () => {
        navigate('/register');
    };

    return (
        <Box className="landing-page-container">
            <img src={background} alt="Background" className="background-image" />
            <Grid container className="overlay" alignItems="center" justifyContent="space-between">
                <Grid item xs={12} md={6}>
                    <Typography variant="h3" className="motto-text">
                        En doğru kafeyi, sana özel önerilerle keşfet!
                    </Typography>
                </Grid>
                <Grid item xs={12} md={6} className="button-container">
                    <Button variant="contained" color="primary" size="large" onClick={handleClick}>
                        Kafe Bulmak İçin Tıkla
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};

export default LandingPage;