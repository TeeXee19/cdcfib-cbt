import axios from 'axios';
import axiosInterceptor from './AxiosInterceptor';


const baseUrl = process.env.VITE_API_BASE_URL;
const axiosApi = axios.create({
    baseURL: baseUrl,
});

axiosInterceptor.setupInterceptors(axiosApi);
export default axiosApi;