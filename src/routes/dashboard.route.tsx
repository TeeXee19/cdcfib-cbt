import { RouteObject } from "react-router-dom";
import Home from "../pages/dashboard/Home";
import Exam from "../pages/dashboard/examination";
import Examinee from "../pages/dashboard/examinee";

const dashboardRouter: RouteObject[] = [
  {
    path: "",
    element: <Home />,
  },
  {
    path: "/dashboard/examination",
    element: <Exam />,
  },
  {
    path: "/dashboard/examinee",
    element: <Examinee />,
  },
];

export default dashboardRouter;
