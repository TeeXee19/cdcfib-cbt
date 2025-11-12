import { ReactNode } from "react";
import { Link } from "react-router-dom";
import Logo from "@/assets/logo.png";

interface AuthCardProps {
  children: ReactNode;
  label: string;
  question?: string;
  actionLabel?: string;
  actionHref?: string; // added for flexibility
}

const AuthCard = ({ children, question, actionLabel, actionHref }: AuthCardProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full items-center justify-center min-h-screen px-4 md:px-0">
      {/* Left section (form card) */}
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg mx-auto">
        {children}
        {question && actionLabel && actionHref && (
          <p className="mt-6 text-center text-gray-600 text-sm">
            {question}{" "}
            <Link to={actionHref} className="text-green-600 font-semibold hover:underline !text-left">
              {actionLabel}
            </Link>
          </p>
        )}
      </div>

     <div className="flex items-end flex-col justify-center text-center  mr-0 bg-gradient-to-br from-green-700 to-green-900 min-h-screen p-8">
          <div className="flex flex-col items-center justify-center w-full gap-2">
            <img src={Logo} alt="" className="w-[40%]" />
          {/* <div className="w-full text-[Helvetica] text-[48px] font-[700] text-white">
            {label}
          </div> */}
          </div>
          
        </div>
    </div>
  );
};

export default AuthCard;
