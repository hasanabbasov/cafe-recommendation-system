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
    Paper
} from '@mui/material';

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
        <Paper elevation={2} sx={{ p: 3, backgroundColor: '#fffefc', borderRadius: 3 }}>
            <Typography variant="h5" mb={2}>Filtrelenmiş Sonuçlar</Typography>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
                <FormGroup row>
                    {allTags.map((tag) => (
                        <FormControlLabel
                            key={tag}
                            control={<Checkbox checked={selectedTags.includes(tag)} onChange={() => handleTagChange(tag)} />}
                            label={tag}
                        />
                    ))}
                </FormGroup>
                <TextField
                    variant="outlined"
                    label="Kafe ismi ara..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </Box>

            <Grid container spacing={2}>
                {filtered.map((cafe) => (
                    <Grid item xs={12} sm={6} md={4} key={cafe.id}>
                        <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
                            <CardContent>
                                <Typography variant="h6">{cafe.name}</Typography>
                                <Typography variant="body2">Puan: {cafe.rating}</Typography>
                                <Box mt={1}>
                                    {cafe.tags.map((tag, i) => (
                                        <Chip key={i} label={tag} size="small" sx={{ mr: 0.5 }} />
                                    ))}
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Paper>
    );
};

export default SearchPage;