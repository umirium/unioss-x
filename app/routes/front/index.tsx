import { useTranslation } from "react-i18next";

export default function Index() {
  const { t } = useTranslation("front");

  return <h1>{t("top")}</h1>;
}
