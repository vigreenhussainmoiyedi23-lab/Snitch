import ReactSelectCreatable from "react-select/creatable";
import {
  Controller,
  type FieldValues,
  type Path,
  useFormContext,
} from "react-hook-form";
export type Option = {
  label: string;
  value: string;
};
type CreatableInputProps<T extends FieldValues> = {
  name: Path<T>;
  options: string[];
  placeholder?: string;
};

const CreatableInput = <T extends FieldValues>({
  name,
  options,
  placeholder,
}: CreatableInputProps<T>) => {
  const { control } = useFormContext<T>();

  return (
    <div className="flex flex-col gap-3">
      <label
        className="text-primary-lighter w-full capitalize text-[10px] md:text-xs font-serif tracking-[3px] text-start"
        htmlFor={name}
      >
        {name}
      </label>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <ReactSelectCreatable<Option, false>
            options={options.map((o) => ({
              label: o,
              value: o,
            }))}
            value={
              field.value
                ? {
                    label: field.value,
                    value: field.value,
                  }
                : null
            }
            onChange={(option) => field.onChange(option?.value ?? "")}
            onCreateOption={(input) => field.onChange(input)}
            placeholder={placeholder}
            required={true}
            styles={{
              control: (base, state) => ({
                ...base,
                minHeight: "48px",
                borderRadius: "10px",
                overflow: "hidden",
                borderColor: state.isFocused ? "#6b7280" : "#d1d5db",
                boxShadow: "none",
                "&:hover": {
                  borderColor: "#6b7280",
                },
                backgroundColor: "var(--color-background)",
              }),
              menu: (base) => ({
                ...base,
                borderRadius: "12px",
                overflow: "hidden",

                backgroundColor: "var(--color-background)",
              }),
              option: (base, state) => ({
                ...base,
                backgroundColor: state.isFocused
                  ? "var(--color-primary)"
                  : "var(--color-background)",
                color: state.isFocused
                  ? "var(--color-background)"
                  : "var(--color-text)",
              }),
            }}
            isClearable
          />
        )}
      />
    </div>
  );
};

export default CreatableInput;
