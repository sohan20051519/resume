import React from 'react';
import { Link } from 'react-router-dom';
import { Typography, Container, Grid, Card, CardActionArea, CardContent, CardMedia, AppBar, Toolbar, Button, Box } from '@mui/material';
import { TEMPLATES } from '../constants'; // Assuming templates are defined here

const TemplatesPage: React.FC = () => {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                            AI Resume Architect
                        </Link>
                    </Typography>
                    <Button color="inherit" component={Link} to="/templates">Templates</Button>
                    <Button color="inherit" component={Link} to="/build">Build Your Resume</Button>
                </Toolbar>
            </AppBar>
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Choose a Template
                </Typography>
                <Grid container spacing={4}>
                    {TEMPLATES.map((template) => (
                        <Grid item key={template.id} xs={12} sm={6} md={4}>
                            <Card>
                                <CardActionArea component={Link} to={`/build?template=${template.id}`}>
                                    <CardMedia
                                        component="img"
                                        height="400"
                                        image={`https://via.placeholder.com/300x400.png/1e1e1e/90caf9?text=${template.name}`}
                                        alt={template.name}
                                    />
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="div">
                                            {template.name}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};

export default TemplatesPage;
