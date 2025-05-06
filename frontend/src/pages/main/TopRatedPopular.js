import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardContent } from '@mui/material';

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
            <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
                <CardContent>
                    <Typography variant="h6">{cafe.name}</Typography>
                    <Typography variant="body2">Puan: {cafe.rating}</Typography>
                    <Typography variant="body2">Yorum: {cafe.reviews}</Typography>
                    <Typography variant="body2">Fiyat: {cafe.priceLevel}</Typography>
                </CardContent>
            </Card>
        </Grid>
    );

    return (
        <Box>
            <Typography variant="h5" mb={2}>En Yüksek Puanlı Kafeler</Typography>
            <Grid container spacing={2}>{topRated.map(renderCafeCard)}</Grid>

            <Typography variant="h5" mt={4} mb={2}>En Popüler Kafeler</Typography>
            <Grid container spacing={2}>{mostReviewed.map(renderCafeCard)}</Grid>
        </Box>
    );
};

export default TopRatedPopular;
