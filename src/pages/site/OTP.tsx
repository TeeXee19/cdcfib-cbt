/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import AuthCard from "../../components/molecules/AuthCard";
import Button from "../../components/atoms/Button";
import { VerificationDto } from "../../types/auth.type";
import { handleInputChange, handleSubmitForm } from "../../helpers/utils";
import { useVerifyTokenMutation } from "../../hooks/useAuth";
import { useLocation } from "react-router-dom";
// import { useOtpVerifyMutation } from "../../hooks/useAuth"; 

const Otp: React.FC = (): JSX.Element => {
  const location = useLocation();
  const token: string = location.state.token;
  const email: string = location.state.username;
  const [formData, setFormData] = useState<VerificationDto>({
    username: email,
    code: "",
    token: token
  });

  const { mutate: VerifyOtp, isPending: loading } = useVerifyTokenMutation({ path: '/dashboard' });
  return (
    <AuthCard
      question="Didn’t receive the code?"
      actionLabel="Resend OTP"
      actionHref="/otp" // update to match your route/action
      label="BMIS"
    >
      <form onSubmit={(e) => handleSubmitForm(VerifyOtp)(e, formData)} className="space-y-6">
        <div>
          <label
            htmlFor="code"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Enter OTP
          </label>
          <input
            id="code"
            name="code"
            type="text"
            value={formData.code}
            onChange={(e) => handleInputChange(e, setFormData, formData)}
            placeholder="Enter the 6-digit code"
            maxLength={6}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
          />
        </div>

        <Button
          type="submit"
          onclick={() => { }}
          label="Verify OTP"
          width="w-full"
          bgColor="bg-[#006838]"
          color="text-white"
          disabled={loading}
        />
      </form>
    </AuthCard>
  );
};

export default Otp;
