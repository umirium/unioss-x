import { useTranslation } from "react-i18next";

export default function About() {
  const { t } = useTranslation();

  return <h1>{t("front:aboutus")}</h1>;
}
