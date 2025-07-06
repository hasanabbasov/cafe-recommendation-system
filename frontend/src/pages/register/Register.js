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
    Paper,
    Autocomplete,
    Container,
    Grid
} from '@mui/material';
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

    // Profession categories and titles
    const professionCategories = [
        'Academic',
        'Technology',
        'Healthcare',
        'Business',
        'Creative Arts',
        'Education',
        'Engineering',
        'Finance',
        'Government',
        'Hospitality',
        'Legal',
        'Marketing',
        'Media',
        'Retail',
        'Science',
        'Student',
        'Other'
    ];

    const professionTitles = {
        'Academic': ['Professor', 'Researcher', 'PhD Student', 'Postdoc'],
        'Technology': ['Software Engineer', 'Data Scientist', 'Product Manager', 'UX Designer', 'DevOps Engineer'],
        'Healthcare': ['Doctor', 'Nurse', 'Pharmacist', 'Medical Researcher'],
        'Business': ['Manager', 'Consultant', 'Entrepreneur', 'Analyst'],
        'Creative Arts': ['Designer', 'Artist', 'Writer', 'Photographer'],
        'Education': ['Teacher', 'Administrator', 'Counselor'],
        'Engineering': ['Civil Engineer', 'Mechanical Engineer', 'Electrical Engineer'],
        'Finance': ['Accountant', 'Financial Analyst', 'Investment Banker'],
        'Government': ['Civil Servant', 'Policy Analyst', 'Public Administrator'],
        'Hospitality': ['Chef', 'Restaurant Manager', 'Hotel Staff'],
        'Legal': ['Lawyer', 'Paralegal', 'Legal Assistant'],
        'Marketing': ['Marketing Manager', 'Brand Specialist', 'Digital Marketer'],
        'Media': ['Journalist', 'Content Creator', 'Social Media Manager'],
        'Retail': ['Store Manager', 'Sales Associate', 'Buyer'],
        'Science': ['Scientist', 'Lab Technician', 'Research Assistant'],
        'Student': ['Undergraduate', 'Graduate', 'PhD Candidate'],
        'Other': ['Freelancer', 'Self-employed', 'Other']
    };

    const moodOptions = [
        'Relaxed',
        'Focused',
        'Social',
        'Creative',
        'Productive',
        'Casual',
        'Business',
        'Study',
        'Meeting',
        'Date'
    ];

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
            preferred_coffee_type: formData.preferredCoffee,
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
                console.log('Registration successful');
                const result = await response.json();
                localStorage.setItem('user_id', result.user_id);
                navigate('/favorites');
            } else {
                const errorData = await response.json();
                console.error('Error:', errorData);
            }
        } catch (err) {
            console.error('Server error:', err);
        }
    };

    const coffeeOptions = ['Turkish Coffee', 'Espresso', 'Frappe', 'Cappuccino', 'Cold Brew', 'Iced Latte'];
    const timeOptions = ['Morning', 'Afternoon', 'Evening'];

    return (
        <Box className="register-page">
            {/* Background Elements */}
            <Box className="floating-element" />
            <Box className="floating-element" />
            <Box className="floating-element" />
            
            <Container maxWidth="md">
                <Paper elevation={3} className="register-form">
                    <Typography variant="h4" className="form-title" gutterBottom>
                        Create Your Profile
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <TextField
                                label="Full Name"
                                name="name"
                                fullWidth
                                onChange={handleChange}
                                className="form-field"
                            />
                            <TextField
                                label="Age"
                                name="age"
                                type="number"
                                fullWidth
                                onChange={handleChange}
                                className="form-field"
                            />
                            <FormControl fullWidth className="form-field">
                                <InputLabel>Gender</InputLabel>
                                <Select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    className="select-field"
                                >
                                    <MenuItem value="male">Male</MenuItem>
                                    <MenuItem value="female">Female</MenuItem>
                                    <MenuItem value="other">Other</MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl fullWidth className="form-field">
                                <InputLabel>Profession Category</InputLabel>
                                <Select
                                    name="jobCategory"
                                    value={formData.jobCategory}
                                    onChange={handleChange}
                                    className="select-field"
                                >
                                    {professionCategories.map((category) => (
                                        <MenuItem key={category} value={category}>
                                            {category}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl fullWidth className="form-field">
                                <InputLabel>Profession Title</InputLabel>
                                <Select
                                    name="jobTitle"
                                    value={formData.jobTitle}
                                    onChange={handleChange}
                                    className="select-field"
                                    disabled={!formData.jobCategory}
                                >
                                    {formData.jobCategory && professionTitles[formData.jobCategory]?.map((title) => (
                                        <MenuItem key={title} value={title}>
                                            {title}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <Autocomplete
                                freeSolo
                                options={moodOptions}
                                value={formData.moodActivity}
                                onChange={(event, newValue) => {
                                    setFormData(prev => ({
                                        ...prev,
                                        moodActivity: newValue
                                    }));
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Activity / Mood"
                                        className="form-field"
                                    />
                                )}
                            />
                            <Box>
                                <Typography variant="subtitle1" className="section-title">
                                    Preferred Coffees
                                </Typography>
                                <FormGroup className="checkbox-group">
                                    {coffeeOptions.map((coffee) => (
                                        <FormControlLabel
                                            key={coffee}
                                            control={
                                                <Checkbox
                                                    checked={formData.preferredCoffee.includes(coffee)}
                                                    onChange={() => handleMultiCheckboxChange('preferredCoffee', coffee)}
                                                    className="checkbox-field"
                                                />
                                            }
                                            label={coffee}
                                        />
                                    ))}
                                </FormGroup>
                            </Box>
                            <Box>
                                <Typography variant="subtitle1" className="section-title">
                                    Visit Frequency (per week): {formData.visitFrequency}
                                </Typography>
                                <Slider
                                    name="visitFrequency"
                                    value={formData.visitFrequency}
                                    onChange={(e, val) => setFormData((prev) => ({ ...prev, visitFrequency: val }))}
                                    min={0}
                                    max={21}
                                    step={1}
                                    valueLabelDisplay="auto"
                                    className="slider-field"
                                />
                            </Box>
                            <Box>
                                <Typography variant="subtitle1" className="section-title">
                                    Average Spend (TL): {formData.averageSpend}
                                </Typography>
                                <Slider
                                    name="averageSpend"
                                    value={formData.averageSpend}
                                    onChange={(e, val) => setFormData((prev) => ({ ...prev, averageSpend: val }))}
                                    min={0}
                                    max={150}
                                    step={1}
                                    valueLabelDisplay="auto"
                                    className="slider-field"
                                />
                            </Box>
                            <Box>
                                <Typography variant="subtitle1" className="section-title">
                                    Preferred Times of Day
                                </Typography>
                                <FormGroup className="checkbox-group">
                                    {timeOptions.map((time) => (
                                        <FormControlLabel
                                            key={time}
                                            control={
                                                <Checkbox
                                                    checked={formData.timeOfDay.includes(time)}
                                                    onChange={() => handleMultiCheckboxChange('timeOfDay', time)}
                                                    className="checkbox-field"
                                                />
                                            }
                                            label={time}
                                        />
                                    ))}
                                </FormGroup>
                            </Box>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        name="isInternational"
                                        checked={formData.isInternational}
                                        onChange={handleChange}
                                        className="checkbox-field"
                                    />
                                }
                                label="I am an International Student"
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                fullWidth
                                className="submit-button"
                            >
                                Continue
                            </Button>
                        </Box>
                    </form>
                </Paper>
            </Container>
        </Box>
    );
};

export default Register;
