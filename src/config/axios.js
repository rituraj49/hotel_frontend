import axios from 'axios';
import keycloak from './keycloak';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL
});

axiosInstance.interceptors.request.use(config => {
    // const token = localStorage.getItem('token');
    // if (token) {
    //     config.headers.Authorization = `Bearer ${token}`;
    // }
    if(keycloak.authenticated) {
        config.headers.Authorization = `Bearer ${keycloak.token}`;
    }
    return config;
})
export default axiosInstance;