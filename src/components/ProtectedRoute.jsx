import { Navigate, Outlet, useLocation } from "react-router-dom";
import keycloak from "../config/keycloak";

function ProtectedRoute() {
    const token = localStorage.getItem('token');

    // const location = useLocation();
    // if(!keycloak.authenticated) {
    //     keycloak.login({
    //         redirectUri: window.location.origin + location.pathname
    //     });

    //     return null;
    // }

    if (!token) {
        return <Navigate to="/login" />;
    }
    return <Outlet />;
}

export default ProtectedRoute;