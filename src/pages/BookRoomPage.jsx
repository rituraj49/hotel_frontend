import {
    Button,
    TextField,
    Paper,
    Typography,
    Box,
    Stack,
    Autocomplete,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Card,
    Divider
} from "@mui/material";
import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../config/axios";

function BookRoomPage() {
    const location = useLocation();
    const roomDetails = location?.state?.room;
    const params = useParams();
    const navigate = useNavigate();
    const [guestNames, setGuestNames] = useState(['']);
    const [formData, setFormData] = useState({
        checkInDate: null,
        checkOutDate: null,
        adults: 0,
        children: 0,
    });
    const [loading, setLoading] = useState(false);

    const handleGuestNameChange = (index, value) => {
        const newGuestNames = [...guestNames];
        newGuestNames[index] = value;
        setGuestNames(newGuestNames);
    };

    const handleAddGuest = () => {
        setGuestNames([...guestNames, '']);
    };

    const handleRemoveGuest = (index) => {
        const newGuestNames = guestNames.filter((_, i) => i !== index);
        setGuestNames(newGuestNames);
    };

    const validateDate = (date) => {
        if (!date) return false;

        const today = new Date();
        const selectedDate = new Date(date);

        return selectedDate >= today;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const reservationData = {
            ...formData,
            guestNames: guestNames.filter(name => name.trim() !== ''),
            paymentId: 1,
            guestId: 1,
            roomId: Number(params.roomId),
            amount: getAmountWithTax() 
        };
        console.log('Reservation data:', reservationData);
        // Object.assign(formData, { paymentId: 1 });
        // Object.assign(formData, { guestId: 1 });

        try {
            const res = await axiosInstance.post(`api/v1/reservations/create`, reservationData);
            console.log('res resservation create', res);
            if (res.status === 201) {
                setLoading(true);
                setTimeout(() => {
                    setLoading(false);
                }, 2000);
                navigate('/reservations');
            }
        } catch (error) {
            console.error('Error creating reservation:', error);
        }
    };

    const getTotalPrice = () => {
        const totalPrice = roomDetails?.price ?
            roomDetails.price *
            ((new Date(formData.checkOutDate)) -
                (new Date(formData.checkInDate))) /
            (1000 * 60 * 60 * 24)
            : roomDetails?.price;

        return totalPrice;
    }

    const getAmountWithTax = () => {
        return getTotalPrice() + (0.18 * getTotalPrice());
    }

    return (
        <div style={{ padding: '20px' }}>
            <Typography variant="h4" gutterBottom>
                Book Room
            </Typography>

            <Paper elevation={3} style={{ padding: '20px' }}>
                <form onSubmit={handleSubmit}>
                    <Stack spacing={3} sx={{}}>
                        <Stack direction={'row'} spacing={2}>
                            <TextField
                                type="date"
                                label="Check in time"
                                slotProps={{
                                    inputLabel: {
                                        shrink: true
                                    }
                                }}
                                value={formData.checkInDate}
                                onChange={(e) => {
                                    setFormData({ ...formData, checkInDate: e.target.value })
                                }}
                                InputProps={{
                                    inputProps: {
                                        min: new Date().toISOString().split('T')[0]
                                    }
                                }}
                            />
                            <TextField
                                type="date"
                                label="Check out time"
                                slotProps={{
                                    inputLabel: {
                                        shrink: true
                                    }
                                }}
                                value={formData.checkOutDate}
                                onChange={(e) => {
                                    const checkOutDate = e.target.value;
                                    setFormData({ ...formData, checkOutDate });
                                }}
                                InputProps={{
                                    inputProps: {
                                        min: formData.checkInDate ? new Date(formData.checkInDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
                                    }
                                }}
                            />
                        </Stack>

                        <Stack direction="row" spacing={2}>
                            <TextField
                                label="Number of Adults"
                                type="number"
                                value={formData.adults}
                                onChange={(e) => {
                                    const adults = e.target.value;
                                    setFormData({ ...formData, adults: parseInt(adults) });
                                    // setGuestNames([''.repeat(parseInt(adults))]);
                                    // Array.from({ length: adults }).map(a => setGuestNames([...guestNames, '']));
                                }}
                                inputProps={{ min: 1 }}
                            />
                            <TextField
                                label="Number of Children"
                                type="number"
                                value={formData.children}
                                onChange={(e) => setFormData({ ...formData, children: parseInt(e.target.value) })}
                                inputProps={{ min: 0 }}
                            />
                        </Stack>
                        <Typography variant="h6" gutterBottom>
                            Guest Names
                        </Typography>
                        {/* <Button onCl
                        in thiick={()=>console.log(guestNames)}>gustName</Button>
                        <Button onClick={()=>console.log(location.state)}>form data</Button> */}
                        {guestNames.map((name, index) => (
                            <Stack direction="row" spacing={2} key={index}>
                                <TextField
                                    label={`Guest ${index + 1} Name`}
                                    value={name}
                                    onChange={(e) => handleGuestNameChange(index, e.target.value)}
                                    required
                                />
                                {guestNames.length > 1 && (
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        onClick={() => handleRemoveGuest(index)}
                                    >
                                        Remove
                                    </Button>
                                )}
                            </Stack>
                        ))}
                        <Button
                            variant="outlined"
                            onClick={handleAddGuest}
                            style={{ marginTop: '10px' }}
                        >
                            Add Guest
                        </Button>
                        <Card sx={{ p: 2, mb: 2 }}>
                            <Stack spacing={1}>
                                <Typography variant="subtitle1" color="text.secondary">
                                    Room Details
                                </Typography>

                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                    <Typography variant="body1">
                                        Your Total:
                                    </Typography>
                                    <Typography variant="h6" color="primary">
                                        ₹ {getTotalPrice()}
                                    </Typography>
                                </Stack>
                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                    <Typography variant="body1">
                                        Taxes
                                    </Typography>
                                    <Typography variant="h6" color="primary">
                                    ₹ {(0.18 * getTotalPrice()).toFixed(2)}
                                    </Typography>
                                </Stack>
                                <Divider />
                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                    <Typography variant="body1">
                                        Total(INR):
                                    </Typography>
                                    <Typography variant="h6" color="primary">
                                        ₹ {getAmountWithTax().toFixed(2)}
                                    </Typography>
                                </Stack>
                            </Stack>
                        </Card>

                        {/* <TextField
                            label="Payment ID"
                            type="number"
                            value={formData.paymentId}
                            onChange={(e) => setFormData({ ...formData, paymentId: parseInt(e.target.value) })}
                            required
                        /> */}

                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            style={{ marginTop: '20px' }}
                            disabled={loading}
                        >
                            {loading ? "Redirecting..." : "Reserve"}
                        </Button>
                    </Stack>
                </form>
            </Paper>
        </div>
    );
}

export default BookRoomPage;