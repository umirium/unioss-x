import type { StandardTextFieldProps } from "@mui/material";
import { TextField } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useField } from "remix-validated-form";

interface MyTextFieldProps extends StandardTextFieldProps {
  name: string;
  required?: boolean;
}

export const MyTextField = (props: MyTextFieldProps) => {
  const { error, getInputProps } = useField(props.name);
  const { t } = useTranslation("front");
  const { t: vt } = useTranslation("validator");

  return (
    <>
      <TextField
        {...props}
        {...getInputProps({ id: props.name })}
        label={`${t(props.name)}${props.required ? " *" : ""}`}
        variant={props.variant && "outlined"}
        error={!!error}
        helperText={vt(error ?? "")}
      />
    </>
  );
};
