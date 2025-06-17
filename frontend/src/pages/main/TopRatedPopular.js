import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, Rating, Chip } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import PeopleIcon from '@mui/icons-material/People';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

const TopRatedPopular = () => {
    const [topRated, setTopRated] = useState([]);
    const [mostReviewed, setMostReviewed] = useState([]);

    useEffect(() => {
        fetch('http://127.0.0.1:5000/top-cafes')
            .then(res => res.json())
            .then(data => {
                setTopRated(data.topRated);
                setMostReviewed(data.mostReviewed);
            })
            .catch(err => console.error("Kafe verisi alınamadı:", err));
    }, []);

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
                                {cafe.rating.toFixed(1)}
                            </Typography>
                        </Box>
                        <Typography className="cafe-reviews">
                            <PeopleIcon sx={{ fontSize: 16, mr: 0.5 }} />
                            {cafe.reviews} değerlendirme
                        </Typography>
                    </Box>
                    <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Chip
                            icon={<AttachMoneyIcon />}
                            label={cafe.priceLevel}
                            size="small"
                            className="cafe-price"
                        />
                        <Chip
                            icon={<LocalCafeIcon />}
                            label="Kafe"
                            size="small"
                            className="cafe-price"
                        />
                    </Box>
                </CardContent>
            </Card>
        </Grid>
    );

    return (
        <Box>
            <Box className="cafe-section">
                <Typography variant="h5" className="section-title">
                    <StarIcon color="primary" />
                    En Yüksek Puanlı Kafeler
                </Typography>
                <Grid container spacing={3}>
                    {topRated.map(renderCafeCard)}
                </Grid>
            </Box>

            <Box className="cafe-section">
                <Typography variant="h5" className="section-title">
                    <PeopleIcon color="primary" />
                    En Popüler Kafeler
                </Typography>
                <Grid container spacing={3}>
                    {mostReviewed.map(renderCafeCard)}
                </Grid>
            </Box>
        </Box>
    );
};

export default TopRatedPopular;
