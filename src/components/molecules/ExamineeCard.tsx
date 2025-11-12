import { ReactNode } from "react";
import { Link } from "react-router-dom";
import Logo from "@/assets/logo.png";

interface ExamineeCardProps {
  children: ReactNode;
  label: string;
  question?: string;
  actionLabel?: string;
  actionHref?: string;
}

const ExamineeCard = ({
  children,
  label,
  question,
  actionLabel,
  actionHref,
}: ExamineeCardProps) => {
  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 w-full min-h-screen items-center justify-center px-4 md:px-0 bg-gray-50 bg-[url('@/assets/bg-auth.svg')] bg-repeat bg-cover"
      style={{ backgroundPosition: 'center', backgroundSize: 'cover' }}>
      {/* Left section (form card) */}
      <div className="w-full max-w-md bg-white p-6 sm:p-8 rounded-2xl shadow-lg mx-auto animate-fade-in">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-gray-800">
          {label}
        </h2>
        {children}
        {question && actionLabel && actionHref && (
          <p className="mt-6 text-center text-sm text-gray-600">
            {question}{" "}
            <Link
              to={actionHref}
              className="text-green-600 font-semibold hover:underline"
            >
              {actionLabel}
            </Link>
          </p>
        )}
      </div>

      {/* Right section (branding) */}
      <div className="hidden md:flex items-center justify-center bg-gradient-to-br from-green-700 to-green-900 min-h-screen p-8 animate-slide-in">
        <div className="flex flex-col items-center justify-center w-full gap-6 text-center">
          <img
            src={Logo}
            alt="CBT App Logo"
            className="w-24 sm:w-32 md:w-40 object-contain transition-transform duration-500 hover:scale-105"
          />
          <div className="text-white text-2xl sm:text-3xl font-semibold leading-snug">
            CDCFIB
            <br />
            Examination Portal
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamineeCard;