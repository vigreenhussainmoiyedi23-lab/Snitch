import { Lock, Mail } from "lucide-react";
import Input from "../components/Input";
import { useForm } from "react-hook-form";
import ShowError from "../components/ShowError";
import { useAuth } from "../hooks/useAuth";
import { useParams } from "react-router-dom";

const ResetPassword = () => {
  const { register, handleSubmit, reset } = useForm();
  const { resetPasswordHandler } = useAuth();
  const { token } = useParams();
  const submitHandler = async (data: any) => {
    try {
      const response = await resetPasswordHandler({
        ...data,
        token: token || "",
      });
      if (response?.success) reset();
    } catch (error) {}
  };
  return (
    <div className="min-h-screen flex items-center bg-background justify-center px-4 relative overflow-hidden">
      <form
        className="flex max-w-110 flex-col gap-4 bg-text w-full rounded-2xl py-15 items-center justify-center"
        onSubmit={handleSubmit(submitHandler)}
      >
        <h1 className="text-2xl font-bold text-white mb-1">
          Enter Your Password
        </h1>
        <Input
          register={register}
          name="password"
          type="text"
          placeholder="Enter your new password"
          icon={<Lock width={16} />}
        />
        <button
          type="submit"
          className="bg-gold-dark text-white py-2 px-4 rounded"
        >
          Submit
        </button>
        <ShowError />
      </form>
    </div>
  );
};

export default ResetPassword;
