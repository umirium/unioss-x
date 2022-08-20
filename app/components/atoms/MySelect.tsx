import type { SelectProps } from "@mui/material";
import { InputLabel, Select, MenuItem, FormHelperText } from "@mui/material";
import { red } from "@mui/material/colors";
import type { TFunction } from "react-i18next";
import { useTranslation } from "react-i18next";
import { useField } from "remix-validated-form";

interface MySelectProps extends SelectProps {
  label: string;
  required?: boolean;
  menuItems: (t: TFunction) => {
    value: number | string;
    label: string;
  }[];
}

export const MySelect = (props: MySelectProps) => {
  const { error, getInputProps } = useField(props.label);
  const { t } = useTranslation(["common", "front", "validator"]);

  return (
    <>
      <InputLabel error={!!error}>{`${t(`front:${props.label}`)}${
        props.required ? " *" : ""
      }`}</InputLabel>
      <Select
        {...getInputProps<SelectProps>({ id: props.label })}
        label={`${t(`front:${props.label}`)}${props.required ? " *" : ""}`}
        defaultValue={props.defaultValue}
        onChange={props.onChange}
        error={!!error}
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
        {t(`validator:${error ?? ""}`)}
      </FormHelperText>
    </>
  );
};
