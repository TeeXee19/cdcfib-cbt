/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import AuthCard from "../../components/molecules/AuthCard";
import Email from "../../components/compounds/Email";
import Button from "../../components/atoms/Button";
import { ForgotPasswordType } from "../../types/auth.type";
import { useForgotPasswordMutation } from "../../hooks/useAuth";
import { handleSubmitForm } from "../../helpers/utils";

const ForgotPassword: React.FC = (): JSX.Element => {
  const {mutate:forgotPassword, isPending} = useForgotPasswordMutation();
  const [formData, setFormData] = useState<ForgotPasswordType>({
    username: "",
  });

  const handleChange = (e: any) => {
    console.log(e.target);
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  return (
    <>
      <AuthCard
        question="Know Your Password?"
        actionLabel="Sign In"
        label="BMIS"
      >
        <form onSubmit={(e)=>handleSubmitForm(forgotPassword)(e, formData)}>
          <Email
            name="username"
            label="Email"
            placeholder="Enter Your Email"
            value={formData.username}
            emitChange={handleChange}
          />
          {/* <Link className="text-[Open Sans] text-[20px] font-[300]" to="">Forgot Password</Link> */}
          <div className="py-4">
            <Button
              type="submit"
              onclick={() => {}}
              label="Request Password Reset"
              width="w-[100%]"
              bgColor="bg-[#006838]"
              color="text-white"
              disabled={isPending}
            />
          </div>
        </form>
      </AuthCard>
    </>
  );
};

export default ForgotPassword;
