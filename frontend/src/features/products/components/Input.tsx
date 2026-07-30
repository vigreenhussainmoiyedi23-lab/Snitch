import type { FieldValues, Path, UseFormRegister } from "react-hook-form";
import {  type ReactNode } from "react";

type InputProps<T extends FieldValues> = {
  register: UseFormRegister<T>;
  name: Path<T>;
  type: string;
  placeholder?: string;
  icon?: ReactNode;
  minLength?: number;
};

const Input = <T extends FieldValues>({
  register,
  name,
  type,
  placeholder,
  icon,
  minLength,
}: InputProps<T>) => {
  return (
    <>
      <div className="relative flex flex-col items-center font-semibold text-text rounded">
        <label
          className="text-background-light w-full   text-xs font-serif tracking-[3px] text-start "
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
          <input
            {...register(name)}
            type={type}
            placeholder={placeholder}
            minLength={minLength || 10}
            required={true}
            className={`input-arena w-full outline-none h-12 rounded-lg px-4 text-sm ${icon ? "pl-10" : ""} `}
          />
        </div>
      </div>
    </>
  );
};

export default Input;
