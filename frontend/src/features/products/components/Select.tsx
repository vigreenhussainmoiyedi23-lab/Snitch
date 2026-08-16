import React from "react";

const Select = ({
  label,
  array,
  value,
  handleOnChange,
  Name,
  register,
}: {
  label: string;
  array: string[];
  value?: string;
  Name: string;
  handleOnChange?: (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>,
  ) => void;
  register?: any;
}) => {
  return (
    <div className="space-y-4">
      <label className="text-xs font-semibold eczar capitalize tracking-widest  text-primary-light">
        {label}
      </label>
      <div className="flex flex-col gap-3">
        <select
          className="bg-background text-text focus:ring-1 focus:ring-gold font-semibold mate px-3 py-2 rounded capitalize border-border border outline-0  "
          name={Name}
          {...(register
            ? register(Name)
            : {
                value: value,
                onChange: handleOnChange,
              })}
        >
          <option value="" disabled hidden>
            {label}
          </option>
          {array.map((val) => (
            <option key={val} value={val}>
              {val}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Select;
