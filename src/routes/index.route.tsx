import { createBrowserRouter } from "react-router-dom";
import dashboardRouter from "./dashboard.route";
import MainLayout from "../layouts/MainLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import siteRouter from "./site.route";

const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        children:[...siteRouter]
    },
    {
        path: "/dashboard",
        element: <DashboardLayout />,
        children: [...dashboardRouter]
    }
  ]);

  export default router

