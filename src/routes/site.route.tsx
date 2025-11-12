import { RouteObject } from "react-router-dom";
import Login from "../pages/site/Login";

const siteRouter: RouteObject[] = [
  {
    path: "",
    element: <Login />,
  },
  {
    path: "*",
    element: <h1>Page Not Found</h1>,  // Replace with your own 404 page component
  },
  
];

export default siteRouter;
