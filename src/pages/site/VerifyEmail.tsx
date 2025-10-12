import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import AuthCard from "../../components/molecules/AuthCard";
import { useForgotPasswordMutation, useVerifyTokenMutation } from "../../hooks/useAuth";
import Button from "../../components/atoms/Button";
import { useLocation } from "react-router-dom";

const VerifyEmail: React.FC = (): JSX.Element => {
  const [token, setToken] = useState<string>("");
  const location = useLocation();
  const path: string = location.state.nextPath;
  const email: string = location.state.username;
  const secret: string = location.state.token

  const { mutate: verifyOTP } = useVerifyTokenMutation({ path: path || '/login' });
  const { mutate: resendOTPMutation, isPending } = useForgotPasswordMutation()
  const [loading, setLoading] = useState<boolean>(false);

  const [post, setPost] = useState<Record<string, string>>({
    otp1: "",
    otp2: "",
    otp3: "",
    otp4: "",
  });

  useEffect(() => {
    if (Object.values(post).every((val) => val.length === 1)) {
      setToken(Object.values(post).join(""));
    }
  }, [post]); // Re-run when post changes

  useEffect(() => {
    if (token.length == 4) {
      setLoading(true);
      verifyOTP({ token: secret, username: email, code: token });// Call the mutation when token is set
    }
  }, [token]);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleInput = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const { name, value } = e.target;
    setPost((prev) => ({ ...prev, [name]: value }));
    if (value && index < Object.keys(post).length - 1) {
      inputRefs.current[index + 1]?.focus(); // Move focus to next input
    }
  };

  return (
    <>
      <AuthCard
        question="Know Your Password?"
        actionLabel="Sign In"
        label="Verify OTP."
      >
        {/* {isLoading && <CircularProgress />}
        {isError && <div>{error.message}</div>}
        {data && <div>Email verified successfully!</div>} */}
        <div className="max-w-md mx-auto text-center bg-white px-4 sm:px-8 py-10 rounded-xl shadow">
          <form id="otp-form">
            <div className="flex items-center justify-center gap-3">
              {Object.keys(post).map((key, index) => (
                <div className="items-start" key={key}>
                  <input
                    type="text"
                    name={key}
                    maxLength={1}
                    onChange={(e) => handleInput(e, index)}
                    value={post[key]}
                    className="text-center w-14 h-14 border-2 border-gray-300 rounded-xl"
                    ref={(el) => (inputRefs.current[index] = el)}
                  />
                </div>
              ))}
            </div>
            <div className="max-w-[260px] mx-auto mt-4">
              <Button
                type="submit"
                onclick={() => { }}
                label={loading ? '...Loading' : 'Sign In'}
                width="w-[100%]"
                bgColor="bg-black"
                color="text-white"
                disabled={loading}
              />
            </div>
          </form>
          <div className="text-sm text-slate-500 mt-4">
            Didn't receive code?{" "}
            <button
              className="font-medium text-indigo-500 hover:text-indigo-600"
              onClick={() => {
                // setLoading(true);
                resendOTPMutation({ username: email })
              }}
            >
              {isPending ? '...Loading' : 'Resend'}
            </button>
          </div>
        </div>
      </AuthCard>
    </>
  );
};

export default VerifyEmail;
