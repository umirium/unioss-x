import { Box } from "@mui/material";
import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import type { definitions } from "~/types/tables";
import { db } from "~/utils/db.server";

export const loader: LoaderFunction = async () => {
  const products = await db
    .from<Array<definitions["products"]>>("products")
    .select("*");

  return products ? products.data : [];
};

export default function Products() {
  const { t } = useTranslation();
  const products = useLoaderData<Array<definitions["products"]>>();

  return (
    <>
      <h1>{t("front:products")}</h1>

      <Box>
        {products.map((item, index) => (
          <Box key={index}>{item.product_name}</Box>
        ))}
      </Box>
    </>
  );
}
