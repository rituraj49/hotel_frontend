import { Box, Card, CardContent, CardHeader, Divider, Grid, Typography } from "@mui/material";
import axiosInstance from "../config/axios";
import { useEffect, useState } from "react";

function ProfilePage() {
    const [profileData, setProfileData] = useState('');

    const fetchUserProfile = async () => {
        const res = await axiosInstance.get(`api/v1/guests/profile`);
        console.log({resProfile:res})
        if(res.status === 200)  {
            setProfileData(res.data.data);
        }
    }

    useEffect(() => {
        fetchUserProfile();
    }, [])

    return (
       <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
                {/* Profile Info */}
                <Grid item xs={12} sx={{width: '100%'}} >
                    <Card>
                        <CardHeader 
                            title="Profile Information" 
                            sx={{ 
                                bgcolor: 'primary.main', 
                                color: 'white',
                                py: 2,
                                borderBottom: '2px solid rgba(255, 255, 255, 0.1)'
                            }}
                        />
                        <CardContent sx={{ flexGrow: 1 }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Box>
                                    <Typography variant="body1" color="text.secondary">
                                        Name
                                    </Typography>
                                    <Typography variant="h6" color="primary">
                                        {profileData.name}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography variant="body1" color="text.secondary">
                                        Email
                                    </Typography>
                                    <Typography variant="h6" color="primary">
                                        {profileData.email}
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                {/* Reservations */}
                <Grid item xs={12} md={4} lg={8} sx={{width: '100%'}}>
                    <Card sx={{}}>
                        {/* <CardHeader title="Your Reservations" /> */}
                        <CardHeader 
                            title="Booking History" 
                            sx={{ 
                                bgcolor: 'primary.main', 
                                color: 'white',
                                py: 2,
                                borderBottom: '2px solid rgba(255, 255, 255, 0.1)'
                            }}
                        />
                        <Divider />
                        <CardContent sx={{ flexGrow: 1}}>
                            <Grid container spacing={2}>
                                {
                                    profileData &&
                                    profileData.reservations &&
                                    profileData.reservations.length > 0 &&
                                    profileData.reservations.map((reservation, index) => (
                                    <Grid item xs={12} sm={6} key={reservation.id}>
                                        <Card sx={{ height: '100%' }}>
                                            <CardContent>
                                                <Typography variant="h6" gutterBottom>
                                                    {reservation.room.type} Room
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Check-in: {new Date(reservation.checkInDate).toLocaleDateString()}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Check-out: {new Date(reservation.checkOutDate).toLocaleDateString()}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Guests: {reservation.adults} adults, {reservation.children} children
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Status: {reservation.isCancelled ? 'Cancelled' : 'Active'}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Payment: ${reservation.payment.amount} ({reservation.payment.paymentStatus})
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    )
}

export default ProfilePage;