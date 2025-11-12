import React from "react";
import { Outlet } from "react-router-dom";
// import Header from "./components/Header";
const MainLayout: React.FC = (): JSX.Element => {
  // const [sidebarOpen] = useState(false);
  return (
    <>
      {/* <div className="h-screen w-full items-center flex flex-col bg-no-repeat bg-cover" style={{ backgroundImage: `url(${Backdrop})` }}> */}
      <div className="h-screen w-full items-center flex flex-col bg-no-repeat bg-cover">
          {/* <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} /> */}
          <Outlet />
      </div>
    </>
  );
};

export default MainLayout;
