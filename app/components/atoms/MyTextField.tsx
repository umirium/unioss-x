import type { StandardTextFieldProps } from "@mui/material";
import { TextField } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useField } from "remix-validated-form";

interface MyTextFieldProps extends StandardTextFieldProps {
  label: string;
  required?: boolean;
}

export const MyTextField = (props: MyTextFieldProps) => {
  const { error, getInputProps } = useField(props.label);
  const { t } = useTranslation(["front", "validator"]);

  return (
    <>
      <TextField
        {...getInputProps({ id: props.label })}
        label={`${t(`front:${props.label}`)}${props.required ? " *" : ""}`}
        variant={props.variant && "outlined"}
        defaultValue={props.defaultValue}
        multiline={props.multiline}
        rows={props.rows}
        error={!!error}
        helperText={t(`validator:${error ?? ""}`)}
      />
    </>
  );
};
