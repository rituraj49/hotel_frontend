import { Box, Button, Container, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from "../config/axios";

function LoginPage() {
    const [userData, setUserData] = useState({
        email: '',
        password: ''
    });

    const navigate = useNavigate();

    const handleInputChange = (e) => {
        setUserData({
            ...userData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            const res = await axiosInstance.post('api/v1/auth/login', userData);
            console.log({resLogin: res})
            if(res.status == 200) {
                localStorage.setItem('token', res.data.data.access_token);
                localStorage.setItem('user', JSON.stringify(res.data.data.user));
                navigate('/reservations')
            }
        } catch (error) {
            console.error('Error logging in:', error);
        }
    }

    return (
        <Container component="main" maxWidth="xs" sx={{ mt: 8, mb: 4 }}>
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}
        >
            <Typography component="h1" variant="h5">
                Sign in
            </Typography>
            <Box component="form" sx={{ mt: 1 }} onSubmit={handleSubmit}>
                    <TextField
                        margin="normal"
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        value={userData.email}
                        onChange={handleInputChange}
                        autoComplete="email"
                        autoFocus
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Sign In
                    </Button>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                    <Link to="/register">
                        <Typography variant="body2" color="primary">
                            Don't have an account? Sign Up
                        </Typography>
                    </Link>
                    <Link to="/forgot-password">
                        <Typography variant="body2" color="primary">
                            Forgot password?
                        </Typography>
                    </Link>
                </Box>
            </Box>
        </Box>
    </Container>
    )
}

export default LoginPage;