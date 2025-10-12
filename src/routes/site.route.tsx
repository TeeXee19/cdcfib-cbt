import { RouteObject } from "react-router-dom";
import Login from "../pages/site/Login";
import ForgotPassword from "../pages/site/ForgotPassword";
import VerifyEmail from "../pages/site/VerifyEmail";
import ResetPassword from "../pages/site/ResetPassword";
import OTP from "../pages/site/OTP";
import MFA from "../pages/site/MFA";

const siteRouter: RouteObject[] = [
  // {
  //   path: "/register",
  //   element: <SignUp />,
  // },
  {
    path: "",
    element: <Login />,
  },
  {
    path: "/admin/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/admin/account/verify",
    element: <VerifyEmail />,
  },
  {
    path: "/admin/reset-password",
    element: <ResetPassword />,
  },
  {
    path: "/admin/otp",
    element: <OTP />,
  },
  {
    path: "/admin/mfa",
    element: <MFA />,
  },
  {
    path: "*",
    element: <h1>Page Not Found</h1>,  // Replace with your own 404 page component
  },
  
];

export default siteRouter;
