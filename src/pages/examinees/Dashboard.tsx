import { useState, useEffect } from "react";
import { useExamineeExamQuery, useSubmitExam, useUpdateStatus } from "../../hooks/useExamineeHooks";
import { formatTime } from "../../helpers/utils";
import { Candidate } from "../../types/auth.type";
import { useNavigate } from "react-router-dom";
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import customParseFormat from 'dayjs/plugin/customParseFormat';
// import { updatestatus } from "../../services/examinee.service";
// import { Question } from "../../types/examinee.dto";
export interface SubmitAnswerPayload {
    examId: string;
    candidateId: string;
    questionId: string;
    answer: string;
}

dayjs.extend(duration);
dayjs.extend(customParseFormat);

const ExamInterface = () => {
    const [examStarted, setExaStarted] = useState(false);
    const [questions, setQuestions] = useState<any[]>([]);
    const [answers, setAnswers] = useState<Record<any, any>>({});
    // const { mutate: updateExam } = useUpdateExaminee()
    const [username] = useState('')
    const [submitted, setSubmitted] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const [_] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showTimerModal, setShowTimerModal] = useState(false);
    const questionsPerPage = 6;
    const storedUser = localStorage.getItem("examinee");
    const initialUser = storedUser ? JSON.parse(storedUser) : null;
    const [user, setUser] = useState<Candidate>(initialUser);
    const { data: exam } = useExamineeExamQuery(user?.id as string);
    const totalPages = exam ? Math.ceil(exam?.questions?.length / questionsPerPage) : 0;
    const [feedback, setFeedback] = useState<SubmitAnswerPayload[]>([])
    const [paginatedQuestions, setPaginatedQuestions] = useState<any[]>([])
    const { mutate: updateExamStatus } = useUpdateStatus()
    const navigate = useNavigate()

    const { mutate: submitExam } = useSubmitExam()


    useEffect(() => {
        document.documentElement.requestFullscreen?.();
        const savedAnswers = localStorage.getItem("examAnswers");
        const savedPage = localStorage.getItem("examPage");

        if (savedAnswers || savedPage) {
            // setShowResumeModal(true);
        } else {
            // setQuestions(shuffleArray(rawQuestions));
        }
        setUser(initialUser);
    }, []);

    useEffect(() => {
        if (!exam) return;

        const parsedQuestions = exam.questions.map((q: any) => ({
            ...q,
            // parse JSON string into object
            // options: JSON.parse(q.options)
        }));
        // console.log('answers pulled are', exam)
        if (exam.answers) {
            setAnswers(exam.answers)
        }

        // console.log(exam.questions)

        const startIndex = currentPage * questionsPerPage;
        const endIndex = startIndex + questionsPerPage;

        setPaginatedQuestions(exam.questions.slice(startIndex, endIndex));

        const examStart = user.examTime.split('-')[1].trim(); // e.g. "09:00PM"
        const examDateTime = dayjs(
            `${dayjs(user.examDate).format('YYYY-MM-DD')} ${examStart}`,
            'YYYY-MM-DD hh:mmA'
        );

        const now = dayjs();
        const diff = examDateTime.diff(now, 'minutes');
        setTimeLeft(diff * 60)
        const interval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    handleSubmit()
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        setExaStarted(true)
        setQuestions(parsedQuestions);
        return () => clearInterval(interval);

    }, [exam]);


    // useEffect(() => {
    //     if (!exam?.startDate) return;

    //     const startTime = new Date(exam.startDate).getTime();
    //     const now = Date.now();
    //     const diffInSeconds = Math.max(0, Math.floor((startTime - now) / 1000));
    //     setExamStartDate(diffInSeconds);

    //     const interval = setInterval(() => {
    //         setExamStartDate((prev) => {
    //             if (prev <= 1) {
    //                 clearInterval(interval);
    //                 // handleSubmit()
    //                 return 0;
    //             }
    //             return prev - 1;
    //         });
    //     }, 1000);

    //     return () => clearInterval(interval);
    // }, [exam?.startDate]);

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden && examStarted && !submitted) {
                alert("⚠️ You switched tabs or minimized the window.");
                // handleSubmit()
            }
        };
        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
    }, [examStarted, submitted]);


        useEffect(() => {
        // --- Desktop: right click & keys ---
        const blockRightClick = (e: MouseEvent) => e.preventDefault();

        const blockKeys = (e: KeyboardEvent) => {
          const key = e.key.toUpperCase();
          if (
            key === "F12" ||
            (e.ctrlKey && e.shiftKey && ["I", "J", "C", "K"].includes(key)) ||
            (e.ctrlKey && ["U", "S", "H"].includes(key)) || // U = view-source, S = save, H = help/inspect
            (e.metaKey && ["P", "S"].includes(key)) || // mac cmd+P/Cmd+S etc
            key === "ESC"
          ) {
            e.preventDefault();
            e.stopImmediatePropagation();
            return false;
          }
        };

        // --- Mobile: block long-press/context menu and gestures ---
        // long-press on touch devices often triggers context menu / image save
        const blockContextMenu = (e: Event) => {
          const target = e.target as HTMLElement;
          if (
          target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.tagName === "BUTTON" ||
          target.isContentEditable
        ) {
          return; // allow context actions for form elements
        }
          e.preventDefault();
          e.stopPropagation();
          return false;
        };

        // Prevent copy/paste and selection
        const blockCopy = (e: ClipboardEvent) => {
          e.preventDefault();
          e.stopImmediatePropagation();
          return false;
        };
        const blockSelect = (e: Event) => {
          e.preventDefault();
          e.stopImmediatePropagation();
          return false;
        };

        // Prevent drag (images/text)
        const blockDrag = (e: DragEvent) => {
          e.preventDefault();
          e.stopImmediatePropagation();
          return false;
        };

        // Prevent pinch to zoom / gesturestart (iOS Safari)
        const blockGesture = (e: Event) => {
          e.preventDefault();
          e.stopImmediatePropagation();
          return false;
        };

        // Small "devtools open" detector — heuristic
        const detectDevTools = (() => {
        //   let last = +new Date();
          return () => {
            // Heuristic: large difference between outer and inner dims
            // const threshold = 160;
            // if (
            //   (window.outerWidth - window.innerWidth > threshold) ||
            //   (window.outerHeight - window.innerHeight > threshold)
            // ) {
            //   // Action: choose what to do — redirect, blank page, or show overlay
            //   // Example: navigate away to a safe page
            //   window.location.href = "about:blank";
            //   return true;
            // }

            // Another heuristic: debugger timing trap
            const start = performance.now();
            // eslint-disable-next-line no-debugger
            debugger;
            const delta = performance.now() - start;
            if (delta > 100) {
              window.location.href = "about:blank";
              return true;
            }
            // last = +new Date();
            return false;
          };
        })();

        // Poll interval (low frequency to reduce perf impact)
        const detectInterval = window.setInterval(detectDevTools, 1500);

        // Attach listeners
        document.addEventListener("contextmenu", blockRightClick);
        document.addEventListener("keydown", blockKeys, true);

        // Mobile/touch listeners
        document.addEventListener("touchstart", blockContextMenu, { passive: false });
        document.addEventListener("touchend", () => {}, { passive: true }); // no-op but keeps touch pipeline predictable
        document.addEventListener("gesturestart", blockGesture, { passive: false }); // iOS legacy
        document.addEventListener("copy", blockCopy, true);
        document.addEventListener("cut", blockCopy, true);
        document.addEventListener("paste", blockCopy, true);
        document.addEventListener("selectstart", blockSelect, true);
        document.addEventListener("dragstart", blockDrag, true);

        // Prevent two-finger double-tap / double-tap zoom on some browsers
        let lastTouch = 0;
        const preventDoubleTapZoom = (e: TouchEvent) => {
          const now = Date.now();
          if (now - lastTouch <= 300) {
            e.preventDefault();
          }
          lastTouch = now;
        };
        document.addEventListener("touchend", preventDoubleTapZoom, { passive: false });

        return () => {
          document.removeEventListener("contextmenu", blockRightClick);
          document.removeEventListener("keydown", blockKeys, true);
          document.removeEventListener("touchstart", blockContextMenu);
          document.removeEventListener("gesturestart", blockGesture);
          document.removeEventListener("copy", blockCopy, true);
          document.removeEventListener("cut", blockCopy, true);
          document.removeEventListener("paste", blockCopy, true);
          document.removeEventListener("selectstart", blockSelect, true);
          document.removeEventListener("dragstart", blockDrag, true);
          document.removeEventListener("touchend", preventDoubleTapZoom);
          clearInterval(detectInterval);
        };
      }, []);

    const handleAnswer = (questionId: string, value: any) => {
        const updated = { ...answers, [questionId]: value };
        setAnswers(updated);
        localStorage.setItem("examAnswers", JSON.stringify(updated));
        setFeedback((prev) => {
            const existingIndex = prev.findIndex(
                (item) => item.questionId === questionId
            );

            if (existingIndex !== -1) {
                // Update existing answer
                const updated = [...prev];
                updated[existingIndex].answer = value;
                return updated;
            }

            // Add new answer
            return [...prev, { examId: exam?.id as string, questionId, candidateId: user.id, answer: value }];
        });
    };

    const goToPage = (page: number) => {

        if (!exam) return

        const startIndex = page * questionsPerPage;
        const endIndex = startIndex + questionsPerPage;

        setPaginatedQuestions(exam.questions.slice(startIndex, endIndex));
        setCurrentPage(page);
        // localStorage.setItem("examPage", page.toString());
        submitExam(feedback)
    };

    const handleSubmit = async () => {
        setSubmitted(true);

        document.exitFullscreen?.();
        console.log("Submitted answers:", answers);

        // const payload = Object.entries(answers).map(([key, value]) => ({
        //     question_id: Number(key),
        //     answer: value,
        // }));



        await submitExam(feedback)
        await updateExamStatus({ status: 'EXAM_COMPLETED' })
        // localStorage.removeItem("examAnswers");
        // localStorage.removeItem("examPage");
        // localStorage.clear();

        navigate('/completed')
    };

    // useEffect(() => {
    //     if (timeLeft <= 0) return
    //     const timer = setInterval(() => {
    //         setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    //     }, 1000);

    //     return () => clearInterval(timer);
    // }, [timeLeft])



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
                    <p className="font-bold">
                        <strong>{Object.keys(answers).length}</strong> out of <strong>{questions.length}</strong> questions.
                    </p>
                    <span className="font-mono text-lg animate-pulse">Time Left: {formatTime(timeLeft)}</span>

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
                <div className="overflow-y-auto max-h-[calc(100vh-12rem)] grid grid-cols-1 md:grid-cols-2 gap-4 mx-auto md:mx-6 mb-32 p-2">
                    {paginatedQuestions.map((q, index) => {

                        return (
                            <div key={q.id} className="bg-white dark:bg-[#1A1B1F] p-6 rounded-xl shadow-md ">
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                                    {currentPage * questionsPerPage + index + 1}. {q.question}
                                </h3>

                                {q.type === "single_choice" && (
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="radio"
                                                name={`q-${q.id}`}
                                                checked={answers[q.id] === q.option_a}
                                                onChange={() => handleAnswer(q.id, q.option_a)}
                                                className="accent-green-600"
                                            />
                                            <span>{q.option_a as string}</span>
                                        </label>
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="radio"
                                                name={`q-${q.id}`}
                                                checked={answers[q.id] === q.option_b}
                                                onChange={() => handleAnswer(q.id, q.option_b)}
                                                className="accent-green-600"
                                            />
                                            <span>{q.option_b as string}</span>
                                        </label>
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="radio"
                                                name={`q-${q.id}`}
                                                checked={answers[q.id] === q.option_c}
                                                onChange={() => handleAnswer(q.id, q.option_c)}
                                                className="accent-green-600"
                                            />
                                            <span>{q.option_c as string}</span>
                                        </label>
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="radio"
                                                name={`q-${q.id}`}
                                                checked={answers[q.id] === q.option_d}
                                                onChange={() => handleAnswer(q.id, q.option_d)}
                                                className="accent-green-600"
                                            />
                                            <span>{q.option_d as string}</span>
                                        </label>
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
                </div>
                {/* )} */}
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

            </main>


            {showTimerModal && !submitted && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-red-500 dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-md w-full">
                        <h2 className="text-xl font-bold text-white dark:text-white mb-4">
                            ⏳ 15 Minutes Remaining
                        </h2>
                        <p className="text-white dark:text-gray-300 mb-6">
                            You have 15 minutes left to complete your exam. Please review your answers.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowTimerModal(false)}
                                className="px-4 py-2 bg-black/30 dark:bg-gray-700 text-white dark:text-white rounded hover:bg-black/40 dark:hover:bg-gray-600"
                            >
                                Continue
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

            {/* Floating Video Feed (Draggable, Non-Minimizable) */}
            <video
                ref={(ref) => {
                    if (ref && !ref.srcObject) {
                        navigator.mediaDevices
                            .getUserMedia({ video: true, audio: false })
                            .then((stream) => {
                                ref.srcObject = stream;
                                ref.play().catch(() => { });
                            })
                            .catch((err) => console.error("Camera access denied:", err));
                    }
                }}
                id="examCam"
                className="fixed top-8 left-6 w-40 h-40 sm:w-32 sm:h-32 rounded-lg shadow-lg border-2 border-black object-cover cursor-move z-[9999] transition-all duration-300 ease-in-out"
                style={{ touchAction: "none" }}
                // Removed tap-to-minimize behavior
                onClick={() => {
                    // Do nothing on click
                }}
                onMouseDown={(e) => {
                    const video = e.currentTarget;
                    video.style.position = "fixed";
                    const rect = video.getBoundingClientRect();
                    const shiftX = e.clientX - rect.left;
                    const shiftY = e.clientY - rect.top;

                    const moveAt = (pageX: number, pageY: number) => {
                        video.style.left = pageX - shiftX + "px";
                        video.style.top = pageY - shiftY + "px";
                    };

                    const onMouseMove = (event: MouseEvent) => moveAt(event.pageX, event.pageY);
                    document.addEventListener("mousemove", onMouseMove);

                    document.onmouseup = () => {
                        document.removeEventListener("mousemove", onMouseMove);
                        document.onmouseup = null;
                    };
                }}
                onTouchStart={(e) => {
                    const video = e.currentTarget;
                    video.style.position = "fixed";
                    const touch = e.touches[0];
                    const rect = video.getBoundingClientRect();
                    const shiftX = touch.clientX - rect.left;
                    const shiftY = touch.clientY - rect.top;

                    const moveAt = (pageX: number, pageY: number) => {
                        video.style.left = pageX - shiftX + "px";
                        video.style.top = pageY - shiftY + "px";
                    };

                    const onTouchMove = (event: TouchEvent) => {
                        const t = event.touches[0];
                        moveAt(t.pageX, t.pageY);
                    };

                    document.addEventListener("touchmove", onTouchMove);
                    document.ontouchend = () => {
                        document.removeEventListener("touchmove", onTouchMove);
                        document.ontouchend = null;
                    };
                }}
            />

        </div>
    );
};

export default ExamInterface;