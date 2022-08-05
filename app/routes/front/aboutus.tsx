import { useTranslation } from "react-i18next";

export default function About() {
  const { t } = useTranslation("front");

  return <h1>{t("aboutus")}</h1>;
}
