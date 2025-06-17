import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardContent, Button, Slider, TextField, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './rating.css';

const Ratings = () => {
    const userId = localStorage.getItem('user_id');
    const navigate = useNavigate();
    const [ratings, setRatings] = useState([]);

    useEffect(() => {
        fetch(`http://127.0.0.1:5000/favorites-user?user_id=${userId}`)
            .then(res => res.json())
            .then(data => {
                const formatted = data.map(cafe => ({
                    cafe_id: cafe.cafe_id,
                    name: cafe.name,
                    rating: 3,
                    comment: ""
                }));
                setRatings(formatted);
            })
            .catch(err => console.error("Favoriler alınamadı:", err));
    }, [userId]);

    const handleRatingChange = (cafe_id, value) => {
        setRatings((prev) =>
            prev.map((cafe) =>
                cafe.cafe_id === cafe_id ? { ...cafe, rating: value } : cafe
            )
        );
    };

    const handleCommentChange = (cafe_id, value) => {
        setRatings((prev) =>
            prev.map((cafe) =>
                cafe.cafe_id === cafe_id ? { ...cafe, comment: value } : cafe
            )
        );
    };

    const handleSubmit = async () => {
        try {
            for (const entry of ratings) {
                await fetch('http://127.0.0.1:5000/ratings', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        user_id: userId,
                        cafe_id: entry.cafe_id,
                        rating: entry.rating,
                        comment: entry.comment
                    }),
                });
            }
            navigate('/home');
        } catch (error) {
            console.error("Puan gönderilemedi:", error);
        }
    };

    return (
        <Box className="register-container">
            <Paper elevation={3} className="register-form">
                <Typography variant="h4" gutterBottom sx={{ 
                    color: '#1a73e8',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    mb: 4
                }}>
                    Favori Kafelerini Puanla
                </Typography>

                <Grid container spacing={3}>
                    {ratings.map((cafe) => (
                        <Grid item xs={12} sm={6} md={4} key={cafe.cafe_id}>
                            <Card sx={{ 
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                borderRadius: 2,
                                transition: 'all 0.2s ease-in-out',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)'
                                }
                            }}>
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography variant="h6" gutterBottom sx={{ color: '#1a73e8' }}>
                                        {cafe.name}
                                    </Typography>
                                    <Typography gutterBottom sx={{ 
                                        color: 'text.secondary',
                                        mb: 2,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1
                                    }}>
                                        Puan: {cafe.rating}
                                    </Typography>
                                    <Slider
                                        value={cafe.rating}
                                        min={1}
                                        max={5}
                                        step={1}
                                        marks
                                        valueLabelDisplay="auto"
                                        onChange={(_, value) => handleRatingChange(cafe.cafe_id, value)}
                                        sx={{
                                            color: '#1a73e8',
                                            '& .MuiSlider-thumb': {
                                                transition: 'transform 0.2s ease-in-out',
                                                '&:hover': {
                                                    transform: 'scale(1.2)'
                                                }
                                            },
                                            '& .MuiSlider-track': {
                                                background: 'linear-gradient(90deg, #1a73e8 0%, #0d47a1 100%)'
                                            }
                                        }}
                                    />
                                    <TextField
                                        label="Yorum"
                                        fullWidth
                                        multiline
                                        rows={2}
                                        margin="normal"
                                        value={cafe.comment}
                                        onChange={(e) => handleCommentChange(cafe.cafe_id, e.target.value)}
                                        sx={{
                                            mt: 2,
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                                transition: 'all 0.2s ease-in-out',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(255, 255, 255, 1)'
                                                }
                                            }
                                        }}
                                    />
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    sx={{ 
                        mt: 4,
                        py: 1.5,
                        background: 'linear-gradient(135deg, #1a73e8 0%, #0d47a1 100%)',
                        '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 8px rgba(26, 115, 232, 0.2)'
                        }
                    }}
                    onClick={handleSubmit}
                >
                    Kaydet ve Devam Et
                </Button>
            </Paper>
        </Box>
    );
};

export default Ratings;
