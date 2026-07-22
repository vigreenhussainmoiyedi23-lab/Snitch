import ShowError from "./ShowError";
import Input from "./Input";
import { Lock, Mail, User } from "lucide-react";
interface RegisterData extends LoginData {
  username: string;
}
export interface LoginData {
  email: string;
  password: string;
}
const Form = ({ register, handleSubmit, submitHandler, isRegister }: any) => {
  return (
    <form
      onSubmit={handleSubmit(submitHandler)}
      className="flex flex-col gap-4"
    >
      {isRegister && (
        <Input<RegisterData>
          register={register}
          name="username"
          type="text"
          placeholder="Enter your username"
          icon={<User width={16} />}
        />
      )}
      <Input<LoginData>
        register={register}
        name="email"
        type="email"
        placeholder="Enter your email"
        icon={<Mail width={16} />}
      />

      <Input<LoginData>
        register={register}
        name="password"
        type="password"
        placeholder="Enter your password"
        icon={<Lock width={16} />}
      />
      <ShowError />
      {!isRegister && (
        <div className="flex justify-end hover:text-text text-white">
          <button type="button" className="text-xs transition-colors">
            Forgot password?
          </button>
        </div>
      )}
      <button
        type="submit"
        className="bg-text text-gold text-lg    font-bold mt-1 h-12 w-full rounded-lg "
     
      >
        {isRegister ? "Sign Up" : "Sign In"}
      </button>
    </form>
  );
};

export default Form;
