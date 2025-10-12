import { createBrowserRouter } from "react-router-dom";
import dashboardRouter from "./dashboard.route";
import examineeRouter from "./examinee.route";
import MainLayout from "../layouts/MainLayout";
import ExamineeLayout from "../layouts/ExamineeLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import siteRouter from "./site.route";

const router = createBrowserRouter([
    {
        path: "/admin",
        element: <MainLayout />,
        children:[...siteRouter]
    },
    {
        path: "/dashboard",
        element: <DashboardLayout />,
        children: [...dashboardRouter]
    }
    ,{
        path: "/",
        element: <ExamineeLayout />,
        children: [...examineeRouter]
    }
  ]);

  export default router

