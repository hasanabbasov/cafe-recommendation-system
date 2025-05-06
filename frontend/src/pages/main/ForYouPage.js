import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    Divider,
    ToggleButtonGroup,
    ToggleButton
} from '@mui/material';

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

    const renderCafeList = (cafes) => (
        <>
            {cafes.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                    Henüz öneri bulunamadı. Lütfen favori veya puan verisi ekleyin.
                </Typography>
            ) : (
                <Grid container spacing={2}>
                    {cafes.map((cafe) => (
                        <Grid item xs={12} sm={6} md={4} key={cafe.cafe_id}>
                            <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
                                <CardContent>
                                    <Typography variant="h6">{cafe.name}</Typography>
                                    <Typography variant="body2">Puan: {cafe.rating}</Typography>
                                    <Typography variant="body2">Skor: {cafe.score || 'N/A'}</Typography>
                                    {cafe.tags?.length > 0 && (
                                        <Typography variant="body2">
                                            Etiketler: {cafe.tags.join(', ')}
                                        </Typography>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </>
    );

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h5" mb={2}>Senin İçin Önerilen Kafeler</Typography>

            {/* Content-Based her zaman görünür */}
            <Typography variant="h6" mt={3} mb={2}>Content-Based Öneriler</Typography>
            {renderCafeList(contentBased)}

            <Divider sx={{ my: 4 }} />

            {/* ToggleButtonGroup sadece Collaborative türü için */}
            <Typography variant="h6" mb={2}>Collaborative Filtering</Typography>
            <ToggleButtonGroup
                value={activeCollaborative}
                exclusive
                onChange={(e, val) => val && setActiveCollaborative(val)}
                sx={{ mb: 3 }}
            >
                <ToggleButton value="user">User-Based</ToggleButton>
                <ToggleButton value="item">Item-Based</ToggleButton>
            </ToggleButtonGroup>

            {activeCollaborative === 'user' && renderCafeList(collaborativeUser)}
            {activeCollaborative === 'item' && renderCafeList(collaborativeItem)}

            <Divider sx={{ my: 4 }} />

            {/* Hybrid her zaman görünür */}
            <Typography variant="h6" mb={2}>Hybrid Öneriler</Typography>
            {renderCafeList(hybrid)}
        </Box>
    );
};

export default ForYouPage;
