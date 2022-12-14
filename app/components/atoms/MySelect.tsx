import type { SelectChangeEvent, SelectProps } from "@mui/material";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import { red } from "@mui/material/colors";
import { useState } from "react";
import type { TFunction } from "react-i18next";
import { useTranslation } from "react-i18next";
import { useField } from "remix-validated-form";

interface MySelectProps extends SelectProps {
  label: string;
  defaultValue: string | undefined;
  required?: boolean;
  menuItems: (t: TFunction) => {
    value: number | string;
    label: string;
  }[];
  onValidate?: "blur" | "submit";
  fullWidth?: boolean;
}

export const MySelect = (props: MySelectProps) => {
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
  const { t } = useTranslation(["common", "front", "validator"]);
  const [value, setValue] = useState(props.defaultValue || "");

  const handleChange = (event: SelectChangeEvent) => {
    setValue(event.target.value);
  };

  return (
    <FormControl fullWidth={props.fullWidth || false}>
      <InputLabel error={!!error}>{`${t(`front:${props.label}`)}${
        props.required ? " *" : ""
      }`}</InputLabel>
      <Select
        {...getInputProps<SelectProps>({ id: props.label })}
        label={`${t(`front:${props.label}`)}${props.required ? " *" : ""}`}
        defaultValue={props.defaultValue}
        value={value}
        error={!!error}
        onChange={handleChange}
      >
        <MenuItem value="">
          <em>{t("common:_pleaseSelect_")}</em>
        </MenuItem>

        {props.menuItems(t).map((option, k) => (
          <MenuItem key={k} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      <FormHelperText sx={{ color: red[500] }}>
        {error && t(`validator:${error}`)}
      </FormHelperText>
    </FormControl>
  );
};
