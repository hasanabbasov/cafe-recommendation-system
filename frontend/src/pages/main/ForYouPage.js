import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, Divider } from '@mui/material';

const ForYouPage = () => {
    const [contentBased, setContentBased] = useState([]);
    const [collaborative, setCollaborative] = useState([]);
    const [hybrid, setHybrid] = useState([]);

    const userId = localStorage.getItem('user_id'); // 👈 localStorage'tan alınan ID
    console.log("userId: ", userId)

    useEffect(() => {
        if (!userId) return;

        // Content-Based
        fetch(`http://127.0.0.1:5000/recommendations/${userId}`)
            .then(res => res.json())
            .then(data => setContentBased(data))
            .catch(err => console.error("CB error", err));

        // Collaborative
        fetch(`http://127.0.0.1:5000/recommendations/${userId}/cf`)
            .then(res => res.json())
            .then(data => setCollaborative(data))
            .catch(err => console.error("CF error", err));

        // Hybrid
        fetch(`http://127.0.0.1:5000/recommendations/${userId}/hybrid`)
            .then(res => res.json())
            .then(data => setHybrid(data))
            .catch(err => console.error("Hybrid error", err));
    }, [userId]);

    const renderCafeList = (cafes) => (
        <Grid container spacing={2}>
            {cafes.map((cafe) => (
                <Grid item xs={12} sm={6} md={4} key={cafe.cafe_id}>
                    <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
                        <CardContent>
                            <Typography variant="h6">{cafe.name}</Typography>
                            <Typography variant="body2">Puan: {cafe.rating}</Typography>
                            <Typography variant="body2">Skor: {cafe.score || 'N/A'}</Typography>
                            {cafe.tags?.length > 0 && (
                                <Typography variant="body2">Etiketler: {cafe.tags.join(', ')}</Typography>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );

    return (
        <Box>
            <Typography variant="h5" mb={2}>Content-Based Öneriler</Typography>
            {renderCafeList(contentBased)}

            <Divider sx={{ my: 4 }} />

            <Typography variant="h5" mb={2}>Collaborative Filtering Öneriler</Typography>
            {renderCafeList(collaborative)}

            <Divider sx={{ my: 4 }} />

            <Typography variant="h5" mb={2}>Hybrid Öneriler</Typography>
            {renderCafeList(hybrid)}
        </Box>
    );
};

export default ForYouPage;
