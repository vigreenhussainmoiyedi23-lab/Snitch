import type { FieldValues, Path, UseFormRegister } from "react-hook-form";
import { type ReactNode } from "react";

type InputProps<T extends FieldValues> = {
  register: UseFormRegister<T>;
  name: Path<T>;
  type: string;
  placeholder?: string;
  icon?: ReactNode;
  minLength?: number;
  maxLength?: number;
  isRequired?: boolean;
  min?: number;
  max?: number;
  defaultValue?: any;
};

const Input = <T extends FieldValues>({
  register,
  name,
  type,
  placeholder,
  icon,
  minLength,
  maxLength,
  isRequired,
  min,
  max,
  defaultValue,
}: InputProps<T>) => {
  return (
    <>
      <div className="relative w-full mate mb-2 md:mb-5 flex flex-col items-center font-semibold text-text rounded">
        <label
          className="text-primary-lighter w-full capitalize text-[10px] md:text-xs font-serif tracking-[3px] text-start "
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
            min={min}
            max={max}
            placeholder={placeholder}
            minLength={minLength || 3}
            maxLength={maxLength || 200}
            required={isRequired ?? true}
            defaultValue={defaultValue}
            className={`input-arena  w-full outline-none h-10 md:h-12 rounded-lg px-4 text-sm ${icon ? "pl-10" : ""} `}
          />
        </div>
      </div>
    </>
  );
};

export default Input;
