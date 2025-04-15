import { Box, Button, Checkbox, FormControl, FormControlLabel, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { useState } from "react";

function RoomFilters({ onSubmit }) {
    const [formValues, setFormValues] = useState({
        roomType: '',
        location: '',
        occupancy: '',
        minPrice: '',
        maxPrice: '',
        isAvailable: ''
    });
    const handleFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormValues(prev => {
            return {
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }
        })
    }

    const handlePriceChange = (type, value) => {
        setFormValues(prev => {
            if(type === 'min') {
                return {
                    ...prev,
                    minPrice: Number(value)
                }
            } else {
                return {
                    ...prev,
                    maxPrice: Number(value)
                }
            }
        })
    }

    const handleFormSubmit = (e) => {
        e.preventDefault();
        onSubmit(formValues);
    }
    return (
        <>
            <form onSubmit={handleFormSubmit}>
                {/* <Button onClick={()=>console.log(formValues)}>formValues</Button> */}
                <Box sx={{ mb: 3 }}>
                    <FormControl fullWidth>
                        <InputLabel shrink={true} >Room Type</InputLabel>
                        <Select
                            name="roomType"
                            value={formValues.roomType}
                            onChange={handleFormChange}
                        >
                            <MenuItem value="">All Types</MenuItem>
                            <MenuItem value="Single">Single</MenuItem>
                            <MenuItem value="Double">Double</MenuItem>
                            <MenuItem value="Deluxe">Deluxe</MenuItem>
                            <MenuItem value="Suite">Suite</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
                <Box sx={{ mb: 3 }}>
                    <TextField
                        fullWidth
                        label="Location"
                        name="location"
                        value={formValues.location}
                        onChange={handleFormChange}
                    />
                </Box>
                <Box sx={{ mb: 3 }}>
                    <FormControl fullWidth>
                        <InputLabel>Occupancy</InputLabel>
                        <Select
                            name="occupancy"
                            value={formValues.occupancy}
                            onChange={handleFormChange}
                        >
                            <MenuItem value="">Any</MenuItem>
                            <MenuItem value="1">1 Person</MenuItem>
                            <MenuItem value="2">2 People</MenuItem>
                            <MenuItem value="3">3 People</MenuItem>
                            <MenuItem value="4">4 People</MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                <Box sx={{ mb: 3 }}>
                    <TextField
                        fullWidth
                        label="Minimum Price"
                        name="minPrice"
                        value={formValues.minPrice}
                        onChange={(e) => handlePriceChange('min', e.target.value)}
                        type="number"
                    />
                </Box>

                <Box sx={{ mb: 3 }}>
                    <TextField
                        fullWidth
                        label="Maximum Price"
                        name="maxPrice"
                        value={formValues.maxPrice}
                        onChange={(e) => handlePriceChange('max', e.target.value)}
                        type="number"
                    />
                </Box>
                <FormControlLabel
                    control={
                        <Checkbox
                            name="isAvailable"
                            checked={formValues.isAvailable}
                            onChange={handleFormChange}
                        />
                    }
                    label="Show only available rooms"
                />

                <Box sx={{ mt: 3 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        fullWidth
                    >
                        Apply Filters
                    </Button>
                </Box>
            </form> 
        </>
    )
}

export default RoomFilters;