import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import Input from "../components/Input";
import type { LoginData } from "./Login";
import { useAuth } from "../hooks/useAuth";
import ShowError from "../components/ShowError";
import { Lock, Mail, User } from "lucide-react";
import BrandHeader from "../components/BrandHeader";
import Form from "../components/Form";
import FormHeading from "../components/FormHeading";
import DividerOr from "../components/DividerOr";
import Divider from "../components/Divider";
import Redirect from "../components/Redirect";

interface RegisterData extends LoginData {
  username: string;
}

export default function Register() {
  const { register, handleSubmit } = useForm<RegisterData>();
  const { RegisterHandler } = useAuth();
  async function submitHandler(data: RegisterData) {
    await RegisterHandler(data);
  }

  return (
    <main className="min-h-screen bg-text flex items-center justify-center px-4 relative overflow-hidden">
      {/* Card */}
      <div
        className="bg-background relative z-10 w-full max-w-[440px] rounded-2xl p-8 animate-fade-in"
        style={{
          boxShadow:
            "0 0 0 1px rgba(168,85,247,0.08), 0 24px 80px rgba(0,0,0,0.6), 0 0 40px rgba(168,85,247,0.05)",
        }}
      >
        <BrandHeader />
        <Divider />
     

        <FormHeading title={"Sign Up"} subtitle={"Create your account."} />
        <Form
          register={register}
          handleSubmit={handleSubmit}
          submitHandler={submitHandler}
          isRegister
        />

        <DividerOr />

        <Redirect
          title="Sign In"
          to="/login"
          subtitle="Already have an account?"
        />
      </div>
    </main>
  );
}
