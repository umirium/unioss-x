import type { SelectChangeEvent } from "@mui/material";
import {
  Box,
  Breadcrumbs,
  FormControl,
  InputLabel,
  Link as MUILink,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import type { ActionArgs, LoaderArgs, MetaFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, Link as RemixLink, useLoaderData } from "@remix-run/react";
import camelcaseKeys from "camelcase-keys";
import type { definitions } from "~/types/tables";
import { db } from "~/utils/db.server";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import {
  commitSession as commitAlertSession,
  getSession as getAlertSession,
} from "~/utils/sessions/alert.server";
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

export const meta: MetaFunction<typeof loader> = ({ data, parentsData }) => {
  return {
    title: `${parentsData["routes/front"].siteTitle} | products | ${data.product?.productName}`,
  };
};

export const loader = async ({ params, request }: LoaderArgs) => {
  const url = new URL(request.url);
  const page = url.searchParams.get("page");
  let alert: NoticeType | undefined = undefined;

  let product;

  try {
    const { data, error } = await db
      .from<definitions["products"]>("products")
      .select("*")
      .eq("id", params.product_id)
      .single();

    if (error) {
      console.log(error);
      throw new Error("read", { cause: error });
    }

    product = data;
  } catch (error: Error | unknown) {
    // show alert of database errors
    if (error instanceof Error) {
      alert = {
        key: `dbErrors_${Date.now()}`,
        options: { error: `common:${error.message}` },
      };
    } else {
      alert = {
        key: `unknown_${Date.now()}`,
      };
    }
  }

  return { product: product ? camelcaseKeys(product) : product, page, alert };
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

    // If same product is in database as putting cart, add quantity.
    try {
      // get cart data from database
      const { data, error } = await db
        .from<definitions["carts"]>("carts")
        .select("*")
        .eq("user_id", authUser.id)
        .eq("delete_flg", false);

      if (error) {
        throw new Error("read", { cause: error });
      }

      const same = camelcaseKeys(data).find(
        (e) => e.productId === formData.productId
      );

      if (same) {
        const { error } = await db
          .from<definitions["carts"]>("carts")
          .update(
            snakecaseKeys({
              quantity: same.quantity + formData.quantity,
            })
          )
          .eq("id", same.id)
          .eq("delete_flg", false);

        if (error) {
          throw new Error("update", { cause: error });
        }
      } else {
        // same product does not exist in database

        // insert cart data to database
        const { error } = await db.from<definitions["carts"]>("carts").insert([
          snakecaseKeys({
            userId: authUser.id,
            deleteFlg: false,
            ...formData,
          }),
        ]);

        if (error) {
          throw new Error("create", { cause: error });
        }
      }
    } catch (error: Error | unknown) {
      // show alert of database errors
      const alertSession = await getAlertSession(request.headers.get("cookie"));

      if (error instanceof Error) {
        alertSession.flash("alert", {
          key: `dbErrors_${Date.now()}`,
          options: { error: `common:${error.message}` },
        });
      } else {
        alertSession.flash("alert", {
          key: `unknown_${Date.now()}`,
        });
      }

      const headers = new Headers();
      headers.append("Set-Cookie", await commitAlertSession(alertSession));

      return redirect(request.url, { headers });
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
  const { product, page, alert } = useLoaderData<typeof loader>();
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
          <Breadcrumbs sx={{ mb: 5 }}>
            <MUILink
              underline="hover"
              color="inherit"
              component={RemixLink}
              to={`/front/products${page ? `?page=${page}` : ""}`}
            >
              products
            </MUILink>
            <Typography color="text.primary">{product?.productName}</Typography>
          </Breadcrumbs>

          <Grid container spacing={3}>
            <Grid xs={12} sm={12} md={6}>
              <img
                src={product?.imageUrl}
                alt={product?.productName}
                width="100%"
              />
            </Grid>
            <Grid xs={12} sm={12} md={6}>
              <Grid container spacing={3}>
                <Grid xs={12} sm={8} md={12}>
                  <Typography variant="h4">{product?.productName}</Typography>
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
