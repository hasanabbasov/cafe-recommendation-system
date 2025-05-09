import React, { useState } from 'react';
import {
    Box,
    TextField,
    Typography,
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Checkbox,
    FormGroup,
    FormControlLabel,
    Slider,
    Paper
} from '@mui/material';
import background from '../../assets/background.png';
import './register.css';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        gender: '',
        jobCategory: '',
        jobTitle: '',
        preferredCoffee: [],
        visitFrequency: 5,
        averageSpend: 50,
        timeOfDay: [],
        moodActivity: '',
        isInternational: false,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleMultiCheckboxChange = (name, value) => {
        setFormData((prev) => {
            const currentValues = prev[name];
            const newValues = currentValues.includes(value)
                ? currentValues.filter((v) => v !== value)
                : [...currentValues, value];
            return { ...prev, [name]: newValues };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            name: formData.name,
            age: Number(formData.age),
            gender: formData.gender,
            job_category: formData.jobCategory,
            job_title: formData.jobTitle,
            preferred_coffee: formData.preferredCoffee,
            visit_frequency: formData.visitFrequency,
            average_spend: formData.averageSpend,
            time_preferences: formData.timeOfDay,
            mood_activity: formData.moodActivity,
            is_international: formData.isInternational,
            average_rating: 0.0,
            cafes_visited: 0
        };

        try {
            const response = await fetch('http://127.0.0.1:5000/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                console.log('Kayıt başarılı');
                const result = await response.json();
                localStorage.setItem('user_id', result.user_id);
                navigate('/favorites');
            } else {
                const errorData = await response.json();
                console.error('Hata:', errorData);
            }
        } catch (err) {
            console.error('Sunucu hatası:', err);
        }
    };

    const coffeeOptions = ['Turkish Coffee', 'Espresso', 'Frappe', 'Cappuccino', 'Cold Brew', 'Iced Latte'];
    const timeOptions = ['morning', 'afternoon', 'evening'];

    return (
        <Box className="register-container">
            <img src={background} alt="background" className="register-bg" />
            <Paper elevation={3} className="register-form">
                <Typography variant="h4" gutterBottom>
                    Kullanıcı Kayıt Formu
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField label="Ad Soyad" name="name" fullWidth margin="normal" onChange={handleChange} />
                    <TextField label="Yaş" name="age" type="number" fullWidth margin="normal" onChange={handleChange} />
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Cinsiyet</InputLabel>
                        <Select name="gender" value={formData.gender} onChange={handleChange}>
                            <MenuItem value="male">Erkek</MenuItem>
                            <MenuItem value="female">Kadın</MenuItem>
                            <MenuItem value="other">Diğer</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField label="Meslek Kategorisi" name="jobCategory" fullWidth margin="normal" onChange={handleChange} />
                    <TextField label="Meslek Başlığı" name="jobTitle" fullWidth margin="normal" onChange={handleChange} />

                    <Typography variant="subtitle1" sx={{ mt: 2 }}>Tercih Edilen Kahveler</Typography>
                    <FormGroup row>
                        {coffeeOptions.map((coffee) => (
                            <FormControlLabel
                                key={coffee}
                                control={
                                    <Checkbox
                                        checked={formData.preferredCoffee.includes(coffee)}
                                        onChange={() => handleMultiCheckboxChange('preferredCoffee', coffee)}
                                    />
                                }
                                label={coffee}
                            />
                        ))}
                    </FormGroup>

                    <Typography gutterBottom>Kafe Ziyaret Sıklığı (Hafta): {formData.visitFrequency}</Typography>
                    <Slider
                        name="visitFrequency"
                        value={formData.visitFrequency}
                        onChange={(e, val) => setFormData((prev) => ({ ...prev, visitFrequency: val }))}
                        min={0}
                        max={21}
                        step={1}
                        valueLabelDisplay="auto"
                    />

                    <Typography gutterBottom>Ortalama Harcama (TL): {formData.averageSpend}</Typography>
                    <Slider
                        name="averageSpend"
                        value={formData.averageSpend}
                        onChange={(e, val) => setFormData((prev) => ({ ...prev, averageSpend: val }))}
                        min={0}
                        max={150}
                        step={1}
                        valueLabelDisplay="auto"
                    />

                    <Typography variant="subtitle1" sx={{ mt: 2 }}>Günün Tercih Edilen Zamanları</Typography>
                    <FormGroup row>
                        {timeOptions.map((time) => (
                            <FormControlLabel
                                key={time}
                                control={
                                    <Checkbox
                                        checked={formData.timeOfDay.includes(time)}
                                        onChange={() => handleMultiCheckboxChange('timeOfDay', time)}
                                    />
                                }
                                label={time}
                            />
                        ))}
                    </FormGroup>

                    <TextField
                        fullWidth
                        label="Aktivite / Ruh Hali"
                        name="moodActivity"
                        margin="normal"
                        onChange={handleChange}
                    />

                    <FormControlLabel
                        control={
                            <Checkbox
                                name="isInternational"
                                checked={formData.isInternational}
                                onChange={handleChange}
                            />
                        }
                        label="Uluslararası Öğrenciyim"
                    />

                    <Button type="submit" variant="contained" size="large" fullWidth sx={{ mt: 3 }}>
                        Devam Et
                    </Button>
                </form>
            </Paper>
        </Box>
    );
};

export default Register;
