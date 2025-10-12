/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import AuthCard from "../../components/molecules/AuthCard";
import Password from "../../components/compounds/Password";
import Email from "../../components/compounds/Email";
import Button from "../../components/atoms/Button";
import { Link } from "react-router-dom";
import { LoginType } from "../../types/auth.type";
import { useLoginMutation } from "../../hooks/useAuth";
import { handleInputChange, handleSubmitForm } from "../../helpers/utils";

const Login: React.FC = (): JSX.Element => {
  const {mutate:Login, isPending:loading}=useLoginMutation()
  const [formData, setFormData] = useState<LoginType>({
    username: "",
    password: "",
  });

  return (
    <>
      <AuthCard
        question="Don’t have an account yet? "
        label="BMIS"
      >
        <h1 className="text-green-600 text-[32px] font-bold text-center">CDCFIB ADMIN</h1>
        <p className="text-[#666666] text-[16px] font-medium text-center">Login to continue</p>
        <form onSubmit={(e)=>handleSubmitForm(Login)(e, formData)}>
          <Email
            name="username"
            label="Email"
            placeholder="Enter Your Email"
            value={formData.username}
            emitChange={(e)=>handleInputChange(e, setFormData, formData)}
          />
          <Password
            name="password"
            value={formData.password}
            change={(e)=>handleInputChange(e, setFormData, formData)}
            label="Password"
          />
          <Link
            className="text-[Open Sans] text-[12px] font-[300] text-ellipsis text-right inline-block w-full hover:underline my-2"
            to="/forgot-password"
          >
            Forgot Password ?
          </Link>
          <div className="py-4">
            <Button
              type="submit"
              onclick={() => {}}
              label="Login"
              width="w-[100%]"
              bgColor="bg-gradient-to-r from-green-700 to-green-900"
              color="text-white"
              disabled={loading}
            />
          </div>
        </form>
      </AuthCard>
    </>
  );
};

export default Login;
