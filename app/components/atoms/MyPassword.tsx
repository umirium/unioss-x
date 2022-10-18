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
import type { ChangeEvent } from "react";
import { forwardRef, useImperativeHandle, useState } from "react";
import { useTranslation } from "react-i18next";
import { useField } from "remix-validated-form";
import type { PasswordFieldHandler } from "~/types/outline";

interface MyPasswordProps extends OutlinedInputProps {
  label: string;
  defaultValue: string | undefined;
  required?: boolean;
  onValidate?: "blur" | "submit";
}

export default forwardRef<PasswordFieldHandler, MyPasswordProps>(
  function MyPassword(props: MyPasswordProps, ref) {
    // Delete "required" as "please fill out this field" is displayed.
    const { defaultValue, required, onValidate, sx, ...restProps } = props;
    const [value, setValue] = useState(defaultValue);
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

    // Allow other components can reset value.
    useImperativeHandle(ref, () => ({
      reset: () => {
        setValue("");
      },
    }));

    const handleClickShowPassword = () => {
      setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (
      event: React.MouseEvent<HTMLButtonElement>
    ) => {
      event.preventDefault();
    };

    const handleChange = (
      e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
    ) => {
      setValue(e.target.value);
    };

    return (
      <FormControl sx={props.sx} variant="outlined" fullWidth>
        <InputLabel error={!!error}>{`${t(`front:${props.label}`)}${
          props.required ? " *" : ""
        }`}</InputLabel>
        <OutlinedInput
          {...getInputProps({ id: props.label })}
          {...restProps}
          type={showPassword ? "text" : "password"}
          value={value}
          error={!!error}
          onChange={handleChange}
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
  }
);
