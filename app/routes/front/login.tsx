import { useTranslation } from "react-i18next";

export default function Login() {
  const { t } = useTranslation();

  return <h1>{t("common:login")}</h1>;
}
