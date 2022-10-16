import type { InputProps } from "@mui/material";
import { Input } from "@mui/material";
import { useField } from "remix-validated-form";

interface MyInputProps extends InputProps {
  type: string;
  label: string;
  defaultValue: string;
  onValidate?: "blur" | "submit";
}

export const MyInput = (props: MyInputProps) => {
  const { error, getInputProps } = useField(props.label, {
    validationBehavior:
      props.onValidate === "submit"
        ? {
            initial: "onSubmit",
            whenTouched: "onSubmit",
            whenSubmitted: "onSubmit",
          }
        : {
            initial: "onBlur",
            whenTouched: "onChange",
            whenSubmitted: "onChange",
          },
  });

  return (
    <>
      <Input
        {...getInputProps({ id: props.label })}
        {...props}
        error={!!error}
      />
    </>
  );
};
