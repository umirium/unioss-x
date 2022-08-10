import type { SelectProps } from "@mui/material";
import { InputLabel, MenuItem, Select } from "@mui/material";
import { useTranslation } from "react-i18next";

export default function PrefectureSelector(props: SelectProps) {
  const { t } = useTranslation("common");

  const prefectures = [
    {
      value: 1,
      label: t("hokkaido"),
    },
    {
      value: 2,
      label: t("aomori"),
    },
    {
      value: 3,
      label: t("iwate"),
    },
    {
      value: 4,
      label: t("miyagi"),
    },
    {
      value: 5,
      label: t("akita"),
    },
    {
      value: 6,
      label: t("yamagata"),
    },
    {
      value: 7,
      label: t("fukushima"),
    },
    {
      value: 8,
      label: t("ibaraki"),
    },
    {
      value: 9,
      label: t("tochigi"),
    },
    {
      value: 10,
      label: t("gunma"),
    },
    {
      value: 11,
      label: t("saitama"),
    },
    {
      value: 12,
      label: t("chiba"),
    },
    {
      value: 13,
      label: t("tokyo"),
    },
    {
      value: 14,
      label: t("kanagawa"),
    },
    {
      value: 15,
      label: t("niigata"),
    },
    {
      value: 16,
      label: t("toyama"),
    },
    {
      value: 17,
      label: t("ishikawa"),
    },
    {
      value: 18,
      label: t("fukui"),
    },
    {
      value: 19,
      label: t("yamanashi"),
    },
    {
      value: 20,
      label: t("nagano"),
    },
    {
      value: 21,
      label: t("gifu"),
    },
    {
      value: 22,
      label: t("shizuoka"),
    },
    {
      value: 23,
      label: t("aichi"),
    },
    {
      value: 24,
      label: t("mie"),
    },
    {
      value: 25,
      label: t("shiga"),
    },
    {
      value: 26,
      label: t("kyoto"),
    },
    {
      value: 27,
      label: t("osaka"),
    },
    {
      value: 28,
      label: t("hyogo"),
    },
    {
      value: 29,
      label: t("nara"),
    },
    {
      value: 30,
      label: t("wakayama"),
    },
    {
      value: 31,
      label: t("tottori"),
    },
    {
      value: 32,
      label: t("shimane"),
    },
    {
      value: 33,
      label: t("okayama"),
    },
    {
      value: 34,
      label: t("hiroshima"),
    },
    {
      value: 35,
      label: t("yamaguchi"),
    },
    {
      value: 36,
      label: t("tokushima"),
    },
    {
      value: 37,
      label: t("kagawa"),
    },
    {
      value: 38,
      label: t("ehime"),
    },
    {
      value: 39,
      label: t("kochi"),
    },
    {
      value: 40,
      label: t("fukuoka"),
    },
    {
      value: 41,
      label: t("saga"),
    },
    {
      value: 42,
      label: t("nagasaki"),
    },
    {
      value: 43,
      label: t("kumamoto"),
    },
    {
      value: 44,
      label: t("oita"),
    },
    {
      value: 45,
      label: t("miyazaki"),
    },
    {
      value: 46,
      label: t("kagoshima"),
    },
    {
      value: 47,
      label: t("okinawa"),
    },
  ];

  return (
    <>
      <InputLabel>{props.label}</InputLabel>
      <Select {...props}>
        <MenuItem value="">
          <em>{t("- please select -")}</em>
        </MenuItem>
        {prefectures.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </>
  );
}
