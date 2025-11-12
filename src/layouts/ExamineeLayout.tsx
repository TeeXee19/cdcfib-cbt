import React from "react";
import { Outlet } from "react-router-dom";

const ExamineeLayout: React.FC = (): JSX.Element => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start bg-gray-50">
      {/* Optional: Add a fixed header or timer bar here */}
      <main className="w-full">
        <Outlet />
      </main>
    </div>
  );
};

export default ExamineeLayout;