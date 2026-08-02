import ReactSelectCreatable from "react-select/creatable";
import { Controller,type FieldValues,type Path, useFormContext } from "react-hook-form";
type Option = {
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
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <ReactSelectCreatable<Option,false>
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
          isClearable
        />
      )}
    />
  );
};

export default CreatableInput;
