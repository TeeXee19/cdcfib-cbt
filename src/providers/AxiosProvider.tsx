import axios from "axios";
import { ElementType } from "../types/elemetn.type";
// import { useNavigate } from "react-router-dom";
import { getItem } from "../helpers/storage";
import { customToast } from "../helpers/toast";

export function AxiosProvider({ children }: ElementType) {
  //   const navigate = useNavigate();
  axios.interceptors.request.use(
    (config) => {
      // Add a token to the request headers
      if (!config.url?.includes("auth")) {
        const token = getItem("token");
        if (token) {
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
    (response) => {
      console.log(response);
      return response.data;
    },
    (error) => {
      // Redirect to login page if unauthorized
      if (
        error.response?.status === 401 &&
        window.location.pathname != "/login"
      ) {
        customToast.info("You need to Login first");
        window.location.href = "/login";
      } else if (error.response?.status === 403) {
        customToast.warning("You are not authorized to view this page");
        window.location.href = "/dashboard";
      } else {
        customToast.info(error.response?.data.message);
        // console.error(error);
      }
      console.log(error);
      return error;
    }
  );
  return children;
}
