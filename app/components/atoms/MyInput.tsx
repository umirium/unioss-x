import type { InputProps } from "@mui/material";
import { Input } from "@mui/material";
import { useField } from "remix-validated-form";

interface MyInputProps extends InputProps {
  type: string;
  label: string;
  defaultValue: string;
}

export const MyInput = (props: MyInputProps) => {
  const { error, getInputProps } = useField(props.label);

  return (
    <>
      <Input
        {...getInputProps({ id: props.label })}
        name={props.label}
        type={props.type}
        defaultValue={props.defaultValue}
        error={!!error}
        autoFocus={props.autoFocus}
      />
    </>
  );
};
