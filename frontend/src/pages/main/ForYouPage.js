import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    Divider,
    ToggleButtonGroup,
    ToggleButton,
    Rating,
    Chip
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import PeopleIcon from '@mui/icons-material/People';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import PsychologyIcon from '@mui/icons-material/Psychology';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';

const ForYouPage = () => {
    const [contentBased, setContentBased] = useState([]);
    const [collaborativeUser, setCollaborativeUser] = useState([]);
    const [collaborativeItem, setCollaborativeItem] = useState([]);
    const [hybrid, setHybrid] = useState([]);
    const [activeCollaborative, setActiveCollaborative] = useState('user');

    const userId = localStorage.getItem('user_id');

    useEffect(() => {
        if (!userId) return;

        // Content-Based
        fetch(`http://127.0.0.1:5000/recommendations/${userId}`)
            .then(res => res.json())
            .then(data => setContentBased(data))
            .catch(err => console.error("CB error", err));

        // User-Based CF
        fetch(`http://127.0.0.1:5000/recommendations/${userId}/cf`)
            .then(res => res.json())
            .then(data => setCollaborativeUser(data))
            .catch(err => console.error("CF error", err));

        // Item-Based CF
        fetch(`http://127.0.0.1:5000/recommendations/${userId}/item-cf`)
            .then(res => res.json())
            .then(data => setCollaborativeItem(data))
            .catch(err => console.error("Item CF error", err));

        // Hybrid
        fetch(`http://127.0.0.1:5000/recommendations/${userId}/hybrid`)
            .then(res => res.json())
            .then(data => setHybrid(data))
            .catch(err => console.error("Hybrid error", err));
    }, [userId]);

    const renderCafeCard = (cafe) => (
        <Grid item xs={12} sm={6} md={4} key={cafe.cafe_id}>
            <Card className="cafe-card">
                <CardContent className="cafe-content">
                    <Typography variant="h6" className="cafe-name">
                        {cafe.name}
                    </Typography>
                    <Box className="cafe-info">
                        <Box className="cafe-rating">
                            <Rating 
                                value={cafe.rating} 
                                precision={0.5} 
                                readOnly 
                                size="small"
                            />
                            <Typography variant="body2">
                                {cafe.rating?.toFixed(1) || 'N/A'}
                            </Typography>
                        </Box>
                        {cafe.score && (
                            <Typography className="cafe-reviews">
                                Skor: {cafe.score.toFixed(2)}
                            </Typography>
                        )}
                    </Box>
                    {cafe.tags?.length > 0 && (
                        <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            {cafe.tags.map((tag, index) => (
                                <Chip
                                    key={index}
                                    label={tag}
                                    size="small"
                                    className="cafe-price"
                                />
                            ))}
                        </Box>
                    )}
                </CardContent>
            </Card>
        </Grid>
    );

    return (
        <Box>
            {/* Content-Based Section */}
            <Box className="cafe-section">
                <Typography variant="h5" className="section-title">
                    <AutoAwesomeIcon color="primary" />
                    Content-Based Öneriler
                </Typography>
                {contentBased.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                        Henüz öneri bulunamadı. Lütfen favori veya puan verisi ekleyin.
                    </Typography>
                ) : (
                    <Grid container spacing={3}>
                        {contentBased.map(renderCafeCard)}
                    </Grid>
                )}
            </Box>

            <Divider sx={{ my: 4 }} />

            {/* Collaborative Filtering Section */}
            <Box className="cafe-section">
                <Typography variant="h5" className="section-title">
                    <PsychologyIcon color="primary" />
                    Collaborative Filtering
                </Typography>
                <ToggleButtonGroup
                    value={activeCollaborative}
                    exclusive
                    onChange={(e, val) => val && setActiveCollaborative(val)}
                    sx={{ mb: 3 }}
                    className="nav-buttons"
                >
                    <ToggleButton value="user" className="nav-button">
                        User-Based
                    </ToggleButton>
                    <ToggleButton value="item" className="nav-button">
                        Item-Based
                    </ToggleButton>
                </ToggleButtonGroup>

                {activeCollaborative === 'user' && (
                    <Grid container spacing={3}>
                        {collaborativeUser.map(renderCafeCard)}
                    </Grid>
                )}
                {activeCollaborative === 'item' && (
                    <Grid container spacing={3}>
                        {collaborativeItem.map(renderCafeCard)}
                    </Grid>
                )}
            </Box>

            <Divider sx={{ my: 4 }} />

            {/* Hybrid Section */}
            <Box className="cafe-section">
                <Typography variant="h5" className="section-title">
                    <CompareArrowsIcon color="primary" />
                    Hybrid Öneriler
                </Typography>
                <Grid container spacing={3}>
                    {hybrid.map(renderCafeCard)}
                </Grid>
            </Box>
        </Box>
    );
};

export default ForYouPage;
