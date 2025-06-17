import React, { useEffect, useRef } from 'react';
import { 
    Box, 
    Button, 
    Typography, 
    Container, 
    AppBar, 
    Toolbar, 
    Grid,
    IconButton,
    Link
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import './landingPage.css';

const LandingPage = () => {
    const navigate = useNavigate();
    const scrollRef = useRef(null);

    const handleLoginClick = () => {
        // Placeholder for login functionality
        console.log('Login clicked');
    };

    const handleHomeClick = () => {
        navigate('/');
    };

    useEffect(() => {
        const handleScroll = () => {
            const element = scrollRef.current;
            if (element) {
                const rect = element.getBoundingClientRect();
                const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;
                if (isVisible) {
                    element.classList.add('animate');
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <Box className="landing-page">
            {/* Header */}
            <AppBar position="fixed" className="header">
                <Toolbar>
                    <Typography variant="h6" className="logo" onClick={handleHomeClick}>
                        Cafefinder
                    </Typography>
                    <Box className="header-right">
                        <Button color="inherit" onClick={handleHomeClick}>Homepage</Button>
                        <Button 
                            variant="contained" 
                            className="login-button"
                            onClick={handleLoginClick}
                        >
                            Login
                        </Button>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Main Content */}
            <Container className="main-content">
                <Box className="hero-section">
                    <Box className="hero-text">
                        <Typography variant="h2" className="motto">
                            Your ultimate cafe finder
                        </Typography>
                        <Typography variant="h5" className="subtitle">
                            Discover the perfect spot for your next coffee break
                        </Typography>
                    </Box>
                    <Box className="hero-image">
                        <img 
                            src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
                            alt="Cafe ambiance" 
                        />
                    </Box>
                </Box>

                {/* Enhanced Perfect Match Section */}
                <Box className="scroll-section" ref={scrollRef}>
                    <Box className="match-container">
                        <Typography variant="h4" className="scroll-title">
                            Perfect Match Found!
                        </Typography>
                        <Box className="match-card">
                            <Box className="match-badge">Best Match</Box>
                            <Typography variant="h2" className="cafe-name">
                                Küçük Park
                            </Typography>
                            <Box className="match-stats-container">
                                <Typography variant="h6" className="match-stats">
                                    Best match among 114 cafes
                                </Typography>
                                <Box className="match-details">
                                    <Box className="match-detail-item">
                                        <LocationOnIcon />
                                        <Typography>Downtown Area</Typography>
                                    </Box>
                                    <Box className="match-detail-item">
                                        <Typography>⭐ 4.8</Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Container>

            {/* Enhanced Footer */}
            <Box className="footer">
                <Container>
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={4}>
                            <Typography variant="h6" className="footer-title">About Us</Typography>
                            <Typography variant="body2" className="footer-text">
                                Cafefinder helps you discover the perfect cafe experience tailored to your preferences.
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Typography variant="h6" className="footer-title">Quick Links</Typography>
                            <Box className="footer-links">
                                <Link href="#" className="footer-link">Home</Link>
                                <Link href="#" className="footer-link">About</Link>
                                <Link href="#" className="footer-link">Services</Link>
                                <Link href="#" className="footer-link">Contact</Link>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Typography variant="h6" className="footer-title">Contact Us</Typography>
                            <Box className="contact-info">
                                <Box className="contact-item">
                                    <EmailIcon />
                                    <Typography>contact@cafefinder.com</Typography>
                                </Box>
                                <Box className="contact-item">
                                    <PhoneIcon />
                                    <Typography>+1 (555) 123-4567</Typography>
                                </Box>
                                <Box className="contact-item">
                                    <LocationOnIcon />
                                    <Typography>123 Cafe Street, City</Typography>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                    <Box className="footer-bottom">
                        <Box className="social-icons">
                            <IconButton className="social-icon"><FacebookIcon /></IconButton>
                            <IconButton className="social-icon"><TwitterIcon /></IconButton>
                            <IconButton className="social-icon"><InstagramIcon /></IconButton>
                            <IconButton className="social-icon"><LinkedInIcon /></IconButton>
                        </Box>
                        <Typography variant="body2" className="copyright">
                            © 2024 Cafefinder. All rights reserved.
                        </Typography>
                    </Box>
                </Container>
            </Box>
        </Box>
    );
};

export default LandingPage;