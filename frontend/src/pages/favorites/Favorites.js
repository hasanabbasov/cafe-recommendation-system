import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    Button,
    Chip,
    TextField,
    Pagination,
    Paper
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useNavigate } from 'react-router-dom';
import './favorites.css';

const ITEMS_PER_PAGE = 6;

const Favorites = () => {
    const [cafes, setCafes] = useState([]);
    const [selectedFavorites, setSelectedFavorites] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const navigate = useNavigate();

    const userId = localStorage.getItem('user_id');

    useEffect(() => {
        fetch('http://127.0.0.1:5000/cafes')
            .then(res => res.json())
            .then(data => setCafes(data))
            .catch(err => console.error("Kafeler alınamadı:", err));
    }, []);

    const handleSelect = (cafe) => {
        if (!selectedFavorites.find((f) => f.cafe_id === cafe.cafe_id)) {
            setSelectedFavorites([...selectedFavorites, cafe]);
        }
    };

    const handleRemove = (id) => {
        setSelectedFavorites(selectedFavorites.filter((cafe) => cafe.cafe_id !== id));
    };

    const handleSubmit = async () => {
        try {
            for (const cafe of selectedFavorites) {
                await fetch('http://127.0.0.1:5000/favorites', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        user_id: userId,
                        cafe_id: cafe.cafe_id
                    }),
                });
            }
            navigate('/ratings');
        } catch (err) {
            console.error("Favoriler gönderilemedi:", err);
        }
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setPage(1);
    };

    const handlePageChange = (_, value) => {
        setPage(value);
    };

    const filteredCafes = cafes.filter((cafe) =>
        cafe.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredCafes.length / ITEMS_PER_PAGE);
    const displayedCafes = filteredCafes.slice(
        (page - 1) * ITEMS_PER_PAGE,
        page * ITEMS_PER_PAGE
    );

    return (
        <Box className="register-container">
            <Paper elevation={3} className="register-form">
                <Typography variant="h4" gutterBottom sx={{ 
                    color: '#1a73e8',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    mb: 4
                }}>
                    Favori Kafelerini Seç
                </Typography>

                <TextField
                    fullWidth
                    label="Kafe ismi ile ara..."
                    variant="outlined"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    sx={{ 
                        mb: 3,
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 2
                        }
                    }}
                />

                <Box sx={{ 
                    mb: 4,
                    p: 2,
                    backgroundColor: 'rgba(26, 115, 232, 0.05)',
                    borderRadius: 2,
                    minHeight: '60px'
                }}>
                    {selectedFavorites.length > 0 ? (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {selectedFavorites.map((cafe) => (
                                <Chip
                                    key={cafe.cafe_id}
                                    label={cafe.name}
                                    onDelete={() => handleRemove(cafe.cafe_id)}
                                    sx={{ 
                                        m: 0.5,
                                        backgroundColor: 'rgba(26, 115, 232, 0.1)',
                                        '&:hover': {
                                            backgroundColor: 'rgba(26, 115, 232, 0.15)'
                                        }
                                    }}
                                    color="primary"
                                    variant="outlined"
                                />
                            ))}
                        </Box>
                    ) : (
                        <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center' }}>
                            Henüz favori seçilmedi.
                        </Typography>
                    )}
                </Box>

                <Grid container spacing={3}>
                    {displayedCafes.map((cafe) => (
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
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                        Puan: {cafe.rating}
                                    </Typography>
                                    <Button
                                        onClick={() => handleSelect(cafe)}
                                        variant="outlined"
                                        fullWidth
                                        sx={{ 
                                            mt: 'auto',
                                            borderColor: 'rgba(26, 115, 232, 0.5)',
                                            '&:hover': {
                                                backgroundColor: 'rgba(26, 115, 232, 0.05)',
                                                borderColor: '#1a73e8'
                                            }
                                        }}
                                        startIcon={<FavoriteIcon />}
                                        disabled={selectedFavorites.find((f) => f.cafe_id === cafe.cafe_id)}
                                    >
                                        Favoriye Ekle
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                <Box display="flex" justifyContent="center" mt={4}>
                    <Pagination 
                        count={totalPages} 
                        page={page} 
                        onChange={handlePageChange} 
                        color="primary"
                        sx={{
                            '& .MuiPaginationItem-root': {
                                color: '#1a73e8'
                            },
                            '& .Mui-selected': {
                                backgroundColor: 'rgba(26, 115, 232, 0.1)'
                            }
                        }}
                    />
                </Box>

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
                    disabled={selectedFavorites.length === 0}
                >
                    Devam Et
                </Button>
            </Paper>
        </Box>
    );
};

export default Favorites;
