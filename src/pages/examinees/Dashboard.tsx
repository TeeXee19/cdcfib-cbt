import { useState, useEffect } from "react";
import { useExamineeExamQuery } from "../../hooks/useExamineeHooks";
import { ExamineeSessionPayload } from "../../types/examinee.dto";

// import Echo from 'laravel-echo';
// import Pusher from 'pusher-js';
import { formatTime } from "../../helpers/utils";
// import { useDeleteExam } from "../../hooks/useExam";

// declare global {
//     interface Window {
//         Pusher: typeof Pusher;
//     }
// }


// const shuffleArray = (array: any[]) => [...array].sort(() => Math.random() - 0.5);

const ExamInterface = () => {
    const [examStarted, setExamStarted] = useState(false);
    const [questions, setQuestions] = useState<any[]>([]);
    const [answers, setAnswers] = useState<Record<number, any>>({});


    // const countdown = setInterval(() => {
    //     setTimeLeft((prev) => {
    //         const next = prev - 1;

    //         // 🔁 every 10 seconds, push to server
    //         if (next % 10 === 0) {
    //             console.log("⏱ Sending timer update:", next);
    //             echo.connector.pusher.send_event(
    //                 "client-timer-update",
    //                 {
    //                     userId,
    //                     timeLeft: next,
    //                 },
    //                 `private-exam-timer.${userId}`
    //             );
    //         }

    //         return next > 0 ? next : 0;
    //     });
    //      echo.private(`exam-timer.${userId}`).whisper();
    // }, 1000);

    // useEffect(() => {
    //     clearInterval(countdown )
    // }, [])

    // channel.listen(".timer-updated", (data: any) => {
    //     console.log("Timer broadcasted from backend:", data);
    //     //   setTimeRemaining(data.timeRemaining);
    // });

    // const pusher = echo.connector;

    // Listen for connection state changes
    // pusher.connection.bind('connected', () => {
    //     console.log('✅ Connected to WebSocket server!');
    // });



    const [username, setUsername] = useState('')
    const [submitted, setSubmitted] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const [_, setExamStartDate] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showResumeModal, setShowResumeModal] = useState(false);

    const questionsPerPage = 2;


    const storedUser = localStorage.getItem("examinee");

    const initialUser = storedUser ? JSON.parse(storedUser) : null;
    const [user, setUser] = useState<ExamineeSessionPayload>(initialUser);
    const { data: exam } = useExamineeExamQuery(user?.id as string);



    // const [visibleQuestions, setVisiblequestions] = useState<QuestionPayload[]>()

    const totalPages = exam ? Math.ceil(exam?.questions?.length / questionsPerPage) : 0;




    // Detect saved session
    useEffect(() => {
        const savedAnswers = localStorage.getItem("examAnswers");
        const savedPage = localStorage.getItem("examPage");

        if (savedAnswers || savedPage) {
            setShowResumeModal(true);
        } else {
            // setQuestions(shuffleArray(rawQuestions));
        }
        setUser(initialUser);
    }, []);

    useEffect(() => {
        if (!examStarted) return;
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev === 15 * 60) setShowConfirmModal(true);
                if (prev <= 1) {
                    clearInterval(timer);
                    handleSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [examStarted]);

    useEffect(() => {
        if (user) {
            setUsername(user.first_name)
            setTimeLeft(+user.time_left * 60)
        }
    }, [user])

    const handleStartExam = () => {
        if (!isExamTime()) return
        setExamStarted(true); // this will trigger the query
        document.documentElement.requestFullscreen?.();
        // setTimeLeft(exam ? exam?.duration * 60 : 0); // optional: initialize timer from exam duration
        // setQuestions(shuffleArray(rawQuestions)); // if questions are part of exam object
    };

    useEffect(() => {
        if (!exam) return;

        const parsedQuestions = exam.questions.map((q: any) => ({
            ...q,
            // parse JSON string into object
            options: JSON.parse(q.options)
        }));
        setTimeLeft(Number(user.time_left) * 60)
        setQuestions(parsedQuestions);

        // const startIndex = (currentPage - 1) * questionsPerPage;
        // const endIndex = startIndex + questionsPerPage;
        // setVisiblequestions(questions.slice(startIndex, endIndex));
    }, [exam]);

    const isExamTime = () => {
        if (!exam) return false;
        return exam.status != 'active'
        // return new Date(exam.start_date) <= new Date() && new Date(exam.end_date) >= new Date()
    }

    // const handleNext = () => {
    //     if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    // };

    // const handlePrevious = () => {
    //     if (currentPage > 1) setCurrentPage(currentPage - 1);
    // };

    useEffect(() => {
        if (!exam?.start_date) return;

        const startTime = new Date(exam.start_date).getTime();
        const now = Date.now();
        const diffInSeconds = Math.max(0, Math.floor((startTime - now) / 1000));
        setExamStartDate(diffInSeconds);

        const interval = setInterval(() => {
            setExamStartDate((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [exam?.start_date]);

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden && examStarted && !submitted) {
                alert("⚠️ You switched tabs or minimized the window.");
            }
        };
        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
    }, [examStarted, submitted]);

    // Disable inspect tools
    useEffect(() => {
        const blockRightClick = (e: MouseEvent) => e.preventDefault();
        const blockKeys = (e: KeyboardEvent) => {
            if (
                e.key === "F12" ||
                (e.ctrlKey && e.shiftKey && ["I", "J", "C"].includes(e.key)) ||
                (e.ctrlKey && e.key === "U")
            ) {
                e.preventDefault();
            }
        };
        document.addEventListener("contextmenu", blockRightClick);
        document.addEventListener("keydown", blockKeys);
        return () => {
            document.removeEventListener("contextmenu", blockRightClick);
            document.removeEventListener("keydown", blockKeys);
        };
    }, []);


    const handleAnswer = (questionId: number, value: any) => {
        const updated = { ...answers, [questionId]: value };
        setAnswers(updated);
        localStorage.setItem("examAnswers", JSON.stringify(updated));
    };

    const goToPage = (page: number) => {
        setCurrentPage(page);
        localStorage.setItem("examPage", page.toString());
    };

    const handleSubmit = () => {
        setSubmitted(true);
        localStorage.removeItem("examAnswers");
        localStorage.removeItem("examPage");
        document.exitFullscreen?.();
        console.log("Submitted answers:", answers);
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Fixed Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-green-700 text-white shadow-md">
                <div className="flex justify-between items-center px-6 py-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                        <span className="font-semibold text-lg">Welcome, {username}</span>
                        {examStarted && !submitted && (
                            <span className="text-sm sm:text-base">Page {currentPage + 1} of {totalPages}</span>
                        )}
                    </div>
                    {examStarted && !submitted && (
                        <span className="font-mono text-lg animate-pulse">Time Left: {formatTime(timeLeft)}</span>
                    )}
                    {/* {!examStarted && !submitted && (
                        <span className="font-mono text-lg animate-pulse">
                            Exam starts in: {formatTime(examStartDate)}
                        </span>
                    )} */}

                </div>
                {examStarted && !submitted && (
                    <div className="h-1 bg-green-900">
                        <div
                            className="h-full bg-gradient-to-r from-white to-green-200 transition-all duration-500"
                            style={{ width: `${((currentPage + 1) / totalPages) * 100}%` }}
                        />
                    </div>
                )}
            </nav>

            {/* Body */}
            <main className="pt-28 my-auto">
                {!examStarted && !showResumeModal ? (
                    <div className="max-w-3xl mx-auto mt-10 space-y-[10%] text-center">
                        <h2 className="text-[48px] font-bold text-green-700 dark:text-green-400">Exam Instructions</h2>
                        <ul className="text-left list-inside text-[color:var(--text-color)] text-[18px] text-gray-700 dark:text-gray-300 space-y-2">
                            <li><span className="inline-block mr-2 text-blue-600">ℹ️</span>This exam time single/multiple choice, text, number, and true/false questions.</li>
                            <li><span className="inline-block mr-2 text-blue-600">ℹ️</span>You have {timeLeft / 60} minutes to complete the exam.</li>
                            <li><span className="inline-block mr-2 text-orange-500">⚠️</span>Do not switch tabs or minimize your browser.</li>
                            <li><span className="inline-block mr-2 text-orange-500">⚠️</span>Inspect tools and shortcuts are disabled.</li>
                            <li><span className="inline-block mr-2 text-blue-600">ℹ️</span>Answers are auto-saved and can be resumed if interrupted.</li>
                            <li><span className="inline-block mr-2 text-orange-500">⚠️</span>Once submitted, answers cannot be changed.</li>
                        </ul>
                        <button
                            onClick={() => {
                                if (isExamTime()) handleStartExam();
                            }}
                            disabled={!isExamTime()}
                            className={`font-semibold text-[32px] py-3 px-6 rounded-lg transition-all duration-200 mt-[10%] ${isExamTime()
                                ? "bg-green-700 hover:bg-green-800 text-white"
                                : "bg-gray-400 text-gray-700 cursor-not-allowed"
                                }`}
                        >
                            Start Exam
                        </button>
                    </div>

                ) : submitted ? (
                    <div className="max-w-2xl mx-auto text-center space-y-6">
                        <h2 className="text-[48px] font-bold text-green-700 dark:text-green-400">Exam Submitted</h2>
                        <p className="text-amber-600 dark:text-amber-500     text-[24px]">
                            You answered <strong>{Object.keys(answers).length}</strong> out of <strong>{questions.length}</strong> questions.
                        </p>
                        <div className="text-left bg-white dark:bg-[#1A1B1F] p-6 rounded-xl shadow-md">
                            <h3 className="text-[32px] font-semibold mb-2">Submission Summary:</h3>
                            <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300 text-[24px]">
                                <li>All answers have been recorded securely.</li>
                                <li>You will not be able to modify your responses.</li>
                                <li>Thank you for completing the exam. Best of luck!</li>
                            </ul>
                        </div>
                        <button className="px-6 py-4 rounded-lg bg-red-600 dark:bg-red-500 text-[20px] text-white dark:text-white disabled:opacity-50 font-bold" onClick={() => window.location.href = '/'}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M3 4.5A1.5 1.5 0 014.5 3h7a1.5 1.5 0 010 3h-7A1.5 1.5 0 013 4.5zM3 10a1.5 1.5 0 011.5-1.5h7a1.5 1.5 0 010 3h-7A1.5 1.5 0 013 10zm0 5.5A1.5 1.5 0 014.5 14h7a1.5 1.5 0 010 3h-7A1.5 1.5 0 013 15.5zM16.354 8.354a.5.5 0 00-.708-.708l-3 3a.5.5 0 000 .708l3 3a.5.5 0 00.708-.708L14.207 11H19.5a.5.5 0 000-1h-5.293l2.147-2.146z" clipRule="evenodd" />
                            </svg>
                            Exit
                        </button>
                    </div>
                ) : (
                    <div className=" space-y-8 overflow-y-auto max-h-[calc(100vh-12rem)] pb-24">
                        {questions.map((q) => {

                            return (
                                <div key={q.id} className="bg-white dark:bg-[#1A1B1F] w-[50%] p-6 rounded-xl shadow-md mx-auto">
                                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                                        {q.id}. {q.question_text}
                                    </h3>

                                    {q.question_type === "single_choice" && (
                                        <div className="space-y-2">
                                            {Object.entries(q.options).map(([key, value]) => (
                                                <label key={key} className="flex items-center gap-2">
                                                    <input
                                                        type="radio"
                                                        name={`q-${q.id}`}
                                                        // value={value}
                                                        checked={answers[q.id] === value}
                                                        onChange={() => handleAnswer(q.id, value)}
                                                        className="accent-green-600"
                                                    />
                                                    <span>{value as string}</span>
                                                </label>
                                            ))}
                                        </div>
                                    )}

                                    {q.type === "multiple" && (
                                        <div className="space-y-2">
                                            {q.options.map((opt: string) => (
                                                <label key={opt} className="flex items-center gap-2">
                                                    <input
                                                        type="checkbox"
                                                        value={opt}
                                                        checked={answers[q.id]?.includes(opt)}
                                                        onChange={(e) => {
                                                            const prev = answers[q.id] || [];
                                                            const updated = e.target.checked
                                                                ? [...prev, opt]
                                                                : prev.filter((o: string) => o !== opt);
                                                            handleAnswer(q.id, updated);
                                                        }}
                                                        className="accent-green-600"
                                                    />
                                                    <span>{opt}</span>
                                                </label>
                                            ))}
                                        </div>
                                    )}

                                    {q.type === "text" && (
                                        <input
                                            type="text"
                                            value={answers[q.id] || ""}
                                            onChange={(e) => handleAnswer(q.id, e.target.value)}
                                            className="w-full mt-2 p-2 border rounded-lg dark:bg-[#2A2B2F] dark:text-white"
                                            placeholder="Type your answer..."
                                        />
                                    )}

                                    {q.type === "number" && (
                                        <input
                                            type="number"
                                            value={answers[q.id] || ""}
                                            onChange={(e) => handleAnswer(q.id, e.target.value)}
                                            className="w-full mt-2 p-2 border rounded-lg dark:bg-[#2A2B2F] dark:text-white"
                                            placeholder="Enter a number"
                                        />
                                    )}

                                    {q.type === "boolean" && (
                                        <div className="flex gap-4 mt-2">
                                            {["True", "False"].map((opt) => (
                                                <label key={opt} className="flex items-center gap-2">
                                                    <input
                                                        type="radio"
                                                        name={`q-${q.id}`}
                                                        value={opt}
                                                        checked={answers[q.id] === opt}
                                                        onChange={() => handleAnswer(q.id, opt)}
                                                        className="accent-green-600"
                                                    />
                                                    <span>{opt}</span>
                                                </label>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )
                        })}

                        {/* Pagination Controls */}
                        {/* <div className="flex justify-between mt-8">
                            <button
                                disabled={currentPage === 0}
                                onClick={() => goToPage(currentPage - 1)}
                                className="px-4 py-2 rounded-lg bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white disabled:opacity-50"
                            >
                                Previous
                            </button>
                            {currentPage < totalPages - 1 ? (
                                <button
                                    onClick={() => goToPage(currentPage + 1)}
                                    className="px-4 py-2 rounded-lg bg-green-700 text-white hover:bg-green-800"
                                >
                                    Next
                                </button>
                            ) : (
                                <button
                                    onClick={() => setShowConfirmModal(true)}
                                    className="px-4 py-2 rounded-lg bg-green-700 text-white hover:bg-green-800"
                                >
                                    Submit Exam
                                </button>
                            )}
                        </div> */}
                    </div>
                )}
                {examStarted && !submitted && (
                    <footer className="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-[#1A1B1F] border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center">
                        <button
                            disabled={currentPage === 0}
                            onClick={() => goToPage(currentPage - 1)}
                            className="px-4 py-2 rounded-lg bg-amber-600 dark:bg-amber-500 text-white dark:text-white disabled:opacity-50 font-bold"
                        >
                            Previous
                        </button>
                        {currentPage < totalPages - 1 ? (
                            <button
                                onClick={() => goToPage(currentPage + 1)}
                                className="px-4 py-2 rounded-lg bg-green-700 text-white hover:bg-green-800 font-bold"
                            >
                                Next
                            </button>
                        ) : (
                            <button
                                onClick={() => setShowConfirmModal(true)}
                                className="px-4 py-2 rounded-lg bg-green-700 text-white hover:bg-green-800"
                            >
                                Submit Exam
                            </button>
                        )}
                    </footer>
                )}
            </main>

            {/* Resume Modal */}
            {showResumeModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-[#1A1B1F] p-6 rounded-xl shadow-lg max-w-md w-full text-center">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Resume Exam?</h2>
                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                            A previous session was detected. Would you like to continue where you left off?
                        </p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => {
                                    setAnswers(JSON.parse(localStorage.getItem("examAnswers") || "{}"));
                                    setCurrentPage(Number(localStorage.getItem("examPage") || 0));
                                    // setQuestions(shuffleArray(rawQuestions));
                                    setShowResumeModal(false);
                                    setExamStarted(true);
                                }}
                                className="bg-green-700 hover:bg-green-800 text-white font-semibold py-2 px-4 rounded-lg"
                            >
                                Resume
                            </button>
                            <button
                                onClick={() => {
                                    localStorage.removeItem("examAnswers");
                                    localStorage.removeItem("examPage");
                                    // setQuestions(shuffleArray(rawQuestions));
                                    setShowResumeModal(false);
                                }}
                                className="bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white font-semibold py-2 px-4 rounded-lg"
                            >
                                Start Fresh
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirmation Modal */}
            {showConfirmModal && !submitted && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-[#1A1B1F] p-6 rounded-xl shadow-lg max-w-md w-full text-center">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Confirm Submission</h2>
                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                            You have answered <strong>{Object.keys(answers).length}</strong> out of <strong>{questions.length}</strong> questions.
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                            Are you sure you want to submit now? You won’t be able to change your answers after submission.
                        </p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => {
                                    setShowConfirmModal(false);
                                    handleSubmit();
                                }}
                                className="bg-green-700 hover:bg-green-800 text-white font-semibold py-2 px-4 rounded-lg"
                            >
                                Submit Now
                            </button>
                            <button
                                onClick={() => setShowConfirmModal(false)}
                                className="bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white font-semibold py-2 px-4 rounded-lg"
                            >
                                Go Back
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExamInterface;