import { useTranslation } from "react-i18next";

export default function Products() {
  const { t } = useTranslation("front");

  return <h1>{t("products")}</h1>;
}
