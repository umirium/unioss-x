import { VisibilityOff, Visibility } from "@mui/icons-material";
import type { OutlinedInputProps } from "@mui/material";
import {
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import { red } from "@mui/material/colors";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useField } from "remix-validated-form";

interface MyPasswordProps extends OutlinedInputProps {
  label: string;
  defaultValue: string | undefined;
  required?: boolean;
  onValidate?: "blur" | "submit";
}

export const MyPassword = (props: MyPasswordProps) => {
  const [showPassword, setShowPassword] = useState(false);
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
  const { required, sx, ...removeRequiredSxProps } = props;

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  return (
    <FormControl sx={props.sx} variant="outlined" fullWidth>
      <InputLabel error={!!error}>{`${t(`front:${props.label}`)}${
        props.required ? " *" : ""
      }`}</InputLabel>
      <OutlinedInput
        {...getInputProps({ id: props.label })}
        {...removeRequiredSxProps}
        type={showPassword ? "text" : "password"}
        error={!!error}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
              edge="end"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        }
      />
      <FormHelperText sx={{ color: red[500] }}>
        {error && t(`validator:${error}`)}
      </FormHelperText>
    </FormControl>
  );
};
