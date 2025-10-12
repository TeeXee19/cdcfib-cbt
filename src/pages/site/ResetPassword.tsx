/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import Button from "../../components/atoms/Button";
import Password from "../../components/compounds/Password";
import AuthCard from "../../components/molecules/AuthCard";
import { ResetPasswordType } from "../../types/auth.type";
import { useResetPasswordMutation } from "../../hooks/useAuth";
import { useLocation } from "react-router-dom";

const ResetPassword: React.FC = (): JSX.Element => {
  const location = useLocation();
  const token = location.state?.token || "";
  const email = location.state?.username || "";
  const code = location.state?.code || ''
  const { mutate: resetPassword, isPending } = useResetPasswordMutation();
  const [formData, setFormData] = useState<ResetPasswordType>({
    password: "",
    confirm_password: "",
    token: token,
    email,
    code
  });

  const handleChange = (e: any) => {
    console.log(e.target);
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    resetPassword(formData);
  };
  return (
    <>
      <AuthCard
        question="Know Your Password?"
        actionLabel="Sign In"
        label="BMIS"
      >
        <form onSubmit={handleSubmit}>
          <Password
            name="password"
            value={formData.password}
            change={handleChange}
            label="Password"
          />
          <Password
            name="confirm_password"
            value={formData.confirm_password}
            change={handleChange}
            label="Confirm Password"
          />
          {/* <Link className="text-[Open Sans] text-[20px] font-[300]" to="">Forgot Password</Link> */}
          <div className="py-4">
            <Button
              type="submit"
              onclick={() => {}}
              label="Submit"
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

export default ResetPassword;
