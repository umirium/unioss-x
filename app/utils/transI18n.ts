import type { TFunction } from "react-i18next";
import type { NoticeType } from "~/types/outline";

const transI18n = (
  type: "alert" | "notice",
  i18nObj: NoticeType,
  t: TFunction
) => {
  if (!i18nObj) {
    return "";
  }

  // translate options as well
  const transOptions: {
    [key: string]: string;
  } = {};

  Object.keys(i18nObj.options || {}).forEach((key) => {
    if (i18nObj.options === undefined) {
      return "";
    }

    transOptions[key] = t(i18nObj.options[key]);
  });

  // NOTE: If possibility of same data is sent, timestamp shall be given.
  return t(`${type}:${i18nObj.key.split("_")[0]}`, transOptions);
};

export default transI18n;
