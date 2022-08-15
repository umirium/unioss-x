import type { SelectProps } from "@mui/material";
import { InputLabel, Select, MenuItem, FormHelperText } from "@mui/material";
import { red } from "@mui/material/colors";
import type { TFunction } from "react-i18next";
import { useTranslation } from "react-i18next";
import { useField } from "remix-validated-form";

interface Item {
  value: number | string;
  label: string;
}

interface MySelectProps extends SelectProps {
  name: string;
  required?: boolean;
  menuItems: (t: TFunction) => Item[];
}

export const MySelect = (props: MySelectProps) => {
  const { error, getInputProps } = useField(props.name);
  const { t } = useTranslation("front");
  const { t: ct } = useTranslation("common");
  const { t: vt } = useTranslation("validator");

  return (
    <>
      <InputLabel>{`${t(props.name)}${props.required ? " *" : ""}`}</InputLabel>
      <Select
        {...getInputProps<SelectProps>({ id: props.name })}
        label={`${t(props.name)}${props.required ? " *" : ""}`}
        defaultValue=""
      >
        <MenuItem value="">
          <em>{ct("_pleaseSelect_")}</em>
        </MenuItem>

        {props.menuItems(ct).map((option, k) => (
          <MenuItem key={k} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      <FormHelperText sx={{ color: red[500] }}>
        {vt(error ?? "")}
      </FormHelperText>
    </>
  );
};
