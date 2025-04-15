import { AppBar, Box, Button, Toolbar } from "@mui/material";
import { Link, Outlet, useLocation } from "react-router-dom";

function Layout() {
    const location = useLocation();
    const handleLogout = (e) => {
        e.preventDefault();
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    }
    
    const isLoggedIn = localStorage.getItem('token');
    return (
        <>
            <AppBar position="static" sx={{ position:'absolute', width: '100vw', top: 0, left: 0}}>
                <Toolbar sx={{ }}>
                    <Box sx={{ flexGrow: 1 }}>
                        <Button sx={{  
                            color: 'inherit',
                            fontWeight: location.pathname === "/rooms" ? 'bold' : 'normal',
                            '&:hover': {
                                backgroundColor: location.pathname === "/rooms" ? 'primary.light' : 'action.hover',
                            },
                            backgroundColor: location.pathname === "/rooms" ? 'primary.main' : 'transparent'}} component={Link} to="/rooms">Rooms List</Button>
                        <Button sx={{  
                            color: 'inherit',
                            fontWeight: location.pathname === "/reservations" ? 'bold' : 'normal',
                            '&:hover': {
                                backgroundColor: location.pathname === "/reservations" ? 'primary.light' : 'action.hover',
                            },
                            backgroundColor: location.pathname === "/reservations" ? 'primary.main' : 'transparent'}} component={Link} to="/reservations">Reservations</Button>
                        <Button sx={{  
                            color: 'inherit',
                            fontWeight: location.pathname === "/profile" ? 'bold' : 'normal',
                            '&:hover': {
                                backgroundColor: location.pathname === "/profile" ? 'primary.light' : 'action.hover',
                            },
                            backgroundColor: location.pathname === "/rooms" ? 'primary.main' : 'transparent'}} component={Link} to="/profile">Profile</Button>
                        <Button  component={Link} to="/rooms">Rooms List</Button>
                    </Box>
                    {
                        isLoggedIn ?
                        <Button onClick={handleLogout} color="inherit" component={Link}>Logout</Button> :
                        <Button color="inherit" component={Link} to="/login">Login</Button>
                    }
                </Toolbar>
            </AppBar>

            <Box sx={{ position: 'relative', top: 40}}>
                <Outlet />
            </Box>
        </>
    )
}

export default Layout;