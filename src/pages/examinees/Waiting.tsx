import { useEffect, useRef, useState } from "react";
import Logo from "@/assets/logo.png";
import { getItem } from "../../helpers/storage";
import { Candidate } from "../../types/auth.type";
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useNavigate } from "react-router-dom";



const TTL_SECONDS = 15 * 60;
const IDLE_TIMEOUT_MS = 10 * 60 * 1000;

dayjs.extend(duration);
dayjs.extend(customParseFormat);

function nowSec() {
  return Math.floor(Date.now() / 1000);
}

function generateSessionId() {
  return `sess_${Date.now()}_${Math.floor(Math.random() * 1e6)}`;
}

// async function getCanvasHash(): Promise<string> {
//   try {
//     const canvas = document.createElement("canvas");
//     canvas.width = 200;
//     canvas.height = 50;
//     const ctx = canvas.getContext("2d")!;
//     ctx.fillStyle = "#f0f0f0";
//     ctx.fillRect(0, 0, canvas.width, canvas.height);
//     ctx.fillStyle = "#111";
//     ctx.font = "16px Arial";
//     ctx.fillText("ExamPortal", 10, 30);
//     const data = canvas.toDataURL();
//     const enc = new TextEncoder().encode(data);
//     const hashBuf = await crypto.subtle.digest("SHA-256", enc);
//     return Array.from(new Uint8Array(hashBuf)).map(b => b.toString(16).padStart(2, "0")).join("");
//   } catch {
//     return "no-canvas";
//   }
// }


function captureFrame(video: HTMLVideoElement) {
  const w = video.videoWidth || 640;
  const h = video.videoHeight || 480;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(video, 0, 0, w, h);
  return canvas.toDataURL("image/jpeg", 0.8);
}

async function approxImageDiffPercent(dataUrlA: string, dataUrlB: string) {
  // load images
  const loadImg = (src: string) =>
    new Promise<HTMLImageElement>((res, rej) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => res(img);
      img.onerror = rej;
      img.src = src;
    });

  const [imgA, imgB] = await Promise.all([loadImg(dataUrlA), loadImg(dataUrlB)]);
  const w = Math.min(imgA.width, imgB.width);
  const h = Math.min(imgA.height, imgB.height);

  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d")!;

  ctx.drawImage(imgA, 0, 0, w, h);
  const a = ctx.getImageData(0, 0, w, h).data;
  ctx.clearRect(0, 0, w, h);
  ctx.drawImage(imgB, 0, 0, w, h);
  const b = ctx.getImageData(0, 0, w, h).data;

  let diffCount = 0;
  const step = 8; // sample every Nth pixel to reduce CPU
  for (let i = 0; i < a.length; i += 4 * step) {
    const dr = Math.abs(a[i] - b[i]);
    const dg = Math.abs(a[i + 1] - b[i + 1]);
    const db = Math.abs(a[i + 2] - b[i + 2]);
    if (dr + dg + db > 30) diffCount++;
  }
  const totalSamples = Math.ceil((a.length / 4) / step);
  return (diffCount / totalSamples) * 100;
}


function makeLockKey(examNumber: string) {
  return `exam_lock:${examNumber}`;
}

function setLocalLock(examNumber: string, sessionId: string) {
  const key = makeLockKey(examNumber);
  const payload = {
    sessionId,
    createdAtSec: nowSec(),
    ttl: TTL_SECONDS,
  };
  // check existing
  const raw = localStorage.getItem(key);
  if (raw) {
    try {
      const obj = JSON.parse(raw) as { sessionId: string; createdAtSec: number; ttl: number };
      // if expired, overwrite
      if (nowSec() - obj.createdAtSec > (obj.ttl || TTL_SECONDS)) {
        localStorage.setItem(key, JSON.stringify(payload));
        return payload.sessionId;
      } else {
        // active lock, can't set
        throw new Error("locked");
      }
    } catch {
      // malformed, set new
      localStorage.setItem(key, JSON.stringify(payload));
      return payload.sessionId;
    }
  } else {
    localStorage.setItem(key, JSON.stringify(payload));
    return payload.sessionId;
  }
}

function removeLocalLock(examNumber: string) {
  localStorage.removeItem(makeLockKey(examNumber));
}

