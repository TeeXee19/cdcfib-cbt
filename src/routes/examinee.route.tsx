import { RouteObject } from "react-router-dom";
import AUTH from "../pages/examinees/Auth";
import DASHBOARD from "../pages/examinees/Dashboard";


const siteRouter: RouteObject[] = [
  // {
  //   path: "/register",
  //   element: <SignUp />,
  // },
  {
    path: "/",
    element: <AUTH />,
  },{
    path: "/dashboard",
    element: <DASHBOARD />,
  },

  {
    path: "*",
    element: <h1>Page Not Found</h1>,  // Replace with your own 404 page component
  },
  
];

export default siteRouter;
