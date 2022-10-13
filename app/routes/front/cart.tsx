import { useTranslation } from "react-i18next";

export default function Cart() {
  const { t } = useTranslation();

  return <h1>{t("front:cart")}</h1>;
}
