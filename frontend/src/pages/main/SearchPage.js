import React, { useState } from 'react';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    Chip,
    FormGroup,
    FormControlLabel,
    Checkbox,
    TextField,
    Paper,
    Rating
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';

const allTags = ['açık hava', 'sessiz', 'çalışma için uygun', 'nargile yok'];

const mockSearchResults = [
    { id: 7, name: 'Cafe Açık Hava', tags: ['açık hava', 'sessiz'], rating: 4.0 },
    { id: 8, name: 'Nargilesiz Cafe', tags: ['nargile yok', 'çalışma için uygun'], rating: 4.3 },
    { id: 9, name: 'Study Cafe', tags: ['çalışma için uygun', 'sessiz'], rating: 4.4 },
];

const SearchPage = () => {
    const [selectedTags, setSelectedTags] = useState([]);
    const [search, setSearch] = useState('');

    const handleTagChange = (tag) => {
        setSelectedTags((prev) =>
            prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
        );
    };

    const filtered = mockSearchResults.filter((cafe) =>
        selectedTags.every((tag) => cafe.tags.includes(tag)) &&
        cafe.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            <div >
                <Box sx={{ width: '100%', mb: 3 }}>
                    <Typography variant="h5" className="section-title">
                        <SearchIcon color="primary" />
                        Kafe Ara
                    </Typography>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Kafe ismi ile ara..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
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
                </Box>

                <Box sx={{ width: '100%' }}>
                    <Typography variant="h6" className="section-title">
                        <FilterListIcon color="primary" />
                        Filtreler
                    </Typography>
                    <FormGroup row sx={{ mt: 2, gap: 2 }}>
                        {allTags.map((tag) => (
                            <FormControlLabel
                                key={tag}
                                control={
                                    <Checkbox
                                        checked={selectedTags.includes(tag)}
                                        onChange={() => handleTagChange(tag)}
                                        sx={{
                                            color: '#1a73e8',
                                            '&.Mui-checked': {
                                                color: '#1a73e8',
                                            },
                                        }}
                                    />
                                }
                                label={tag}
                                sx={{
                                    '& .MuiFormControlLabel-label': {
                                        color: '#5f6368',
                                    },
                                }}
                            />
                        ))}
                    </FormGroup>

                    <>
                        <Typography variant="h5" className="section-title" sx={{ mb: 3 }}>
                            <LocalCafeIcon color="primary" />
                            Filtrelenmiş Sonuçlar
                        </Typography>

                        <Grid container spacing={3}>
                            {filtered.map((cafe) => (
                                <Grid item xs={12} sm={6} md={4} key={cafe.id}>
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
                                            </Box>
                                            <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                                {cafe.tags.map((tag, i) => (
                                                    <Chip
                                                        key={i}
                                                        label={tag}
                                                        size="small"
                                                        className="cafe-price"
                                                    />
                                                ))}
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </>
                </Box>
            </div>

        </div>
    );
};

export default SearchPage;