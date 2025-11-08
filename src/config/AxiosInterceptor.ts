import { AxiosError, AxiosInstance, AxiosResponse } from "axios";

export default {
  setupInterceptors: (axios: AxiosInstance) => {
    axios.interceptors.request.use(
      (config) => {
        // Add a token to the request headers
        if (config.url?.includes("questions") || !config.url?.includes('auth')) {
          const stringToken = localStorage.getItem("token");
          if (stringToken) {
            const token = JSON.parse(stringToken)
            config.headers["Authorization"] = `Bearer ${token}`;
          }
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
    axios.interceptors.response.use(
      (response) => successHandler(response),
      (error) => errorHandler(error)
    );
    const errorHandler = (error: AxiosError) => {
      if (
        error?.response?.status === 401 &&
        window.location.pathname != "/"
      ) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/";
      } else if (error?.response?.status === 403) {
        window.location.href = "/dashboard";
      }
      return error?.response?.data;
    };
    const successHandler = (response: AxiosResponse) => {
      return response.data;
    };
  },
};
