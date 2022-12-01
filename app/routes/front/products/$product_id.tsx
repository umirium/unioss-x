import type { SelectChangeEvent } from "@mui/material";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import type { ActionArgs, LoaderArgs, MetaFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import camelcaseKeys from "camelcase-keys";
import type { definitions } from "~/types/tables";
import { db } from "~/utils/db.server";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import {
  getSession as getCartSession,
  commitSession as commitCartSession,
} from "~/utils/sessions/cart.server";
import {
  commitSession as commitNoticeSession,
  getSession as getNoticeSession,
} from "~/utils/sessions/notice.server";
import { MySubmitButton } from "~/components/atoms/MySubmitButton";
import { authenticator } from "~/utils/auth.server";
import snakecaseKeys from "snakecase-keys";
import type { NoticeType } from "~/types/outline";
import type { SnakeToCamel } from "snake-camel-types";
import { useShowAlertContext } from "~/providers/alertProvider";
import query from "~/utils/query.server";
import { getBreadcrumbs } from "~/components/products/Breadcrumbs";

export const meta: MetaFunction<typeof loader> = ({ data, parentsData }) => {
  return {
    title: `${parentsData["routes/front"].siteTitle} | products | ${data.product?.name}`,
  };
};

export const loader = async ({ params, request }: LoaderArgs) => {
  const url = new URL(request.url);
  const q = url.searchParams.get("q") || undefined;
  const page = Number(url.searchParams.get("page")) || 1;

  const result = await query(() =>
    db
      .from<definitions["products"]>("products")
      .select("*")
      .eq("id", params.product_id)
      .limit(1)
  );

  return {
    product: result.data?.[0],
    page,
    q,
    alert: result.err as NoticeType,
  };
};

export const action = async ({ request }: ActionArgs) => {
  const form = await request.formData();

  const authUser = await authenticator.isAuthenticated(request);

  const formData = {
    productId: Number.parseInt(form.get("id") as string),
    quantity: Number.parseInt(form.get("quantity") as string),
  };

  // if signed-in, update cart data in database
  if (authUser) {
    /**
     * save cart data to database
     */
    const cartDB = await query(
      () =>
        db
          .from<definitions["carts"]>("carts")
          .select("*")
          .eq("user_id", authUser.id)
          .eq("delete_flg", false),
      request
    );

    if (cartDB.err) {
      return cartDB.err;
    }

    const same = camelcaseKeys(cartDB.data).find(
      (e) => e.productId === formData.productId
    );

    if (same) {
      // If same product is in database as putting cart, add quantity.

      const { err } = await query(
        () =>
          db
            .from<definitions["carts"]>("carts")
            .update(
              snakecaseKeys({
                quantity: same.quantity + formData.quantity,
              })
            )
            .eq("id", same.id)
            .eq("delete_flg", false),
        request
      );

      if (err) {
        return err;
      }
    } else {
      // same product does not exist in database
      // insert cart data to database

      const { err } = await query(
        () =>
          db.from<definitions["carts"]>("carts").insert([
            snakecaseKeys({
              userId: authUser.id,
              deleteFlg: false,
              ...formData,
            }),
          ]),
        request
      );

      if (err) {
        return err;
      }
    }
  }

  /**
   * save cart data to cookie
   */
  const cartSession = await getCartSession(request.headers.get("Cookie"));
  const cart: Array<
    Pick<SnakeToCamel<definitions["carts"]>, "productId" | "quantity">
  > = cartSession.get("cart") || [];

  // If same product is in cookie as putting cart, add quantity.
  let flg = false;
  const newCart = cart.map((e: typeof formData) => {
    if (e.productId === formData.productId) {
      flg = true;

      return {
        productId: e.productId,
        quantity: e.quantity + formData.quantity,
      };
    }

    return e;
  });

  if (!flg) {
    // same product does not exist in cookie
    newCart.push(formData);
  }

  cartSession.set("cart", newCart);

  // show snackbar of 'added to cart'
  const noticeSession = await getNoticeSession(request.headers.get("cookie"));
  noticeSession.flash("notice", { key: `addedToCart_${Date.now()}` });

  const headers = new Headers();
  headers.append("Set-Cookie", await commitCartSession(cartSession));
  headers.append("Set-Cookie", await commitNoticeSession(noticeSession));

  return redirect("/front/cart", { headers });
};

export default function Product() {
  const { product, page, q, alert } = useLoaderData<typeof loader>();
  const [quantity, setQuantity] = useState("1");
  const { showAlert } = useShowAlertContext();
  const { t } = useTranslation();

  useEffect(() => {
    showAlert(alert);
  }, [alert, showAlert]);

  const handleChange = (event: SelectChangeEvent) => {
    setQuantity(event.target.value);
  };

  return (
    <>
      {product && (
        <>
          {getBreadcrumbs({ q, page, productName: product?.name })}

          <Grid container spacing={3} sx={{ mt: 5 }}>
            <Grid xs={12} sm={12} md={6}>
              <img src={product?.imageUrl} alt={product?.name} width="100%" />
            </Grid>
            <Grid xs={12} sm={12} md={6}>
              <Grid container spacing={3}>
                <Grid xs={12} sm={8} md={12}>
                  <Typography variant="h4">{product?.name}</Typography>
                  <Box sx={{ mt: 3 }}>{product?.description}</Box>
                  <Box sx={{ mt: 3 }}>
                    {t("common:price")}:{" "}
                    <Typography variant="h5" component="span">
                      {t("common:jpy", {
                        price: product?.price.toLocaleString(),
                      })}
                    </Typography>
                  </Box>
                </Grid>

                <Grid
                  xs={12}
                  sm={4}
                  md={12}
                  sx={{
                    mt: { xs: 3, sm: 0, md: 3 },
                    textAlign: { xs: "center", sm: "right", md: "center" },
                  }}
                >
                  <Form method="post">
                    <Box>
                      <FormControl sx={{ minWidth: 80 }} size="small">
                        <input type="hidden" name="id" value={product?.id} />
                        <InputLabel id="quantity">
                          {t("common:quantity")}
                        </InputLabel>
                        <Select
                          name="quantity"
                          labelId="quantity"
                          label={t("common:quantity")}
                          value={quantity}
                          onChange={handleChange}
                        >
                          {[...new Array(30)].map((_key, value) => (
                            <MenuItem key={value} value={value + 1}>
                              {value + 1}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>
                    <Box sx={{ mt: 2 }}>
                      <MySubmitButton
                        label="addToCart"
                        type="submit"
                        color="warning"
                        endIcon={<AddShoppingCartIcon />}
                      />
                    </Box>
                  </Form>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </>
      )}
    </>
  );
}
