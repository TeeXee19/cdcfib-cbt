import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import AuthCard from "../../components/molecules/AuthCard";
import { VerificationDto } from "../../types/auth.type";
import { handleSubmitForm } from "../../helpers/utils";
import { useVerifyTokenMutation } from "../../hooks/useAuth";
import Button from "../../components/atoms/Button";

interface QrResponse {
  secret: string;
  data: string; // base64 PNG
}

const QrDisplay: React.FC = (): JSX.Element => {
  const location = useLocation();
  const response: QrResponse = location.state; // backend response
  const email: string = location.state.username;


  const token: string = location.state.secret;
  const [formData, setFormData] = useState<VerificationDto>({
    username: email,
    code: "",
    token: token,
  });

  const { mutate: VerifyOtp, isPending: loading } = useVerifyTokenMutation({ path: '/dashboard' });

  return (
    <AuthCard
      label="BMIS"
      question="Use this QR code in your authenticator app"
      actionLabel=""
      actionHref=""
    >
      {/* Header */}
      <h2 className="text-center text-2xl font-semibold text-gray-800 mb-6">
        Multi-Factor Authentication Setup
      </h2>

      {/* Instructions */}
      <p className="text-center text-gray-600 mb-6">
        Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.).
      </p>

      {/* QR Code */}
      <div className="flex justify-center mb-6">
        <img
          src={response.data}
          alt="QR Code"
          className="rounded-lg shadow-md w-40 h-40 sm:w-36 sm:h-36"
        />
      </div>

      {/* Secret & Copy Button */}
      {/* <div className="text-center mb-8">
        <p className="text-sm text-gray-500 mb-1">
          Can’t scan the QR code? Use this secret manually:
        </p>
        <p className="font-medium text-gray-800 break-all">{response.secret}</p>
        <button
          onClick={handleCopy}
          className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          {copied ? "Copied!" : "Copy Secret"}
        </button>
      </div> */}

      {/* Divider */}
      <hr className="border-t border-gray-200 mb-6" />

      {/* OTP Form */}
      <form onSubmit={(e) => handleSubmitForm(VerifyOtp)(e, formData)} className="space-y-4">
        {/* OTP Input */}
        <div className={`flex flex-col items-center space-y-3 transition duration-300 ease-in-out`}>
          <label
            htmlFor="otp"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Enter 6-digit OTP
          </label>

          <div className="flex justify-center space-x-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                value={formData.code[index] || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const target = e.currentTarget;
                  const val = target.value.replace(/\D/, ""); // digits only
                  const newCode =
                    formData.code.substring(0, index) +
                    val +
                    formData.code.substring(index + 1);
                  setFormData({ ...formData, code: newCode });

                  // Move to next box
                  if (val) {
                    const next = target.nextElementSibling as HTMLInputElement | null;
                    if (next) next.focus();
                  }
                }}
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  const target = e.currentTarget as HTMLInputElement;
                  if (
                    e.key === "Backspace" &&
                    !formData.code[index]
                  ) {
                    const prev = target.previousElementSibling as HTMLInputElement | null;
                    if (prev) prev.focus();
                  }
                }}
                className="w-12 h-12 text-center text-lg font-semibold border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none"
              />
            ))}
          </div>
        </div>

        <Button
          type="submit"
          onclick={() => {}}
          label="Verify OTP"
          width="w-full"
          bgColor="bg-[#006838]"
          color="text-white"
          disabled={loading}
        />
      </form>

      {/* Footer */}
      <p className="text-center text-sm text-gray-500 mt-6">
        Associated with email: <span className="font-medium">{email}</span>
      </p>
    </AuthCard>
  );
};

export default QrDisplay;
