import { Mail } from "lucide-react";
import Input from "../components/Input";
import { useForm } from "react-hook-form";
import ShowError from "../components/ShowError";
import { useAuth } from "../hooks/useAuth";

const ForgotPassword = () => {
  const { register, handleSubmit, reset } = useForm();
  const { forgotHandler } = useAuth();
  const submitHandler = async (data: any) => {
    try {
      await forgotHandler(data);
    } catch (error) {
      
    }
    reset();
  };
  return (
    <div className="min-h-screen flex items-center bg-background justify-center px-4 relative overflow-hidden">
      <form
        className="flex max-w-110 flex-col gap-4 bg-text w-full rounded-2xl py-15 items-center justify-center"
        onSubmit={handleSubmit(submitHandler)}
      >
        <h1 className="text-2xl font-bold text-white mb-1">Enter Your Email</h1>
        <Input
          register={register}
          name="email"
          type="email"
          placeholder="Enter your email"
          icon={<Mail width={16} />}
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

export default ForgotPassword;
