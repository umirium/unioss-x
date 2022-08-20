import { useTranslation } from "react-i18next";

export default function Products() {
  const { t } = useTranslation();

  return <h1>{t("front:products")}</h1>;
}
