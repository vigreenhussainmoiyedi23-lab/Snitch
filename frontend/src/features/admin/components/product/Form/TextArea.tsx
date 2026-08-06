import type { FieldValues, Path, UseFormRegister } from "react-hook-form";
import { type ReactNode } from "react";

type InputProps<T extends FieldValues> = {
  register: UseFormRegister<T>;
  name: Path<T>;
  placeholder?: string;
  icon?: ReactNode;
  minLength?: number;
  isRequired?: boolean;
  height?: number;
};

const TextArea = <T extends FieldValues>({
  register,
  name,
  placeholder,
  icon,
  minLength,
  isRequired,
  height=32
}: InputProps<T>) => {
  return (
    <>
      <div className="relative mb-5 flex flex-col items-center font-semibold text-text rounded">
        <label
          className="text-primary-lighter w-full   text-xs font-serif tracking-[3px] text-start "
          htmlFor={name}
        >
          {name}
        </label>
        <div className="relative flex items-center mt-2 w-full bg-background font-semibold text-text rounded">
          {icon && (
            <span className="absolute left-3 text-gold-dark pointer-events-none">
              {icon}
            </span>
          )}
          <textarea
            {...register(name)}
            placeholder={placeholder}
            minLength={minLength || 10}
            required={!!isRequired}
            className={`input-arena h-${height} w-full py-2 outline-none  rounded-lg px-4 text-sm ${icon ? "pl-10" : ""} `}
          />
        </div>
      </div>
    </>
  );
};

export default TextArea;
