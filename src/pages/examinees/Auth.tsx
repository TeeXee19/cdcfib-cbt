import { useState, useEffect, useRef } from 'react';
import ExamineeCard from '../../components/molecules/ExamineeCard';
import { useCandidateLoginMutation } from '../../hooks/useAuth';
import { ExamineeAccessPayload } from '../../types/auth.type';
import { handleInputChange, handleSubmitForm } from '../../helpers/utils';
// Assuming a custom hook or function for routing/redirection
// import { useNavigate } from 'react-router-dom'; 


const Auth = () => {

  const [formData, setFormData] = useState<ExamineeAccessPayload>({
    phoneNumber: "",
    nin: "",
  });
  const { mutate: login, isPending: isLoading, error } = useCandidateLoginMutation()

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [captchaText, setCaptchaText] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaError, setCaptchaError] = useState("");
  const [captchaValidated, setCaptchaValidated] = useState(false);

  useEffect(() => {

    generateCaptcha()
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
      // let last = +new Date();
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
    document.addEventListener("touchend", () => { }, { passive: true }); // no-op but keeps touch pipeline predictable
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

  const generateCaptcha = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Generate random text
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
    let text = "";
    for (let i = 0; i < 5; i++) {
      text += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaText(text);

    // Draw background
    ctx.fillStyle = "#f0f0f0";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw text
    ctx.font = "30px Arial";
    ctx.fillStyle = "#333";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);

    // Add noise lines
    for (let i = 0; i < 5; i++) {
      ctx.strokeStyle = `hsl(${Math.random() * 360}, 50%, 50%)`;
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.stroke();
    }

    // Add noise dots
    for (let i = 0; i < 20; i++) {
      ctx.fillStyle = `hsl(${Math.random() * 360}, 50%, 60%)`;
      ctx.beginPath();
      ctx.arc(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        2,
        0,
        2 * Math.PI
      );
      ctx.fill();
    }

    // Reset states
    setCaptchaInput("");
    setCaptchaValidated(false);
    setCaptchaError("");
  };

  const validateCaptcha = () => {
    setCaptchaError("");

    if (!captchaInput.trim()) {
      setCaptchaError("Please enter the captcha text");
      return false;
    }

    const userInput = captchaInput.trim();
    const correctCaptcha = captchaText;

    if (userInput === correctCaptcha) {
      setCaptchaValidated(true);
      setCaptchaError("");
      // alert("Captcha validated successfully!");
      return true;
    } else {
      setCaptchaValidated(false);
      setCaptchaError("Incorrect captcha. Please try again.");

      // Generate a new one after 1 second
      setTimeout(generateCaptcha, 1000);
      return false;
    }
  };

  const handleSubmi = async(e:any)=>{
    e.preventDefault()
    await validateCaptcha();
    if(captchaValidated){
      handleSubmitForm(login)(e, formData)
    }else{
      alert('Captch not verified yet')
    }
  }



  return (
    <ExamineeCard
      label="Candidate Login"
      question=""
      actionLabel=""
      actionHref="/support"
    >


      <div className="login-container">
        <form onSubmit={(e) => handleSubmi(e)}>
          {/* NIN Input Field */}
          <div className="form-group">
            <label htmlFor="nin" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              NIN
            </label>
            <input
              id="nin"
              name="nin"
              type="text"
              inputMode="numeric"
              pattern="\d{11}"
              maxLength={11}
              value={formData.nin}
              onChange={(e) => handleInputChange(e, setFormData, formData)}
              placeholder="e.g., 12345678901"
              required
              aria-describedby="nin-help"
              className="w-full text-sm rounded-lg border-2 border-gray-300 bg-white dark:bg-[#101110] text-gray-900 dark:text-[#C4C4C4] focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 p-2 sm:p-2.5 lg:p-3"
            />
            <p id="nin-help" className="mt-1 text-xs text-blue-800 italic dark:text-gray-400">
              <span className='inline-block w-2 h-2 mr-1 bg-blue-800 rounded-full'></span>
              Your 11-digit National Identification Number.
            </p>
          </div>

          {/* Phone Number Input Field */}
          <div className="form-group">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Phone Number
            </label>
            <input
              id="phone"
              name="phoneNumber"
              type="text"
              inputMode="numeric"
              // pattern="\d{11}"
              maxLength={11}
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange(e, setFormData, formData)}
              placeholder="e.g., 08012345678"
              required
              aria-describedby="phone-help"
              className="w-full text-sm rounded-lg border-2 border-gray-300 bg-white dark:bg-[#101110] text-gray-900 dark:text-[#C4C4C4] focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 p-2 sm:p-2.5 lg:p-3"
            />
            <p id="phone-help" className="mt-1 text-xs text-blue-800 italic dark:text-gray-400">
              <span className='inline-block w-2 h-2 mr-1 bg-blue-800 rounded-full'></span>
              The phone number registered for the exam.
            </p>
          </div>

          <div className="captcha-container" style={{ textAlign: "center" }}>
            <div className="flex items-center space-x-4">
              <canvas
                ref={canvasRef}
                width={300}
                height={30}
                style={{ border: "1px solid #ccc", borderRadius: "5px" }}
              />
              <button
                type="button"
                onClick={generateCaptcha}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Refresh
              </button>
            </div>
            <div className="flex items-center space-x-4 px-4">
              <div className='my-4 flex items-center'>
                <input
                  type="text"
                  className='text-sm rounded-lg border-2 border-gray-300 bg-white dark:bg-[#101110] text-gray-900 dark:text-[#C4C4C4] focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 p-2 sm:p-2.5 lg:p-3'
                  value={captchaInput}
                  onChange={(e) => setCaptchaInput(e.target.value)}
                  placeholder="Enter captcha"
                  style={{ padding: "6px", width: "200px" }}
                />
                <button
                  onClick={validateCaptcha}
                  type='button'
                  style={{ marginLeft: "10px", padding: "6px 10px" }}
                  className='text-white rounded-lg bg-gradient-to-r from-green-700 to-green-900'
                >
                  Validate
                </button>
              </div>
            </div>

            {captchaError && (
              <p style={{ color: "red", marginTop: "5px" }}>{captchaError}</p>
            )}

            {captchaValidated && (
              <p style={{ color: "green", marginTop: "5px" }}>
                Captcha validated successfully!
              </p>
            )}
          </div>

          {/* Error Display */}
          {error && (
            <p className="text-sm text-red-600 font-medium">
              {error.message}
            </p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full h-[45px] md:h-[50px] px-4 py-2 text-sm md:text-lg font-bold text-white rounded-lg bg-gradient-to-r from-green-700 to-green-900 flex items-center justify-center transition-opacity duration-200 disabled:opacity-50"
            disabled={isLoading}
            aria-busy={isLoading}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  role="img"
                  aria-hidden="false"
                  aria-label="Loading"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
                <span>Logging In...</span>
              </>
            ) : (
              'Log In'
            )}
          </button>
        </form>
      </div >
    </ExamineeCard >
  );
};

export default Auth;