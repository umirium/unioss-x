import { useTranslation } from "react-i18next";

export default function Index() {
  const { t } = useTranslation();

  return <h1>{t("front:top")}</h1>;
}
