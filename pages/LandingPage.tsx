import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Typography, Container, Box, AppBar, Toolbar } from '@mui/material';

const LandingPage: React.FC = () => {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        AI Resume Architect
                    </Typography>
                    <Button color="inherit" component={Link} to="/templates">Templates</Button>
                    <Button color="inherit" component={Link} to="/build">Build Your Resume</Button>
                </Toolbar>
            </AppBar>
            <Container maxWidth="md" sx={{ mt: 8, textAlign: 'center' }}>
                <Typography variant="h2" component="h1" gutterBottom>
                    Welcome to AI Resume Architect
                </Typography>
                <Typography variant="h5" component="p" color="text.secondary" paragraph>
                    Build a professional resume in minutes with the help of AI. Our tool helps you create a standout resume that gets noticed.
                </Typography>
                <Button variant="contained" size="large" component={Link} to="/build" sx={{ mt: 4 }}>
                    Get Started
                </Button>
            </Container>
        </Box>
    );
};

export default LandingPage;
