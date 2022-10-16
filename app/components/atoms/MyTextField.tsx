import type { StandardTextFieldProps } from "@mui/material";
import { TextField } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useField } from "remix-validated-form";

interface MyTextFieldProps extends StandardTextFieldProps {
  label: string;
  defaultValue: string | undefined;
  required?: boolean;
  onValidate?: "blur" | "submit";
}

export const MyTextField = (props: MyTextFieldProps) => {
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
  const { t } = useTranslation(["front", "validator"]);
  // Delete "required" as "please fill out this field" is displayed.
  const { required, ...removeRequiredProps } = props;

  return (
    <>
      <TextField
        {...getInputProps({ id: props.label })}
        {...removeRequiredProps}
        label={`${t(`front:${props.label}`)}${props.required ? " *" : ""}`}
        variant={props.variant && "outlined"}
        error={!!error}
        helperText={error && t(`validator:${error}`)}
      />
    </>
  );
};
