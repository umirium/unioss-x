import type { TFunction } from "react-i18next";

export const categories = (t: TFunction<"front">) => [
  {
    value: 1,
    label: t("front:aboutThisWebSite"),
  },
  {
    value: 2,
    label: t("front:aboutProducts"),
  },
  {
    value: 3,
    label: t("front:aboutAccess"),
  },
  {
    value: 4,
    label: t("front:other"),
  },
];
