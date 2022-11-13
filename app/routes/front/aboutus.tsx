import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { useTranslation } from "react-i18next";

export const meta: MetaFunction<typeof loader> = ({ parentsData }) => {
  return {
    title: `${parentsData["routes/front"].siteTitle} | about us`,
  };
};

export const loader = async ({ request }: LoaderArgs) => {
  return null;
};

export default function About() {
  const { t } = useTranslation();

  return <h1>{t("front:aboutus")}</h1>;
}