function refreshLocalLock(examNumber: string, sessionId: string) {
  const key = makeLockKey(examNumber);
  const raw = localStorage.getItem(key);
  if (!raw) return false;
  try {
    const obj = JSON.parse(raw);
    if (obj.sessionId !== sessionId) return false;
    obj.createdAtSec = nowSec();
    obj.ttl = TTL_SECONDS;
    localStorage.setItem(key, JSON.stringify(obj));
    return true;
  } catch {
    return false;
  }
}


export default function WaitingRoomSecure(): JSX.Element {
  const [examNumber, setExamNumber] = useState("");
  const [stage, setStage] = useState<"input" | "preview" | "captured" | "waiting" | "error">("input");
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const heartbeatRef = useRef<number | null>(null);
  const idleTimerRef = useRef<number | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [livenessPercent, setLivenessPercent] = useState<number | null>(null);
  // const [ setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number } | null>(null);
  // const [ setStarted] = useState(false);
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [candidateNumberVerified, setCandidateNumberVerified] = useState<boolean>(false);
  // const [cameraVerified, setCameraVerified] = useState<boolean>(false);
  const navigate = useNavigate()




  // anti-inspect and right-click (permissive for form input focus)
  // useEffect(() => {
  //   const blockContext = (e: MouseEvent) => {
  //     const t = e.target as HTMLElement;
  //     // allow if clicking inputs or inside forms
  //     if (t && (t.closest("input") || t.closest("textarea") || t.closest("form") || t.tagName === "INPUT")) {
  //       return;
  //     }
  //     e.preventDefault();
  //   };
  //   const blockKeys = (e: KeyboardEvent) => {
  //     const key = e.key.toUpperCase();
  //     if (key === "F12" || (e.ctrlKey && e.shiftKey && ["I", "J", "C"].includes(key)) || (e.ctrlKey && key === "U")) {
  //       e.preventDefault();
  //       e.stopPropagation();
  //     }
  //   };

  //   document.addEventListener("contextmenu", blockContext);
  //   document.addEventListener("keydown", blockKeys, true);

  //   // detect devtools by viewport difference (heuristic)
  //   const devtoolsChecker = setInterval(() => {
  //     const threshold = 160;
  //     if (window.outerWidth - window.innerWidth > threshold || window.outerHeight - window.innerHeight > threshold) {
  //       // gentle: show message, then reload to break inspection
  //       setMessage("Please close developer tools to continue.");
  //       setTimeout(() => window.location.reload(), 1400);
  //     }
  //   }, 1500);

  //   return () => {
  //     document.removeEventListener("contextmenu", blockContext);
  //     document.removeEventListener("keydown", blockKeys, true);
  //     clearInterval(devtoolsChecker);
  //   };
  // }, []);

  // idle timeout (reset on events)
  useEffect(() => {
    const resetIdle = () => {
      if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current);
      idleTimerRef.current = window.setTimeout(() => {
        alert("Session expired due to inactivity.");
        // cleanup and force reload
        if (sessionId && examNumber) removeLocalLock(examNumber);
        window.location.reload();
      }, IDLE_TIMEOUT_MS);
    };
    ["click", "keydown", "touchstart", "mousemove"].forEach(ev => window.addEventListener(ev, resetIdle));
    resetIdle();
    return () => {
      ["click", "keydown", "touchstart", "mousemove"].forEach(ev => window.removeEventListener(ev, resetIdle));
      if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current);
    };
  }, [sessionId, examNumber]);

  // storage event listener so another tab releasing lock notifies us
  useEffect(() => {
    const onStorage = (ev: StorageEvent) => {
      if (!ev.key) return;
      if (ev.key === makeLockKey(examNumber) && !ev.newValue) {
        // lock removed in another tab
        setMessage("Previous session was closed on another tab/device.");
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [examNumber]);

  // cleanup on unmount
  // useEffect(() => {
  //   return () => {
  //     stopCamera();
  //     if (heartbeatRef.current) window.clearInterval(heartbeatRef.current);
  //   };
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  /* ------------------ Camera control ------------------ */

  async function startCamera(): Promise<boolean> {
    setMessage(null);

    if (!navigator.mediaDevices?.getUserMedia) {
      setMessage("Camera access is not supported in this browser.");
      return false;
    }

    // Stop any existing camera stream
    stopCamera();

    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const hasCam = devices.some(d => d.kind === "videoinput");
      if (!hasCam) {
        setMessage("No camera detected on this device.");
        return false;
      }

      const constraints: MediaStreamConstraints = {
        video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      if (!stream.getVideoTracks().length) {
        setMessage("Camera detected but no video track available.");
        stream.getTracks().forEach(t => t.stop());
        return false;
      }

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.muted = true;         // must be set BEFORE play() for autoplay
        videoRef.current.playsInline = true;   // essential for iOS Safari
        videoRef.current.load();               // helps trigger playback in some browsers

        try {
          await videoRef.current.play();
        } catch (err: any) {
          console.warn("Video autoplay failed:", err);
          // setMessage("Cannot start camera automatically. Click 'Start Verification' again.");
          return false;
        }
      }

      return true;
    } catch (err: any) {
      console.error("startCamera error:", err);

      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
        streamRef.current = null;
      }

      if (err.name === "NotAllowedError") {
        setMessage("Camera permission denied. Please allow access to continue.");
      } else if (err.name === "NotFoundError") {
        setMessage("No camera found. Please connect a camera.");
      } else {
        setMessage("Unable to access camera. Ensure your browser supports webcam access.");
      }

      return false;
    }
  }
  function stopCamera() {
    try {
      const s = streamRef.current;
      if (s) {
        s.getTracks().forEach(t => t.stop());
        streamRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.srcObject = null;
      }
    } catch (err) {
      console.warn("stopCamera error:", err);
    }
  }

  /* ------------------ Session & Liveness flow ------------------ */

  async function verifyAndCreateSessionClientSide() {
    setMessage(null);
    setIsLoading(true);

    // Simple client-side validation
    if (!examNumber || examNumber.trim().length < 4) {
      setMessage("Please enter a valid exam number.");
      setIsLoading(false);
      return;
    }

    if (examNumber != candidate?.candidateNumber) {
      // console.log(examinee.candidateNumber)
      setMessage("Please enter a valid exam number.");
      setIsLoading(false);
      return;
    }

    setCandidateNumberVerified(true)
    setMessage(null)

    // Try to set lock in localStorage (single active session per examNumber)
    const sid = generateSessionId();
    try {
      setLocalLock(examNumber, sid);
    } catch (err) {
      setMessage("Another active session exists for this exam number. Close it or use the same tab.");
      setIsLoading(false);
      setStage("error");
      return;
    }
    
    // setStage("preview"); // first set stage
    // setTimeout(() => initCameraPreview(), 50); // give React a tick to render video
    
    setSessionId(sid);

    // Start heartbeat: refresh lock TTL in localStorage on interval
    heartbeatRef.current = window.setInterval(() => {
      if (sessionId) {
        refreshLocalLock(examNumber, sid);
        // console.log("heartbeat refresh", examNumber, sid);
      }
    }, 25 * 1000);

    // start camera preview (and move to preview stage)
    const camOk = await startCamera();
    if (!camOk) {
      // remove lock if camera isn't available
      removeLocalLock(examNumber);
      setIsLoading(false);
      setStage("error");
      return;
    }

    setStage("preview");
    setTimeout(() => initCameraPreview(), 50);
    setIsLoading(false);
  }

  /** Check basic WebRTC integrity: stream exists and has live video track */
  function webrtcIntegrityCheck(): { ok: boolean; reason?: string } {
    const s = streamRef.current;
    if (!s) return { ok: false, reason: "No media stream" };
    const tracks = s.getVideoTracks();
    if (!tracks.length) return { ok: false, reason: "No video track available" };
    const track = tracks[0];
    if (track.readyState !== "live") return { ok: false, reason: "Track not live" };
    // If browser supports getSettings, check for width/height
    const settings = track.getSettings ? (track.getSettings() as MediaTrackSettings) : null;
    if (settings && (!settings.width || !settings.height)) {
      return { ok: false, reason: "Video dimensions appear invalid" };
    }
    return { ok: true };
  }

  /** Capture two frames and run client-side liveness (motion) check */
  async function captureAndVerifyLiveness() {
    setIsLoading(true);
    setMessage(null);

    // basic webrtc check
    const wcheck = webrtcIntegrityCheck();
    if (!wcheck.ok) {
      setMessage(`Camera integrity failed: ${wcheck.reason}`);
      setIsLoading(false);
      return;
    }

    // capture two frames ~900ms apart
    if (!videoRef.current) {
      setMessage("Video preview unavailable.");
      setIsLoading(false);
      return;
    }

    const frame1 = captureFrame(videoRef.current);
    await new Promise(r => setTimeout(r, 900));
    const frame2 = captureFrame(videoRef.current);

    // quick approx diff
    let percent = 0;
    try {
      percent = await approxImageDiffPercent(frame1, frame2);
      setLivenessPercent(percent);
    } catch (err) {
      // if processing fails, allow retry
      setMessage("Unable to process frames. Please try again.");
      setIsLoading(false);
      return;
    }

    // threshold: require small movement (>= ~4%)
    if (percent < 4) {
      setMessage("Please move slightly (turn head, blink or nod) and try again.");
      setIsLoading(false);
      return;
    }

    // Save captured image locally (simulate upload) and mark verified
    setCapturedImage(frame2);
    setStage("captured");
    setMessage("Liveness check passed. Waiting for admission...");
    setIsLoading(false);
  }

  function admitAndFinish() {
    // simulate admit: clean lock and redirect to exam
    removeLocalLock(examNumber);
    stopCamera();
    navigate('/exam')
    if (heartbeatRef.current) window.clearInterval(heartbeatRef.current);
    // alert("You have been admitted. Redirecting to exam...");
    
  }

 async function initCameraPreview() {
  if (!videoRef.current) return;

  try {
    stopCamera(); // stop any existing stream

    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "user", width: 640, height: 480 },
      audio: false,
    });

    streamRef.current = stream;

    videoRef.current.srcObject = stream;
    videoRef.current.muted = true;
    videoRef.current.playsInline = true;

    await videoRef.current.play();
    console.log("✅ Camera initialized successfully");
  } catch (err: any) {
    console.error("Camera init failed:", err);
    setMessage("Unable to access camera. Please allow permission or check your device.");
  }
}


  useEffect(() => {
  const examinee: Candidate = getItem('examinee');
  setCandidate(examinee);

  // Only start camera if stage is "preview" and video element exists
  if (stage === "preview") {
    startCamera();
  }

  return () => {
    stopCamera(); // cleanup on unmount
  };
}, [stage]);

  useEffect(() => {
    if (!candidate) return;

    const examStart = candidate.examTime.split('-')[0].trim(); // e.g. "09:00PM"
    const examDateTime = dayjs(
      `${dayjs(candidate.examDate).format('YYYY-MM-DD')} ${examStart}`,
      'YYYY-MM-DD hh:mm A'
    );

    const interval = setInterval(() => {
      const now = dayjs();
      const diff = examDateTime.diff(now, 'minutes');
      console.log(diff)
      if(!candidateNumberVerified) {
         setMessage("Candidate Number not verified yet.");
        // alert('You have not verified your candidate number')
        // return
      }
      if (diff <= 0) {
        if(candidateNumberVerified){
          navigate('/')
        }
        // setStarted(true);
        clearInterval(interval);
        admitAndFinish()
      } else {
        // const d = dayjs.duration(diff);
        // setTimeLeft({
        //   hours: d.hours(),
        //   minutes: d.minutes(),
        //   seconds: d.seconds(),
        // });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [candidate]);

  /* ------------------ UI ------------------ */

  return (
    <div className="min-h-screen flex items-center justify-center bg-[linear-gradient(135deg,#008751_0%,#005a36_60%)] p-4">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl p-6 text-center">
        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <img
              src={Logo}
              alt="CBT App Logo"
              className="w-24 sm:w-32 md:w-40 object-contain transition-transform duration-500 hover:scale-105"
            />
          </div>
          <h1 className="text-2xl font-semibold text-[#005a36] mt-3">Examination Waiting Room</h1>
          <p className="text-gray-500 text-sm mt-1">Identity verification & readiness checks</p>
        </div>

        {stage === "input" && (
          <>
            <h2 className="text-lg font-semibold text-gray-700 mb-3">Enter Exam Number</h2>
            <input
              value={examNumber}
              onChange={(e) => setExamNumber(e.target.value)}
              placeholder="EXM-123456"
              className="w-full p-3 border border-gray-200 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-600"
            />
            <div className="flex gap-3">
              <button
                onClick={verifyAndCreateSessionClientSide}
                className="flex-1 bg-green-700 hover:bg-green-800 text-white py-2 rounded-lg font-medium disabled:opacity-60"
                disabled={isLoading}
              >
                {isLoading ? "Checking..." : "Start Verification"}
              </button>
              <button
                onClick={() => {
                  // optional camera test
                  (async () => {
                    setIsLoading(true);
                    const ok = await startCamera();
                    if (ok) {
                      setMessage("Camera works. Close preview to continue.");
                      setTimeout(() => {
                        stopCamera();
                        setMessage(null);
                        setIsLoading(false);
                      }, 1500);
                    } else {
                      setIsLoading(false);
                    }
                  })();
                }}
                className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg"
              >
                Test Camera
              </button>
            </div>
            {message && <div className="mt-3 text-sm text-red-600">{message}</div>}
            <div className="mt-6 text-xs text-gray-400">We respect your privacy. Camera images are used only for verification.</div>
          </>
        )}

        {stage === "preview" && (
          <>
            <h2 className="text-lg font-semibold text-gray-700 mb-3">Camera Preview</h2>
            <div className="mx-auto w-[300px] h-[300px]  bg-black rounded-full overflow-hidden">
              <video
                ref={videoRef}
                className="w-full h-full object-cover bg-black border border-white"
                autoPlay
                muted
                playsInline
              />

              {/* <video autoPlay muted playsInline width="640" height="480" ></video> */}

            </div>

            <div className="mt-4 flex gap-3">
              <button
                onClick={captureAndVerifyLiveness}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Capture & Verify"}
              </button>
              <button
                onClick={() => {
                  stopCamera();
                  removeLocalLock(examNumber);
                  setStage("input");
                }}
                className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>

            {livenessPercent !== null && (
              <div className="mt-3 text-sm text-gray-700">Motion detected: {livenessPercent.toFixed(1)}%</div>
            )}
            {message && <div className="mt-3 text-sm text-red-600">{message}</div>}
          </>
        )}

        {stage === "captured" && (
          <>
            <h2 className="text-lg font-semibold text-gray-700 mb-3">Preview Capture</h2>
            {capturedImage ? (
              <img src={capturedImage} alt="capture" className="mx-auto w-[300px] h-[300px] object-cover rounded-full border" />
            ) : (
              <div className="w-48 h-36 bg-gray-100 mx-auto rounded" />
            )}
            <div className="mt-4 flex gap-3">
              <button
                onClick={() => {
                  // finalize (simulate upload and wait)
                  setMessage("Submitting verification (simulated)...");
                  setTimeout(() => {
                    setMessage("Verification submitted. Please wait to be admitted.");
                    setStage("waiting");
                    // stop camera but keep session lock until admit / timeout
                    stopCamera();
                  }, 900);
                }}
                className="flex-1 bg-green-700 hover:bg-green-800 text-white py-2 rounded-lg"
              >
                Submit Verification
              </button>
              <button
                onClick={() => {
                  // retry capture
                  setMessage(null);
                  setCapturedImage(null);
                  setLivenessPercent(null);
                  (async () => {
                    const ok = await startCamera();
                    if (ok) setStage("preview");
                  })();
                }}
                className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg"
              >
                Retry
              </button>
            </div>
            {message && <div className="mt-3 text-sm text-gray-600">{message}</div>}
          </>
        )}

        {stage === "waiting" && (
          <>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Verified — Awaiting Admission</h2>
            <p className="text-gray-600 mb-4">You will be admitted into the exam by the proctor when ready.</p>
            <div className="flex gap-3">
              {/* <button
                onClick={() => {
                  // simulate admin admitting the user (for demo)
                  admitAndFinish();
                }}
                className="flex-1 bg-green-700 hover:bg-green-800 text-white py-2 rounded-lg"
              >
                Simulate Admit (Demo)
              </button> */}
              <button
                onClick={() => {
                  // user cancels
                  removeLocalLock(examNumber);
                  stopCamera();
                  window.location.reload();
                }}
                className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
            <div className="mt-3 text-xs text-gray-400">Session ID: {sessionId}</div>
          </>
        )}

        {stage === "error" && (
          <div className="mt-3 text-red-600">{message}</div>
        )}

        <footer className="mt-6 text-xs text-gray-400">
          &copy; {new Date().getFullYear()} Exam Portal — verification only.
        </footer>
      </div>
    </div>
  );
}
