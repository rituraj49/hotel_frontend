import { Alert, Box, Button, Card, CardActions, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import axiosInstance from "../config/axios";
import { Close, Error as ErrorIcon } from '@mui/icons-material';

function ReservationsPage() {
    const [reservations, setReservations] = useState([]);
    const [open, setOpen] = useState('');
    const [selectedReservation, setSelectedReservation] = useState('');
    const [editReservation, setEditReservation] = useState({
        checkInDate: null,
        checkOutDate: null,
        adults: 0,
        children: 0,
        guestNames: []
    });
    const [loading, setLoading] = useState(false);

    const fetchReservations = async () => {
        try {
            const res = await axiosInstance.get(`api/v1/reservations/1`);
            console.log('res reserv:', res)
            if (res.status === 200) {
                setReservations(res.data.data);
            }
        } catch (error) {
            console.error('Error fetching reservations:', error);
        }
    }

    const formatDate = (dateString) => {
       return new Date(dateString).toISOString().split('T')[0];
    }

    const formatDateInput = (dateString) => {
        if(dateString) {
            return new Date(dateString).toISOString().split('T')[0];
        }
    }

    const handleClose = () => {
        setOpen('');
        setSelectedReservation('');
    }
    
    const handleEditSubmit = async (e) => {
        e.preventDefault();
        console.log('hadle edit submittt');
        try {
            const res = await  axiosInstance.put(`api/v1/reservations/update`, editReservation);
            console.log('res upd:', res)
            if(res.status === 200) {
                setOpen('');
                setSelectedReservation('');
                const updatedReservation = res.data.data;
                
                setReservations(prev => {
                    return prev.map(res => res.id === updatedReservation.id ? updatedReservation : res);
                })
            }
        } catch (error) {
            console.error('error while updating reservation', error);
        }
    }

    const handleCancelSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axiosInstance.put(`api/v1/reservations/cancel/${selectedReservation.id}`);
            console.log('res cancel:', res)
            if(res.status === 200) {
                setOpen('');
                setSelectedReservation('');
                const updatedReservation = res.data.data;
                
                setReservations(prev => {
                    return prev.map(res => res.id === updatedReservation.id ? updatedReservation : res);
                })
            }
        } catch (error) {
            console.error('error while cancelling reservation', error);
        }
    }
    useEffect(() => {
        fetchReservations();
    }, []);

    useEffect(() => {
        if(selectedReservation) {
            setEditReservation({
                id: selectedReservation.id,
                checkInDate: selectedReservation.checkInDate,
                checkOutDate: selectedReservation.checkOutDate,
                adults: selectedReservation.adults,
                children: selectedReservation.children,
                guestNames: selectedReservation.guestNames.join(', ')
            });
        }
    }, [selectedReservation]);
    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Profile
            </Typography>
            <Grid container spacing={3}>
                {
                    reservations &&
                    reservations.length > 0 &&
                    reservations.map((reservation, index) => {
                        return (
                            <Grid item xs={12} sm={6} md={4} key={reservation.id}>
                                  <Card sx={{ height: '100%', position: 'relative' }}>
                                    {
                                        reservation.isCancelled && (
                                            <Alert 
                                            severity="error" 
                                            icon={<ErrorIcon sx={{ fontSize: '0.75rem'}} />}
                                            sx={{ 
                                                position: 'absolute', 
                                                top: 0, 
                                                left: 0,
                                                width: '100%',
                                                // height: '20px',
                                                borderRadius: 1,
                                                fontSize: '0.65rem',
                                                padding: 0,
                                                // padding: '8px 16px',
                                                zIndex: 1,
                                                '& .MuiAlert-message': {
                                                    padding: 0.4,
                                                    margin: 0
                                                },
                                                '& .MuiAlert-icon': {
                                                    padding: 0.4,
                                                    margin: 0
                                                },
                                            }}
                                        >
                                            <strong style={{ textAlign: 'center'}}>You have cancelled this reservation</strong>
                                        </Alert>
                                        )
                                    }
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>
                                            {/* Room ID: {reservation.room?.id} */}
                                            Room Type: {reservation.room?.type}
                                        </Typography>
                                        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                                            {reservation.room?.location}
                                        </Typography>
                                        
                                        <Box sx={{ mt: 2 }}>
                                            <Typography variant="body2">
                                                <strong>Check-in:</strong> {formatDate(reservation.checkInDate)}
                                            </Typography>
                                            <Typography variant="body2">
                                                <strong>Check-out:</strong> {formatDate(reservation.checkOutDate)}
                                            </Typography>
                                            <Typography variant="body2">
                                                <strong>Guests:</strong> {reservation.adults} adults, {reservation.children} children
                                                <br />
                                                <strong>Guest Names:</strong> {reservation.guestNames.join(', ')}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ mt: 2 }}>
                                            <Typography variant="body2" color="text.secondary">
                                                Payment Status: <span style={{backgroundColor: reservation.payment?.paymentStatus === 'Paid' ? 'red' : 'green', borderRadius: 5, color: 'wheat', padding: 2}}>{reservation.payment?.paymentStatus || 'Pending'}</span>
                                            </Typography>
                                            <Typography variant="body1" color="primary">
                                                ${reservation.payment?.amount}
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                    <CardActions>
                                    {
                                        !reservation.isCancelled &&
                                            <Stack width={'100%'} direction='row' justifyContent={'space-between'}>
                                                <Button size="small" color="primary" variant="contained" onClick={()=>{
                                                    setOpen('editReservation');
                                                    setSelectedReservation(reservation);
                                                }}>
                                                    Edit
                                                </Button>
                                                <Button size="small" color="secondary" variant="contained" onClick={()=> {
                                                    setOpen('cancelReservation');
                                                    setSelectedReservation(reservation);
                                                }}>
                                                    Cancel
                                                </Button>
                                            </Stack>
                                    }
                                    </CardActions>
                                </Card>
                            </Grid>
                        )
                    })
                }
            </Grid>
            
            {/* dialog edit */}
            <Dialog
                open={open === 'editReservation'}
                onClose={() => {handleClose}}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    Edit Reservation
                    <IconButton
                            onClick={() => handleClose()}
                            sx={{
                                position: 'absolute',
                                top: 0,
                                right: 0,
                                color: theme => theme.palette.grey[500],
                                '&:hover': {
                                    color: theme => theme.palette.primary.main,
                                }
                            }}
                        >
                            <Close />
                        </IconButton>
                </DialogTitle>
                <DialogContent>
                    <form onSubmit={handleEditSubmit}>
                        <Stack spacing={2}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6} mt={2}>
                                    <Button onClick={()=>console.log(editReservation)}>editRes</Button>
                                    <TextField
                                        fullWidth
                                        type="date"
                                        label="Check-in Date"
                                        slotProps={{
                                            inputLabel: {
                                                shrink: true
                                            }
                                        }}
                                        value={formatDateInput(editReservation.checkInDate)}
                                        onChange={(e) => setEditReservation({ ...editReservation, checkInDate: e.target.value })}
                                        // onChange={(e) => console.log(e.target.value)}
                                        InputProps={{
                                            inputProps: {
                                                min: new Date().toISOString().split('T')[0]
                                            }
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} mt={2}>
                                    <TextField
                                        fullWidth
                                        type="date"
                                        label="Check-out Date"
                                        slotProps={{
                                            inputLabel: {
                                                shrink: true
                                            }
                                        }}
                                        value={formatDateInput(editReservation.checkOutDate)}
                                        onChange={(e) => setEditReservation({ ...editReservation, checkOutDate: e.target.value })}
                                        InputProps={{
                                            inputProps: {
                                                min: editReservation.checkInDate ? new Date(editReservation.checkInDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
                                            }
                                        }}
                                    />
                                </Grid>
                            </Grid>

                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Number of Adults"
                                        type="number"
                                        value={editReservation.adults}
                                        onChange={(e) => {
                                            const newAdults = parseInt(e.target.value);
                                            setEditReservation({ 
                                                ...editReservation, 
                                                adults: newAdults,
                                                // guestNames: Array(newAdults).fill('') 
                                            });
                                        }}
                                        inputProps={{ min: 1 }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Number of Children"
                                        type="number"
                                        value={editReservation.children}
                                        onChange={(e) => setEditReservation({ ...editReservation, children: parseInt(e.target.value) })}
                                        inputProps={{ min: 0 }}
                                    />
                                </Grid>
                            </Grid>

                            <Typography variant="h6" gutterBottom>
                                Guest Names
                            </Typography>
                            <TextField
                                fullWidth
                                label="Guest Names"
                                value={editReservation?.guestNames}
                                onChange={(e) => {
                                    setEditReservation({ ...editReservation, guestNames: e.target.value.split(', ').map(name => name.trim()) });
                                }}
                                required
                            />
                            {/* {Array.from({ length: editReservation.adults }, (_, index) => (
                                <TextField
                                    key={index}
                                    fullWidth
                                    label={`Guest ${index + 1} Name`}
                                    value={editReservation.guestNames[index] || ''}
                                    onChange={(e) => {
                                        const newGuestNames = [...editReservation.guestNames];
                                        newGuestNames[index] = e.target.value;
                                        setEditReservation({ ...editReservation, guestNames: newGuestNames });
                                    }}
                                    required
                                />
                            ))} */}
                        </Stack>
                    </form>
                </DialogContent>
                <DialogActions>
                    <Stack width="100%" direction="row" spacing={2} justifyContent={'space-around'}>
                        <Button onClick={() => handleClose()} color="secondary">
                            Close
                        </Button>
                        <Button 
                            // type="submit" 
                            onClick={handleEditSubmit}
                            variant="contained" 
                            color="primary"
                            disabled={loading}
                            endIcon={loading ? <CircularProgress size={20} /> : null}
                        >
                            Save Changes
                        </Button>
                    </Stack>
                </DialogActions>
            </Dialog>
            {/* dialog cancel */}
            <Dialog
                open={open === 'cancelReservation'}
                onClose={() => {handleClose}}
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle sx={{ m:0, p:2}}>
                    <Stack direction={"row"} spacing={2} justifyContent={'space-between'} alignItems={"center"}>
                        <Typography variant="h6" gutterBottom>
                            Are you sure you want to cancel this reservation?
                        </Typography>
                        <IconButton
                            onClick={() => handleClose()}
                            sx={{
                                position: 'absolute',
                                top: 0,
                                right: 0,
                                color: theme => theme.palette.grey[500],
                                '&:hover': {
                                    color: theme => theme.palette.primary.main,
                                }
                            }}
                        >
                            <Close />
                        </IconButton>
                    </Stack>
                </DialogTitle>
 
                <DialogActions>
                    <Stack width="100%" direction="row" spacing={2} justifyContent={'space-around'}>
                        <Button onClick={() => handleClose()} color="secondary">
                            Close
                        </Button>
                        <Button 
                            // type="submit" 
                            onClick={handleCancelSubmit}
                            variant="contained" 
                            color="primary"
                            disabled={loading}
                            endIcon={loading ? <CircularProgress size={20} /> : null}
                        >
                            Cancel Reservation
                        </Button>
                    </Stack>
                </DialogActions>
            </Dialog>
        </Box>
    )
}

export default ReservationsPage;