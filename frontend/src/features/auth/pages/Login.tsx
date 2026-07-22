import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import Input from "../components/Input";
import { useAuth } from "../hooks/useAuth";
import ShowError from "../components/ShowError";
import { Lock, Mail } from "lucide-react";
import BrandHeader from "../components/BrandHeader";
import Divider from "../components/Divider";
import Form from "../components/Form";
import FormHeading from "../components/FormHeading";
import DividerOr from "../components/DividerOr";
import Redirect from "../components/Redirect";

export interface LoginData {
  email: string;
  password: string;
}

export default function Login() {
  const { register, handleSubmit } = useForm<LoginData>();
  const { loginHandler } = useAuth();
  async function submitHandler(data: LoginData) {
    await loginHandler(data);
  }

  return (
    <main className="min-h-screen flex items-center bg-text justify-center px-4 relative overflow-hidden">
      {/* Login Card */}
      <div
        className=" relative z-10 w-full max-w-110 bg-background rounded-2xl p-8 animate-fade-in"
        style={{
          boxShadow:
            "rgb(0 0 0 / 10%) 1px 20px 14px 0px, rgb(0 0 0 / 10%) -18px 20px 20px 4px",
        }}
      >
        <BrandHeader />
        <Divider />
        {/* Form heading */}

        <FormHeading title={"Sign In"} subtitle={"Sign in to your account."} />
        <Form
          register={register}
          handleSubmit={handleSubmit}
          submitHandler={submitHandler}
          isRegister={false}
        />

        <DividerOr />
        <Redirect
          title={"Sign Up"}
          to="/register"
          subtitle={"Don't have an account?"}
        />
      </div>
    </main>
  );
}
