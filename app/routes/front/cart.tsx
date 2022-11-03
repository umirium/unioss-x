import { Box } from "@mui/material";
import type { LoaderArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import camelcaseKeys from "camelcase-keys";
import { useTranslation } from "react-i18next";
import type { SnakeToCamel } from "snake-camel-types";
import type { definitions } from "~/types/tables";
import { db } from "~/utils/db.server";
import { getSession as getCartSession } from "~/utils/sessions/cart.server";

export const loader = async ({ request }: LoaderArgs) => {
  const cartSession = await getCartSession(request.headers.get("Cookie"));
  const cart: Array<SnakeToCamel<definitions["carts"]>> =
    cartSession.get("cart");

  if (!cart) {
    return { cart: [] };
  }

  try {
    // get product info
    const { data, error } = await db
      .from<definitions["products"] & { quantity: number }>("products")
      .select("*", { count: "exact" })
      .in(
        "id",
        cart.map(({ productId }) => productId)
      )
      .eq("delete_flg", false)
      .order("id");

    if (error) {
      throw error;
    }

    return {
      // add cart item quantity to product info
      cart: camelcaseKeys(data).map((e) => {
        const product = e;

        const cartItem = camelcaseKeys(cart).find((e) => {
          const item = e;

          if (item.productId === product.id) {
            return true;
          }

          return false;
        });

        product.quantity = cartItem ? cartItem.quantity : 0;

        return product;
      }),
    };
  } catch (error) {
    console.log(error);
  }
};

export default function Cart() {
  const { cart } = useLoaderData<typeof loader>();
  const { t } = useTranslation();

  return (
    <>
      <Box>
        <h1>{t("front:cart")}</h1>
      </Box>

      <Box>
        {t("common:total")}:{" "}
        {cart
          .reduce((sum, e) => sum + e.quantity * e.price, 0)
          .toLocaleString()}
        円
      </Box>
      <br />
      <Box>
        {cart.map((item, index) => (
          <Box key={index} sx={{ display: "flex" }}>
            <Box>
              <Link to={`/front/products/${item.id}`}>
                <img src={item.imageUrl} alt={item.productName} width={200} />
              </Link>
            </Box>

            <Box sx={{ ml: 2 }}>
              <br />
              {t("front:productName")}: {item.productName}
              <br />
              {t("common:quantity")}: {item.quantity}
              <br />
              <br />
              {t("common:subtotal")}:{" "}
              {(item.quantity * item.price).toLocaleString()}円
            </Box>
          </Box>
        ))}
      </Box>
    </>
  );
}
