import React, { useEffect, useState } from "react";
import Logo from "@/assets/logo.png";
import { useLocation } from "react-router-dom";

const CompletedPage: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const totalMarks = 100;
    const location = useLocation();
    const totalScore = location.state?.totalScore ?? 0; // fallback to 0 if state is undefined
    const totalAnswerO = location.state.totalAnswerO ?? 0;
    
    localStorage.clear();
    useEffect(() => {
        // Simulate loading time
        
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000); // 1 second delay

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-green-100 px-4">
            <div className="bg-white/90 rounded-xl shadow-xl p-6 sm:p-10 w-full max-w-md text-center">
                {/* Logo */}
                <div className="flex justify-center mb-4">
                    <img src={Logo} alt="Logo" className="w-16 sm:w-20 h-auto" />
                </div>

                {/* Title */}
                <h1 className="text-2xl sm:text-3xl font-bold text-green-700 mb-4">
                    Exam Submitted
                </h1>

                <div className="border-t border-gray-200 my-4"></div>

                <p className="text-lg font-bold text-black/60 mb-3">{totalAnswerO} questions answered of 40</p>

                {loading ? (
                    <div className="flex justify-center items-center py-8">
                        <div className="w-10 h-10 border-4 border-green-400 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div
                        className={`w-32 h-32 mx-auto rounded-full flex flex-col justify-center items-center font-bold text-2xl shadow-md bg-green-100 text-green-600`}
                        style={{ borderWidth: "2px", borderColor: "green" }}
                    >
                        <span>
                            {totalScore} / {totalMarks}
                        </span>
                    </div>
                )}

                <button
                    onClick={() => (window.location.href = "/")}
                    className="mt-6 w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-xl transition duration-300"
                >
                    Back to Home
                </button>
            </div>
        </div>
    );
};

export default CompletedPage;
